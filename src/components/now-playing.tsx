"use client";

import { cn } from "@/lib/cn";
import { IconBrandSpotify, IconDisc, IconExternalLink } from "@tabler/icons-react";
import { useEffect, useState } from "react";

type TrackData = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl: string | null;
  spotifyUrl: string;
};

export default function NowPlaying({ className }: { className?: string }) {
  const [data, setData] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      if (json && json.title) {
        setData(json);
        setImgError(false);
      } else {
        setData(null);
      }
    } catch {
      // keep current data or fallback gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      fetchTrack();
    }, 30000);

    const handleVisibilityChange = () => {
      if (!document.hidden) fetchTrack();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div
        className={cn(
          "w-full max-w-md mx-auto rounded-2xl p-3 sm:p-3.5",
          "bg-white/50 dark:bg-shark-900/50 backdrop-blur-md",
          "border border-shark-200/40 dark:border-shark-800/40",
          "shadow-xs transition-all",
          className
        )}
      >
        <div className="flex items-center gap-3.5 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-shark-800 shrink-0" />
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="h-2.5 bg-neutral-200 dark:bg-shark-800 rounded w-24" />
            <div className="h-3.5 bg-neutral-200 dark:bg-shark-800 rounded w-3/4" />
            <div className="h-2.5 bg-neutral-200 dark:bg-shark-800 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.title) {
    return null;
  }

  const isPlaying = data.isPlaying;

  return (
    <a
      href={data.spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Listen to ${data.title} by ${data.artist} on Spotify`}
      className={cn(
        "group block w-full max-w-md mx-auto rounded-2xl p-3 sm:p-3.5",
        "bg-white/60 dark:bg-shark-900/60 backdrop-blur-md",
        "border border-shark-200/60 dark:border-shark-800/60",
        "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3)]",
        "hover:border-primary-500/50 dark:hover:border-primary-400/60",
        "hover:shadow-[0_8px_28px_-6px_rgba(2,132,199,0.15)]",
        "hover:-translate-y-0.5",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-1 ring-black/5 dark:ring-white/10 shadow-xs bg-neutral-100 dark:bg-shark-800 flex items-center justify-center">
          {data.albumImageUrl && !imgError ? (
            <img
              src={data.albumImageUrl}
              alt={`${data.album || data.title} artwork`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <IconDisc className="w-6 h-6 text-primary-500 dark:text-primary-400 transition-transform duration-700 group-hover:rotate-45" />
          )}

          {isPlaying && (
            <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <IconExternalLink className="w-4 h-4 text-white drop-shadow" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-1.5 mb-1">
            <IconBrandSpotify className="w-3.5 h-3.5 text-[#1DB954] shrink-0" />
            {isPlaying ? (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                </span>
                <span className="text-[10px] font-mono tracking-wider font-semibold uppercase text-emerald-600 dark:text-[#1DB954]">
                  Currently Playing
                </span>
              </span>
            ) : (
              <span className="text-[10px] font-mono tracking-wider font-medium uppercase text-neutral-500 dark:text-neutral-400">
                Recently Played
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {data.title}
          </p>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
            {data.artist}
          </p>
        </div>

        <div className="shrink-0 text-neutral-400 dark:text-neutral-500 group-hover:text-primary-500 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all">
          <IconExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
}
