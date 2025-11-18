"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/api/settings";
import { useSettingsStore } from "@/lib/store/settings";
import { useAuthStore } from "@/lib/store/auth";

export function useSettingsInitialization() {
  const { user } = useAuthStore();
  const { settings, setSettings, _hasHydrated } = useSettingsStore();
  const { data: settingsData, isLoading } = useSettings();

  // Load settings data into store when available
  useEffect(() => {
    if (settingsData && (!settings || settingsData !== settings)) {
      setSettings(settingsData);
    }
  }, [settingsData, settings, setSettings]);

  return {
    isInitialized: _hasHydrated && !isLoading,
    hasSettings: !!settings,
    hasUser: !!user,
  };
}