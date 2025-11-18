"use client";

import { create } from "zustand";
import type { SettingsData } from "@/lib/types/api";

export type AssetWallet = {
  id?: string | number;
  name?: string;
  symbol?: string;
  sym?: string;
  normalizedSymbol?: string;
  normalizedName?: string;
  rate?: number | string;
  realtimeRate?: number;
  category?: string;
  image?: string;
  tradingViewSymbol?: string;
  changePercent24h?: number;
  lastUpdated?: string;
  [key: string]: unknown;
};

type AssetState = {
  wallets: AssetWallet[];
  walletMap: Record<string, AssetWallet>;
  symbolIndex: Record<string, number>;
  connectionStatus: "idle" | "connecting" | "connected" | "disconnected";
  lastError: string | null;
  updatedAt: number | null;
  setWallets: (wallets: AssetWallet[]) => void;
  syncFromSettings: (settings: SettingsData | null) => void;
  updateWalletRate: (symbol: string, rate: number, payload?: Partial<AssetWallet>) => void;
  setConnectionStatus: (status: AssetState["connectionStatus"]) => void;
  setError: (message: string | null) => void;
  clear: () => void;
};

const FALLBACK_SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTCUSD",
  ethereum: "ETHUSD",
  xrp: "XRPUSD",
  solana: "SOLUSD",
  gold: "XAUUSD",
};

const normalizeSymbol = (symbol?: string | null) =>
  symbol?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() ?? "";

const withFallbackSym = (wallet: AssetWallet): AssetWallet => {
  if (wallet.sym && wallet.sym.trim()) {
    return wallet;
  }
  const key = wallet.name?.toLowerCase().trim();
  if (key && FALLBACK_SYMBOL_MAP[key]) {
    return { ...wallet, sym: FALLBACK_SYMBOL_MAP[key] };
  }
  return wallet;
};

const buildStateFromWallets = (wallets: AssetWallet[]) => {
  const symbolIndex: Record<string, number> = {};
  const walletMap: Record<string, AssetWallet> = {};

  wallets.forEach((wallet, index) => {
    const enrichedWallet = withFallbackSym(wallet);
    const normalized = normalizeSymbol(enrichedWallet.sym || enrichedWallet.symbol);
    const normalizedName = normalizeSymbol(enrichedWallet.name);
    if (!normalized) return;
    const enriched = {
      ...enrichedWallet,
      normalizedSymbol: normalized,
      normalizedName,
    };
    wallets[index] = enriched;
    symbolIndex[normalized] = index;
    walletMap[normalized] = enriched;
  });

  return { wallets, symbolIndex, walletMap, updatedAt: wallets.length ? Date.now() : null };
};

const normalizeWallets = (settings: SettingsData | null): AssetWallet[] => {
  if (!settings || !Array.isArray(settings.wallets)) {
    return [];
  }
  return settings.wallets as AssetWallet[];
};

export const useAssetStore = create<AssetState>((set, get) => ({
  wallets: [],
  walletMap: {},
  symbolIndex: {},
  connectionStatus: "idle",
  lastError: null,
  updatedAt: null,
  setWallets: (wallets) => {
    const state = buildStateFromWallets([...wallets]);
    set(state);
  },
  syncFromSettings: (settings) => {
    const wallets = normalizeWallets(settings);
    const state = buildStateFromWallets([...wallets]);
    set(state);
  },
  updateWalletRate: (symbol, rate, payload) => {
    const normalized = normalizeSymbol(symbol);
    if (!normalized) return;
    set((state) => {
      const index = state.symbolIndex[normalized];
      if (index === undefined) return state;
      const wallets = [...state.wallets];
      const previous = wallets[index];
      const updated: AssetWallet = {
        ...previous,
        realtimeRate: rate,
        rate: payload?.rate ?? previous.rate,
        changePercent24h: payload?.changePercent24h ?? previous.changePercent24h,
          tradingViewSymbol: payload?.tradingViewSymbol ?? previous.tradingViewSymbol,
          lastUpdated: payload?.lastUpdated ?? new Date().toISOString(),
        };
        wallets[index] = updated;
        if (process.env.NODE_ENV !== "production") {
          console.debug("[AssetStore] rate_update", normalized, rate);
        }
        return {
          ...state,
          wallets,
          walletMap: { ...state.walletMap, [normalized]: updated },
        };
    });
  },
  setConnectionStatus: (status) =>
    set({
      connectionStatus: status,
      lastError: status === "connected" ? null : get().lastError,
    }),
  setError: (message) => set({ lastError: message ?? null }),
  clear: () =>
    set({
      wallets: [],
      walletMap: {},
      symbolIndex: {},
      updatedAt: null,
      connectionStatus: "idle",
      lastError: null,
    }),
}));
