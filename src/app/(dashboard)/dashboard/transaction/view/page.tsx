"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import { useWalletTransactionsView } from "@/lib/api/finance";
import { formatUserCurrency } from "@/lib/currency";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

const FALLBACK_ASSET_ICON = "/dashboard/account_overview/logo.png";

const statusBadgeStyles: Record<string, { text: string; bg: string; dot: string }> = {
  success: {
    text: "text-green-700 dark:text-green-200",
    bg: "bg-green-100 dark:bg-green-500/15",
    dot: "bg-green-500",
  },
  completed: {
    text: "text-green-700 dark:text-green-200",
    bg: "bg-green-100 dark:bg-green-500/15",
    dot: "bg-green-500",
  },
  pending: {
    text: "text-amber-700 dark:text-amber-200",
    bg: "bg-amber-100 dark:bg-amber-500/15",
    dot: "bg-amber-400",
  },
  failed: {
    text: "text-red-700 dark:text-red-200",
    bg: "bg-red-100 dark:bg-red-500/15",
    dot: "bg-red-500",
  },
  declined: {
    text: "text-red-700 dark:text-red-200",
    bg: "bg-red-100 dark:bg-red-500/15",
    dot: "bg-red-500",
  },
};

const defaultStatusBadge = {
  text: "text-gray-700 dark:text-gray-300",
  bg: "bg-gray-100 dark:bg-gray-800/60",
  dot: "bg-gray-400",
};

