"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert, MdDiamond } from "react-icons/md";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Withdraw } from "../withdraw/withdraw";
import { useAuthStore } from "@/lib/store/auth";
import { useAssetStore } from "@/lib/store/assets";
import { formatUserCurrency } from "@/lib/currency";
import { aggregateAssetRealtimeMetrics } from "@/lib/assets";
import { useInsufficientBalanceAlert } from "@/components/modals/withdrawal/insufficientBalance";
import type { CurrencyAsset } from "@/lib/types/api";

const parseNumericValue = (value?: number | string | null): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const AccountOverview = () => {
  const { user } = useAuthStore();
  const wallets = useAssetStore((state) => state.wallets);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [totalAssetTrend, setTotalAssetTrend] = React.useState<"up" | "down" | null>(null);
  const previousTotalRef = React.useRef<number | null>(null);
  const [isFiatWithdrawOpen, setIsFiatWithdrawOpen] = React.useState(false);
  const showInsufficientBalance = useInsufficientBalanceAlert();

  const userAssets = React.useMemo(() => user?.assets ?? [], [user?.assets]);

  const assetTotals = React.useMemo(
    () => aggregateAssetRealtimeMetrics(userAssets, wallets),
    [userAssets, wallets],
  );

  const fallbackBaseTotal =
    parseNumericValue(user?.total_asset_val) ??
    parseNumericValue(user?.total_asset) ??
    assetTotals.baseTotal;

  const totalAssetRealtimeValue = fallbackBaseTotal + assetTotals.totalPnl;
  const resolvedTotalAssetValue = Number.isFinite(totalAssetRealtimeValue)
    ? totalAssetRealtimeValue
    : fallbackBaseTotal;

  React.useEffect(() => {
    if (!Number.isFinite(resolvedTotalAssetValue)) return;
    if (previousTotalRef.current === null) {
      previousTotalRef.current = resolvedTotalAssetValue;
      return;
    }
    const previousValue = previousTotalRef.current;
    if (resolvedTotalAssetValue === previousValue) return;

    setTotalAssetTrend(resolvedTotalAssetValue >= previousValue ? "up" : "down");
    previousTotalRef.current = resolvedTotalAssetValue;

    const timeout = window.setTimeout(() => setTotalAssetTrend(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [resolvedTotalAssetValue]);

  const totalAssetColorClass =
    totalAssetTrend === "up"
      ? "text-emerald-500"
      : totalAssetTrend === "down"
        ? "text-red-500"
        : "text-gray-900 dark:text-white";
  const fiatBalanceValue =
    parseNumericValue(user?.total_fiat_val) ?? parseNumericValue(user?.total_fiat) ?? 0;
  const fiatWalletSummary = React.useMemo<CurrencyAsset>(() => {
    const symbol =
      user?.currency?.symbol ?? user?.currency?.sym ?? user?.currency?.code ?? "FIAT";
    return {
      id: "fiat-total-balance",
      user_wallet_id: "fiat-total-balance",
      name: "Available FIAT Balance",
      symbol,
      sym: symbol,
      image: "/dashboard/fiat.png",
      balance: fiatBalanceValue,
      balance_val: fiatBalanceValue.toString(),
      rate: user?.currency?.rate,
      is_fiat: 1,
      conversion_rate: { min: "0", max: "0" },
      status: "active",
    };
  }, [
    fiatBalanceValue,
    user?.currency?.code,
    user?.currency?.rate,
    user?.currency?.sym,
    user?.currency?.symbol,
  ]);

  const handleFiatWithdrawRequest = React.useCallback(() => {
    if (fiatBalanceValue <= 0) {
      showInsufficientBalance();
      return;
    }
    setIsFiatWithdrawOpen(true);
  }, [fiatBalanceValue, showInsufficientBalance]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
        {/* Total Asset Value */}
        <div className="card p-5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <Image
              src="/dashboard/asset.gif"
              alt="Total Asset"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Asset Value</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Current Re-Claimed Funds</p>
          <h2 className={`text-3xl font-bold ${totalAssetColorClass}`}>
            {formatUserCurrency(resolvedTotalAssetValue, user).displayValue}
          </h2>
        </div>

        {/* Available Balance FIAT */}
        <div className="card p-5 flex flex-col items-center text-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-4 right-4 focus:ring-0 focus:outline-none cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MdMoreVert size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  handleFiatWithdrawRequest();
                }}
                className="p-0"
              >
                <button
                  type="button"
                  className="block w-full px-3 py-1.5 text-left text-sm font-medium text-gray-600 dark:text-gray-200"
                >
                  Withdraw
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Withdraw
            wallet={fiatWalletSummary}
            trigger={<span aria-hidden="true" className="hidden" />}
            open={isFiatWithdrawOpen}
            onOpenChange={setIsFiatWithdrawOpen}
          />

          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
            <Image
              src="/dashboard/fiat.png"
              alt="Available Balance"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Av. BAL IN FIAT</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">FIAT</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{formatUserCurrency(user?.total_fiat_val, user).displayValue}</h2>
        </div>

        {/* Award Winning Escrow Services - Toggleable */}
        <div
          className="card relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 dark:from-teal-600 dark:to-blue-800"></div>

          <div className="relative p-5 text-white">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <MdDiamond className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Award Winning Escrow Services</h3>
              </div>
              <button className="text-white/80 hover:text-white transition-colors">
                {isExpanded ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-white/90 leading-relaxed">
                  Your funds re-claim and recovery journey is very important to us.
                  Trust us to put your priorities first in getting back your money.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountOverview;
