"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsData, UserCurrency } from "@/lib/types/api";
import { useAssetStore } from "@/lib/store/assets";

type LanguageState = {
  code: string;
  name: string;
  flag: string;
};

type SettingsState = {
  settings: SettingsData | null;
  currentLanguage: LanguageState;
  _hasHydrated: boolean;
  setSettings: (settings: SettingsData) => void;
  setLanguage: (language: LanguageState) => void;
  getCurrencyById: (id: number) => UserCurrency | undefined;
  setHasHydrated: (hasHydrated: boolean) => void;
  clear: () => void;
};

const defaultLanguage: LanguageState = {
  code: "en",
  name: "English",
  flag: "🇺🇸",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: null,
      currentLanguage: defaultLanguage,
      _hasHydrated: false,
      setSettings: (settings) => {
        set({ settings });
        useAssetStore.getState().syncFromSettings(settings);
      },
      setLanguage: (language) => set({ currentLanguage: language }),
      getCurrencyById: (id: number) => {
        const { settings } = get();
        return settings?.currencies?.find((currency) => currency.id === id);
      },
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      clear: () => {
        useAssetStore.getState().clear();
        set({
          settings: null,
          currentLanguage: defaultLanguage,
          _hasHydrated: false,
        });
      },
    }),
    {
      name: "csc-settings",
      onRehydrateStorage: () => (state) => {
        if (state?.settings) {
          useAssetStore.getState().syncFromSettings(state.settings);
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