const formatDateParts = (value?: string) => {
  if (!value) {
    return { date: "—", time: "" };
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { date: value, time: "" };
  }
  return {
    date: parsed.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    time: parsed.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
};

const formatAssetAmount = (amount?: number | string | null, symbol?: string | null) => {
  if (amount === undefined || amount === null) return "0";
  const parsed = typeof amount === "number" ? amount : Number(amount);
  if (!Number.isFinite(parsed)) return "0";
  return `${parsed.toLocaleString(undefined, { maximumFractionDigits: 8 })}${symbol ? ` ${symbol}` : ""}`;
};

const WalletTransactionsDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const walletIdParam = searchParams.get("wallet");
  const walletId = walletIdParam ? decodeURIComponent(walletIdParam) : undefined;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useWalletTransactionsView(walletId, {
    enabled: Boolean(walletId),
  });

  const wallet = data?.wallet;
  const summaryText = data?.summary;
  const stats = data?.stats;
  const totals = data?.totals;
  const transactions = data?.transactions ?? [];

  const totalsByStatus = [
    { label: "Total Completed", value: stats?.success?.total ?? 0 },
    { label: "Total Pending", value: stats?.pending?.total ?? 0 },
    { label: "Total Declined", value: stats?.failed?.total ?? 0 },
  ];

  const renderContent = () => {
    if (!walletId) {
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 px-6 py-8 text-center text-sm text-red-700">
          Wallet identifier is missing. Please return to the dashboard and choose a wallet again.
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="rounded-3xl border border-gray-200 bg-white/70 px-6 py-16 text-center dark:border-gray-800 dark:bg-gray-900/40">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Fetching wallet transactions...</p>
          </div>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-3xl border border-red-200 bg-red-50/50 px-6 py-10 text-center dark:border-red-500/40 dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-200">
            {(error as Error)?.message || "Unable to load this wallet right now."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-[#3e2bce] px-5 py-2 text-sm font-semibold text-[#3e2bce] shadow-none"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!wallet) {
      return (
        <div className="rounded-3xl border border-gray-200 bg-white/70 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900/40">
          Wallet details are not available. Please return to the dashboard and try again.
        </div>
      );
    }

    const fiatFormatter = (value: number) => formatUserCurrency(value, user).displayValue;
    const transactionCount = transactions.length;
    const assetLabel = wallet.name || wallet.symbol || "Asset Ledger";
    const networkLabel = wallet.sym || wallet.symbol || "recovery network";
    const summaryDescription =
      summaryText?.trim()?.length
        ? summaryText.trim()
        : `This asset has recorded ${transactionCount || "no"} transaction${
            transactionCount === 1 ? "" : "s"
          } on the ${networkLabel} ecosystem. The ${networkLabel} ledger ensures transparency and traceability for every gram under custody.`;
    const walletIcon = wallet.image || FALLBACK_ASSET_ICON;
    const ledgerReference = wallet.id;
    const lastSyncedAt = totals?.period?.to;

    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.65)] sm:p-8 dark:border-slate-800/70 dark:bg-slate-900/70">
        <div className="flex flex-col gap-4 border-b border-slate-200/60 pb-6 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white/60 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
              <Image src={walletIcon} alt={assetLabel} fill className="object-contain" sizes="56px" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Wallet ledger</p>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{assetLabel}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-300">{networkLabel}</p>
            </div>
            {wallet.symbol && (
              <span className="rounded-full border border-slate-200/80 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-200">
                {wallet.symbol}
              </span>
            )}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-300">
            Ledger reference:
            <span className="ml-1 font-medium text-slate-900 dark:text-white">{ledgerReference || "—"}</span>
          </div>
        </div>

        <section className="py-6">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{summaryDescription}</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          {totalsByStatus.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-slate-800/70 dark:bg-slate-900/40"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {fiatFormatter(Number(item.value || 0))}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Transactions table</p>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Incoming Funds Reclaims</h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Reporting window:
              <span className="ml-1 font-semibold text-slate-900 dark:text-slate-100">
                {totals?.period?.from ? formatDateParts(totals?.period?.from).date : "—"}
              </span>
              <span className="mx-1">→</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {totals?.period?.to ? formatDateParts(totals?.period?.to).date : "—"}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/50">
            {transactions.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                No transactions have been recorded for this wallet yet.
              </div>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                    <th className="py-3 pr-6 font-medium">ID &amp; Timestamp</th>
                    <th className="py-3 pr-6 font-medium">Entity</th>
                    <th className="py-3 pr-6 font-medium">Status</th>
                    <th className="py-3 pr-6 font-medium text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                  {transactions.map((transaction) => {
                    const badge = transaction.status
                      ? statusBadgeStyles[transaction.status.toLowerCase()] ?? defaultStatusBadge
                      : defaultStatusBadge;
                    const { date, time } = formatDateParts(transaction.created_at);
                    const fiatValue = fiatFormatter(Number(transaction.amount ?? 0));
                    const assetValue = formatAssetAmount(transaction.amount, wallet.symbol);
                    return (
                      <tr key={transaction.id} className="align-top text-slate-900 dark:text-slate-100">
                        <td className="py-4 pr-6 align-top">
                          <p className="font-mono text-sm">{transaction.id}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{date}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{time}</p>
                        </td>
                        <td className="py-4 pr-6 align-top">
                          <p className="text-sm font-semibold">{transaction.company || "Capital Invest"}</p>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            {transaction.type?.toUpperCase() || "LEDGER"}
                          </p>
                        </td>
                        <td className="py-4 pr-6 align-top">
                          <span
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold capitalize",
                              badge.text,
                              badge.bg,
                              "border-transparent"
                            )}
                          >
                            <span className={cn("h-2 w-2 rounded-full", badge.dot)} />
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-4 pr-6 text-right align-top">
                          <p className="text-base font-semibold">{fiatValue}</p>
                          <p className="text-xs text-slate-500">{assetValue}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>
            {transactionCount} transaction{transactionCount === 1 ? "" : "s"} recorded · Last sync
            <span className="ml-1 font-semibold text-slate-900 dark:text-slate-100">
              {lastSyncedAt ? formatDateParts(lastSyncedAt).date : "—"}
            </span>
          </p>
          <Link href="/dashboard" className="font-semibold text-[#3E2BCE]">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  };


  return (
    <>
      <Navbar />
      <div className="flex home-bg min-h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-5 md:px-7 lg:px-10 py-6 space-y-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default WalletTransactionsDetailPage;
