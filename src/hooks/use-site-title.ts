"use client";

import { useMemo } from "react";
import { useSettingsStore } from "@/lib/store/settings";

const DEFAULT_SITE_TITLE = "CSC Holdings";

export function useSiteTitle(fallback: string = DEFAULT_SITE_TITLE) {
  const { settings } = useSettingsStore();

  return useMemo(() => {
    const title = typeof settings?.title === "string" ? settings.title.trim() : "";
    const name = typeof settings?.name === "string" ? settings.name.trim() : "";
    if (title.length) return title;
    if (name.length) return name;
    return fallback;
  }, [settings?.name, settings?.title, fallback]);
}
