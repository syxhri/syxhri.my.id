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
  isMuted: false,
  isPlaying: false,
  trackTitle: null,
  trackArtist: null,
  toggleMute: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trackTitle, setTrackTitle] = useState<string | null>(null);
  const [trackArtist, setTrackArtist] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const currentKeyRef = useRef<string | null>(null);
  const isMutedRef = useRef<boolean>(false);
  const activeSourceRef = useRef<"youtube" | "html5">("youtube");
  const fallbackAudioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Read saved mute preference: default unmuted unless user explicitly muted
  useEffect(() => {
    try {
      const saved = localStorage.getItem("asa_music_muted");
      if (saved === "true") {
        setIsMuted(true);
        isMutedRef.current = true;
      } else {
        setIsMuted(false);
        isMutedRef.current = false;
      }
    } catch {
      setIsMuted(false);
      isMutedRef.current = false;
    }
  }, []);

  // Initialize YouTube API and fallback audio
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load YouTube Iframe API for full track playback
    if (!(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Prepare fallback HTML5 audio (dormant unless YouTube fails)
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = "none";
      audio.muted = isMutedRef.current;

      audio.onplay = () => {
        if (activeSourceRef.current === "html5") setIsPlaying(true);
      };
      audio.onpause = () => {
        if (activeSourceRef.current === "html5") setIsPlaying(false);
      };
      audio.onerror = () => {
        if (activeSourceRef.current === "html5") setIsPlaying(false);
      };

      audioRef.current = audio;
    }

    const initOrLoadYt = (videoId: string) => {
      activeSourceRef.current = "youtube";

      // Completely silence and unload HTML5 audio so it never plays simultaneously
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }

      const createPlayer = () => {
        try {
          ytPlayerRef.current = new (window as any).YT.Player("asa-yt-player", {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              loop: 1,
              playsinline: 1,
            },
            events: {
              onReady: (event: any) => {
                if (isMutedRef.current) {
                  event.target.mute();
                } else {
                  event.target.unMute();
                  event.target.setVolume(100);
                }
                event.target.playVideo();
              },
              onStateChange: (event: any) => {
                const YT = (window as any).YT;
                if (event.data === YT?.PlayerState?.ENDED) {
                  event.target.playVideo(); // Loop full song
                }
                if (event.data === YT?.PlayerState?.PLAYING) {
                  setIsPlaying(true);
                } else if (event.data === YT?.PlayerState?.PAUSED) {
                  setIsPlaying(false);
                }
              },
              onError: () => {
                // Only if YouTube fails, fall back to audio stream
                if (fallbackAudioUrlRef.current && audioRef.current) {
                  activeSourceRef.current = "html5";
                  audioRef.current.src = fallbackAudioUrlRef.current;
                  audioRef.current.muted = isMutedRef.current;
                  audioRef.current.play().catch(() => {});
                }
              },
            },
          });
        } catch (e) {
          console.error("Error creating YouTube player:", e);
        }
      };

      if ((window as any).YT && (window as any).YT.Player) {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function") {
          ytPlayerRef.current.loadVideoById(videoId);
          if (!isMutedRef.current) {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.setVolume(100);
          } else {
            ytPlayerRef.current.mute();
          }
          ytPlayerRef.current.playVideo();
        } else {
          createPlayer();
        }
      } else {
        (window as any).onYouTubeIframeAPIReady = () => {
          createPlayer();
        };
      }
    };

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

        fallbackAudioUrlRef.current = data?.audioUrl || null;

        // If YouTube ID available, play full song exclusively through YouTube
        if (data && data.youtubeId) {
          initOrLoadYt(data.youtubeId);
        } else if (data?.audioUrl && audioRef.current) {
          // Fallback if YouTube ID is somehow missing
          activeSourceRef.current = "html5";
          audioRef.current.src = data.audioUrl;
          audioRef.current.muted = isMutedRef.current;
          audioRef.current.play().catch(() => {});
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

    // Initial check
    checkTrack();

    // Check periodically for Last.fm changes every 20s
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      checkTrack();
    }, 20000);

    // Ensure audio starts unmuted on first interaction if blocked by browser policy
    const handleUserInteraction = () => {
      if (!isMutedRef.current) {
        if (activeSourceRef.current === "youtube" && ytPlayerRef.current && typeof ytPlayerRef.current.unMute === "function") {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
        } else if (activeSourceRef.current === "html5" && audioRef.current && audioRef.current.paused && audioRef.current.src) {
          audioRef.current.muted = false;
          audioRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener("pointerdown", handleUserInteraction, { once: true });
    window.addEventListener("click", handleUserInteraction, { once: true });
    window.addEventListener("keydown", handleUserInteraction, { once: true });
    window.addEventListener("touchstart", handleUserInteraction, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("pointerdown", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;

    try {
      localStorage.setItem("asa_music_muted", nextMuted ? "true" : "false");
    } catch {}

    // Only control the active player
    if (activeSourceRef.current === "youtube" && ytPlayerRef.current) {
      try {
        if (nextMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.setVolume(100);
          ytPlayerRef.current.playVideo();
        }
      } catch (e) {
        console.error("Error toggling YouTube mute:", e);
      }
    } else if (activeSourceRef.current === "html5" && audioRef.current) {
      audioRef.current.muted = nextMuted;
      if (!nextMuted) {
        audioRef.current.play().catch(() => {});
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
      {/* Hidden YouTube player container for full song audio */}
      <div
        style={{
          position: "fixed",
          bottom: -9999,
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div id="asa-yt-player" />
      </div>
      {children}
    </AudioContext.Provider>
  );
}
