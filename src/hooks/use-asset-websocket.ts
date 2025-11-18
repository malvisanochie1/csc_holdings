"use client";

import { useCallback, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

import { useAssetStore } from "@/lib/store/assets";

const DEFAULT_WS_URL = "wss://asset-data.surdonline.com";
const DEFAULT_WS_KEY = "9e37abad-04e9-47fb-bbd5-b8e344ff7e5a";

type AssetUpdate = {
  id?: string;
  symbol?: string;
  name?: string;
  price?: number;
  lastUpdated?: string;
  tradingViewSymbol?: string;
  changePercent24h?: number;
  category?: string;
};

type WebSocketResponse = {
  success: boolean;
  data: AssetUpdate[];
};

const normalizeSymbol = (sym?: string | null) =>
  sym?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() ?? "";

export function useAssetWebsocket() {
  const {
    wallets,
    updateWalletRate,
    setConnectionStatus,
    connectionStatus,
    lastError,
    setError,
  } = useAssetStore((state) => ({
    wallets: state.wallets,
    updateWalletRate: state.updateWalletRate,
    setConnectionStatus: state.setConnectionStatus,
    connectionStatus: state.connectionStatus,
    lastError: state.lastError,
    setError: state.setError,
  }));

  const socketRef = useRef<Socket | null>(null);
  const allowedMapRef = useRef<
    Map<
      string,
      {
        category?: string;
        name?: string;
        normalizedName?: string;
      }
    >
  >(new Map());

  useEffect(() => {
    const map = new Map<
      string,
      {
        category?: string;
        name?: string;
        normalizedName?: string;
      }
    >();
    wallets.forEach((wallet) => {
      const normalized = normalizeSymbol(wallet.sym || wallet.symbol);
      if (!normalized) return;
      map.set(normalized, {
        category: wallet.category,
        name: wallet.name,
        normalizedName: normalizeSymbol(wallet.name),
      });
    });
    allowedMapRef.current = map;
  }, [wallets]);

  const resolveWalletSymbol = useCallback((asset: AssetUpdate) => {
    const sanitize = (value?: string | null) =>
      value ? value.replace(/[^a-zA-Z0-9]/g, "") : value;

    const candidates: string[] = [];

    if (asset.symbol) {
      candidates.push(normalizeSymbol(sanitize(asset.symbol)));
    }

    if (asset.tradingViewSymbol) {
      const [, symbolPart] = asset.tradingViewSymbol.split(":");
      candidates.push(
        normalizeSymbol(sanitize(symbolPart ?? asset.tradingViewSymbol))
      );
    }

    if (asset.name) {
      candidates.push(normalizeSymbol(sanitize(asset.name.split("/")[0])));
    }

    const allowedMap = allowedMapRef.current;

    // Try exact matches first
    for (const candidate of candidates) {
      if (candidate && allowedMap.has(candidate)) {
        return candidate;
      }
    }

    // Fallback: match by normalized name + category
    const category = asset.category?.toLowerCase();
    for (const [sym, meta] of allowedMap.entries()) {
      const sameCategory =
        !meta.category ||
        !category ||
        meta.category?.toLowerCase() === category;
      if (!sameCategory) continue;

      const normalizedName = meta.normalizedName;

      if (
        normalizedName &&
        candidates.some(
          (candidate) => candidate && candidate.startsWith(normalizedName)
        )
      ) {
        return sym;
      }
    }

    return null;
  }, []);

  const processAsset = useCallback(
    (asset: AssetUpdate) => {
      if (!asset || typeof asset.price !== "number") return;
      const symbol = resolveWalletSymbol(asset);
      if (!symbol) return;
      updateWalletRate(symbol, asset.price, {
        tradingViewSymbol: asset.tradingViewSymbol,
        changePercent24h: asset.changePercent24h,
        lastUpdated: asset.lastUpdated ?? new Date().toISOString(),
      });
    },
    [resolveWalletSymbol, updateWalletRate]
  );

  const handleAssetUpdate = useCallback(
    (payload: AssetUpdate | AssetUpdate[]) => {
      if (Array.isArray(payload)) {
        payload.forEach(processAsset);
      } else {
        processAsset(payload);
      }
    },
    [processAsset]
  );

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_ASSET_WS_URL ?? DEFAULT_WS_URL;
    const apiKey = process.env.NEXT_PUBLIC_ASSET_WS_KEY ?? DEFAULT_WS_KEY;

    const socket = io(url, {
      auth: { apiKey },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 15000,
    });

    socketRef.current = socket;
    setConnectionStatus("connecting");

    socket.on("connect", () => {
      setConnectionStatus("connected");
      socket.emit("subscribe:all");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", (err: Error) => {
      setConnectionStatus("disconnected");
      setError(err.message);
    });

    socket.on("data:all", (response: WebSocketResponse) => {
      if (response?.success && Array.isArray(response.data)) {
        response.data.forEach(processAsset);
      }
    });

    socket.on("data:update", handleAssetUpdate);

    socket.on("data:asset", handleAssetUpdate);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setConnectionStatus("disconnected");
    };
  }, [handleAssetUpdate, processAsset, setConnectionStatus, setError]);

  return {
    connectionStatus,
    isConnected: connectionStatus === "connected",
    lastError,
  };
}
