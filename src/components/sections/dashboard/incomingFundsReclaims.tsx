"use client";
import React, { useCallback, useMemo, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type {
  CurrencyAsset,
  WalletTransactionItem,
} from "@/lib/types/api";

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

const formatDisplayDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const parseAmount = (value?: number | string | null) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const sanitized = value.replace(/,/g, "");
    const numeric = Number.parseFloat(sanitized);
    return Number.isNaN(numeric) ? 0 : numeric;
  }
  return 0;
};

const IncomingFundsReclaims = () => {
  const { user } = useAuthStore();
  const assets = useMemo(
    () => (user?.assets as CurrencyAsset[] | undefined) ?? [],
    [user?.assets]
  );
  const [selectedAsset, setSelectedAsset] = useState<CurrencyAsset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const transactionsByWallet = useMemo(() => {
    const map = new Map<string, WalletTransactionItem[]>();
    const groups = walletTransactions?.groups;
    if (!groups) return map;

    Object.values(groups).forEach((group) => {
      group?.transactions?.forEach((transaction) => {
        const existing = map.get(transaction.wallet_id) ?? [];
        existing.push(transaction);
        map.set(transaction.wallet_id, existing);
      });
    });

    map.forEach((transactions, walletId) => {
      map.set(
        walletId,
        [...transactions].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );
    });

    return map;
  }, [walletTransactions]);

  const selectedTransactions = useMemo(() => {
    const walletKey = selectedAsset?.user_wallet_id ?? selectedAsset?.id ?? null;
    if (!walletKey) return [];
    return transactionsByWallet.get(walletKey) ?? [];
  }, [selectedAsset, transactionsByWallet]);

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

  const handleAssetClick = (asset: CurrencyAsset) => {
    setSelectedAsset(asset);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return "text-green-500";
      case "pending":
        return "text-amber-500";
      case "failed":
      case "declined":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
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
                return (
                  <button
                    key={asset.id}
                    onClick={() => handleAssetClick(asset)}
                    className={cn(
                      "w-full flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer group border",
                      processing
                        ? "border-amber-400/70 bg-amber-50/70 dark:bg-yellow-500/10 ring-2 ring-amber-200/50 shadow-[0_10px_25px_rgba(251,191,36,0.25)]"
                        : "border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
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
                  </button>
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
                ${summary.successTotal.toLocaleString()}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-3">
              {selectedAsset ? (
                <>
                  <Image
                    src={selectedAsset.image || FALLBACK_ASSET_ICON}
                    alt={selectedAsset.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  {selectedAsset.name} Transaction Record
                </>
              ) : (
                "Asset Transaction Record"
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedAsset ? (
            selectedTransactions.length > 0 ? (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>DATE</TableHead>
                      <TableHead>COMPANY</TableHead>
                      <TableHead>ASSET</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">VALUE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransactions.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {formatDisplayDate(record.created_at)}
                        </TableCell>
                        <TableCell>{record.company ?? "—"}</TableCell>
                        <TableCell>{record.wallet?.name ?? selectedAsset.name}</TableCell>
                        <TableCell className={getStatusColor(record.status)}>
                          {record.status}
                        </TableCell>
                        <TableCell className="text-right">
                          ${parseAmount(record.amount).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No transaction records found for {selectedAsset.name}.
                </p>
              </div>
            )
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select an asset to view its recovery transactions.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncomingFundsReclaims;
