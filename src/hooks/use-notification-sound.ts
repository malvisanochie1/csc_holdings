"use client";

import { useCallback, useEffect, useRef } from "react";

const DEFAULT_SOUND_PATH = "/sounds/notification.mp3";

export function useNotificationSound(src = DEFAULT_SOUND_PATH) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio(src);
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Notification sound blocked or failed to play", error);
      }
    }
  }, []);

  return { playSound: play };
}
