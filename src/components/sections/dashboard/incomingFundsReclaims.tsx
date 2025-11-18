"use client";
import { useCallback, useMemo } from "react";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAuthStore } from "@/lib/store/auth";
import { useWalletTransactions } from "@/lib/api/finance";
import { cn } from "@/lib/utils";
import { formatUserCurrency } from "@/lib/currency";
import type { CurrencyAsset } from "@/lib/types/api";

const FALLBACK_ASSET_ICON = "/dashboard/account_overview/logo.png";

const defaultChartData = [
  { month: "Jan", recovered: 0 },
  { month: "Feb", recovered: 2000 },
  { month: "Mar", recovered: 3500 },
  { month: "Apr", recovered: 5000 },
  { month: "May", recovered: 7500 },
  { month: "Jun", recovered: 10000 },
];

const chartConfig = {
  recovered: {
    label: "Recovered",
    color: "hsl(142.1 76.2% 36.3%)",
  },
} satisfies ChartConfig;

const formatChartLabel = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const IncomingFundsReclaims = () => {
  const { user } = useAuthStore();
  const assets = useMemo(
    () => (user?.assets as CurrencyAsset[] | undefined) ?? [],
    [user?.assets]
  );
  const { data: walletTransactions } = useWalletTransactions({
    enabled: Boolean(user),
  });

  const pendingWalletIds = useMemo(() => {
    const ids = walletTransactions?.groups?.pending?.wallet_ids ?? [];
    return new Set(ids);
  }, [walletTransactions?.groups?.pending?.wallet_ids]);

  const isWalletProcessing = useCallback(
    (wallet?: CurrencyAsset | null) => {
      if (!wallet) return false;
      const idsToCheck = [wallet.id, wallet.user_wallet_id].filter(Boolean) as string[];
      return idsToCheck.some((id) => pendingWalletIds.has(id));
    },
    [pendingWalletIds]
  );

  const chartData = useMemo(() => {
    if (!walletTransactions?.graph?.length) {
      return defaultChartData;
    }

    return walletTransactions.graph.map((point) => ({
      month: formatChartLabel(point.date),
      recovered: point.success,
    }));
  }, [walletTransactions]);

  const summary = {
    successTotal: walletTransactions?.groups?.success?.total ?? 0,
    successCount: walletTransactions?.groups?.success?.count ?? 0,
    pendingCount: walletTransactions?.groups?.pending?.count ?? 0,
    failedCount: walletTransactions?.groups?.failed?.count ?? 0,
  };

  const getWalletDetailHref = (asset: CurrencyAsset) => {
    if (!asset.id) return null;
    return `/dashboard/transaction/view?wallet=${encodeURIComponent(asset.id)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      {/* Incoming Funds Reclaims - Left Side */}
      <div className="lg:col-span-2 card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
            Incoming Funds Reclaims
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            (Tap to explore transaction history)
          </p>
        </div>

        <div className="space-y-3">
          {assets.length === 0 ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-12">
              Your assets will appear here once your recovery data is synced.
            </div>
          ) : (
            assets.map((asset) => {
              const processing = isWalletProcessing(asset);
              const assetLabel = asset.name?.trim() || asset.symbol || "Asset";
              const walletHref = getWalletDetailHref(asset);

              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <Image
                      src={asset.image || FALLBACK_ASSET_ICON}
                      alt={assetLabel}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-700 dark:text-white">
                      {assetLabel} Transaction Record
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {processing && (
                      <span className="px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-500/20 rounded-full border border-amber-200/80">
                        Processing
                      </span>
                    )}
                    <FaChevronRight className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </>
              );

              const baseClasses = cn(
                "w-full flex items-center justify-between p-4 rounded-lg transition-all group border",
                walletHref ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                processing
                  ? "border-amber-400/70 bg-amber-50/70 dark:bg-yellow-500/10 ring-2 ring-amber-200/50 shadow-[0_10px_25px_rgba(251,191,36,0.25)]"
                  : "border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
              );

              return walletHref ? (
                <Link key={asset.id} href={walletHref} className={baseClasses}>
                  {content}
                </Link>
              ) : (
                <div key={asset.id} className={baseClasses} aria-disabled>
                  {content}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Stats - Right Side */}
      <div className="card p-5 flex flex-col h-full">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
          Recovery Summary
        </h3>

        {/* Recovery Chart */}
        <div className="flex-1 mb-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="recovered"
                type="natural"
                fill="hsl(142.1 76.2% 36.3%)"
                fillOpacity={0.4}
                stroke="hsl(142.1 76.2% 36.3%)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Stats Summary */}
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Total Recovered
            </span>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {formatUserCurrency(summary.successTotal, user).displayValue}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-green-500">
              <div className="text-lg font-bold text-white">
                {summary.successCount}
              </div>
              <div className="text-xs text-white/90">Completed</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-500">
              <div className="text-lg font-bold text-white">
                {summary.pendingCount}
              </div>
              <div className="text-xs text-white/90">Pending</div>
            </div>
            <div className="p-2 rounded-lg bg-red-500">
              <div className="text-lg font-bold text-white">
                {summary.failedCount}
              </div>
              <div className="text-xs text-white/90">Failed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingFundsReclaims;
