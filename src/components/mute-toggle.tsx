"use client";

import { useAudio } from "@/context/audio-context";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function MuteToggle({ iconSize = 16 }: { iconSize?: number }) {
  const [mounted, setMounted] = useState(false);
  const { isMuted, isPlaying, trackTitle, toggleMute } = useAudio();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      title={
        isMuted
          ? `Unmute music${trackTitle ? ` (${trackTitle})` : ""}`
          : `Mute music${trackTitle ? ` (${trackTitle})` : ""}`
      }
      className="text-neutral-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors relative flex items-center justify-center p-0.5"
    >
      {isMuted ? (
        <IconVolumeOff size={iconSize} className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" />
      ) : (
        <span className="relative flex items-center justify-center">
          <IconVolume size={iconSize} className="text-[#1DB954] transition-colors" />
          {isPlaying && (
            <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1DB954]"></span>
            </span>
          )}
        </span>
      )}
    </button>
  );
}
