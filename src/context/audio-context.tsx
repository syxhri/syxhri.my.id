"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

type AudioContextType = {
  isMuted: boolean;
  isPlaying: boolean;
  trackTitle: string | null;
  trackArtist: string | null;
  toggleMute: () => void;
};

const AudioContext = createContext<AudioContextType>({
  isMuted: true,
  isPlaying: false,
  trackTitle: null,
  trackArtist: null,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackTitle, setTrackTitle] = useState<string | null>(null);
  const [trackArtist, setTrackArtist] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentKeyRef = useRef<string | null>(null);
  const isMutedRef = useRef<boolean>(true);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("asa_music_muted");
      if (saved === "false") {
        setIsMuted(false);
        isMutedRef.current = false;
      } else {
        setIsMuted(true);
        isMutedRef.current = true;
      }
    } catch {
      setIsMuted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.muted = isMutedRef.current;

      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const loadTrackAudio = async (title: string, artist: string) => {
      const key = `${title.toLowerCase().trim()}:::${artist.toLowerCase().trim()}`;
      if (currentKeyRef.current === key) return;

      currentKeyRef.current = key;
      setTrackTitle(title);
      setTrackArtist(artist);

      try {
        const res = await fetch(
          `/api/audio?title=${encodeURIComponent(title)}&artist=${encodeURIComponent(
            artist
          )}&format=json`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.audioUrl) {
          audio.src = data.audioUrl;
          audio.muted = isMutedRef.current;

          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              if (!isMutedRef.current) {
              }
            });
        }
      } catch (err) {
        console.error("Failed to load track audio:", err);
      }
    };

    const checkTrack = async () => {
      try {
        const res = await fetch("/api/now-playing", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.title) {
          loadTrackAudio(data.title, data.artist || "");
        }
      } catch (e) {
        console.error("Failed to check track:", e);
      }
    };

    checkTrack();

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      checkTrack();
    }, 25000);

    const handleFirstInteraction = () => {
      if (!isMutedRef.current && audio && audio.paused && audio.src) {
        audio.play().catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;

    try {
      localStorage.setItem("asa_music_muted", nextMuted ? "true" : "false");
    } catch {}

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <AudioContext.Provider
      value={{
        isMuted,
        isPlaying,
        trackTitle,
        trackArtist,
        toggleMute,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
