"use client";

import { useMemo } from "react";
import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

import { useAssetWebsocket } from "@/hooks/use-asset-websocket";
import { useAssetStore } from "@/lib/store/assets";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";

const numberFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

const statusMeta = {
  connected: {
    label: "Live",
    icon: CheckCircle2,
    className: "text-emerald-500",
  },
  connecting: {
    label: "Connecting…",
    icon: Activity,
    className: "text-amber-500",
  },
  disconnected: {
    label: "Offline",
    icon: AlertTriangle,
    className: "text-rose-500",
  },
  idle: {
    label: "Idle",
    icon: Activity,
    className: "text-slate-500",
  },
} as const;

export default function AssetRatesPage() {
  const { connectionStatus, lastError } = useAssetWebsocket();
  const { wallets } = useAssetStore((state) => ({
    wallets: state.wallets,
  }));

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      const symA = (a.sym || a.symbol || "").localeCompare(b.sym || b.symbol || "");
      return symA;
    });
  }, [wallets]);

  const status = statusMeta[connectionStatus] ?? statusMeta.idle;
  const StatusIcon = status.icon;

  return (
    <>
      <Navbar />
      <div className="home-bg flex h-screen overflow-hidden">
        <div className="hidden w-full max-w-[240px] flex-shrink-0 xl:flex">
          <Sidebar />
        </div>
        <div className="flex w-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 pb-24 pt-4 sm:px-6 sm:pb-6">
            <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Asset Monitoring
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">Live Asset Rates</h1>
                <p className="text-sm text-slate-500">
                  Backend wallet rates hydrate from settings; WebSocket keeps them real-time.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <StatusIcon className={`h-4 w-4 ${status.className}`} />
                <span className={status.className}>{status.label}</span>
              </div>
            </header>

            {lastError && (
              <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {lastError}
              </div>
            )}

            <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
              <div className="grid grid-cols-12 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <div className="col-span-3">Asset</div>
                <div className="col-span-3">Backend Rate</div>
                <div className="col-span-3">Live Rate</div>
                <div className="col-span-3 text-right">Last Update</div>
              </div>

              {sortedWallets.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No wallets available yet. Settings data will populate this list automatically.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sortedWallets.map((wallet) => {
                    const backendRate =
                      typeof wallet.rate === "number"
                        ? wallet.rate
                        : typeof wallet.rate === "string"
                        ? Number(wallet.rate)
                        : undefined;
                    const liveRate = wallet.realtimeRate ?? backendRate;
                    return (
                      <div key={`${wallet.id}-${wallet.sym ?? wallet.symbol}`} className="grid grid-cols-12 items-center px-4 py-3 text-sm">
                        <div className="col-span-3">
                          <div className="font-semibold text-slate-900">
                            {wallet.sym || wallet.symbol || "—"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {wallet.name || "Unnamed Asset"}
                          </div>
                        </div>
                        <div className="col-span-3">
                          {backendRate !== undefined ? (
                            <span className="font-mono text-slate-900">
                              {numberFormatter.format(backendRate)}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                        <div className="col-span-3">
                          {liveRate !== undefined ? (
                            <div className="flex items-center gap-2 font-mono text-emerald-600">
                              {numberFormatter.format(liveRate)}
                              {wallet.changePercent24h !== undefined && (
                                <span
                                  className={`text-xs ${
                                    wallet.changePercent24h >= 0
                                      ? "text-emerald-500"
                                      : "text-rose-500"
                                  }`}
                                >
                                  {wallet.changePercent24h >= 0 ? "+" : ""}
                                  {wallet.changePercent24h?.toFixed(2)}%
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </div>
                        <div className="col-span-3 text-right text-xs text-slate-500">
                          {wallet.lastUpdated
                            ? new Date(wallet.lastUpdated).toLocaleTimeString()
                            : "—"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
