"use client";

import React, { useEffect, useMemo, useState } from "react";
import FlowModal from "@/components/modals/flow/flowModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownToLine, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import { useSubmitConversionRequest } from "@/lib/api/conversion";
import { useToast } from "@/components/providers/toast-provider";

interface ConvertAssetModalProps {
  asset: {
    id?: string;
    name: string;
    symbol?: string;
    balance?: number | string;
    balance_val?: number | string;
    amount?: number | string;
    user_wallet_id?: string;
  };
  trigger: React.ReactNode;
}

const parseNumeric = (value?: number | string) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

const ConvertAssetModal = ({ asset, trigger }: ConvertAssetModalProps) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const fiatOptions = React.useMemo(() => user?.currencies ?? [], [user?.currencies]);
  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(
    fiatOptions[0]?.id
  );
  const [isHowOpen, setIsHowOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    mutateAsync: submitConversion,
    reset,
    isPending,
    error: submitError,
  } = useSubmitConversionRequest();

  const fromWalletId = asset.id;

  useEffect(() => {
    const availableWalletIds = fiatOptions
      .map((currency) => currency.id)
      .filter((walletId): walletId is string => Boolean(walletId));

    if (!availableWalletIds.length) {
      if (selectedCurrency !== undefined) {
        setSelectedCurrency(undefined);
      }
      return;
    }

    if (!selectedCurrency || !availableWalletIds.includes(selectedCurrency)) {
      setSelectedCurrency(availableWalletIds[0]);
    }
  }, [fiatOptions, selectedCurrency]);

  const startingBalance = useMemo(() => {
    const candidates = [asset.balance, asset.amount, asset.balance_val];
    for (const candidate of candidates) {
      const resolved = parseNumeric(candidate);
      if (typeof resolved === "number") return resolved;
    }
    return 0;
  }, [asset.balance, asset.amount, asset.balance_val]);

  const canConvert =
    startingBalance > 0 &&
    Boolean(selectedCurrency) &&
    Boolean(fiatOptions.length) &&
    Boolean(fromWalletId);

  const errorMessage =
    submitError instanceof Error ? submitError.message : undefined;

  const handleConvert = async () => {
    if (!canConvert || !selectedCurrency || !fromWalletId) return;
    try {
      const response = await submitConversion({
        from_wallet_id: fromWalletId,
        to_wallet_id: selectedCurrency,
      });
      const successMessage = response?.message ?? "Conversion request submitted successfully";
      showToast({ type: "success", title: successMessage });
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to submit conversion request",
        description,
      });
    }
  };

  return (
    <FlowModal
      trigger={trigger}
      open={isDialogOpen}
      onOpenChange={(next) => {
        setIsDialogOpen(next);
        if (!next) {
          reset();
        }
      }}
      title={`Convert your ${asset.name} to a Fiat Currency`}
      subtitle="Our escrow specialists secure a regulated desk rate and settle securely into your account."
      eyebrow="Conversion"
    >
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Transaction Column */}
        <section className="order-1 lg:order-2 lg:col-span-5 space-y-5 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-md shadow-gray-200/50 dark:border-white/10 dark:bg-gray-900">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5 shadow-inner shadow-gray-200 dark:border-white/10 dark:bg-gray-900/40 dark:shadow-black/20">
            <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              <span>Amount To Convert</span>
              <span className="text-indigo-500">
                Balance: {startingBalance.toLocaleString()} {asset.symbol}
              </span>
            </div>
            <Input
              readOnly
              value={`$ ${startingBalance.toLocaleString()}`}
              className="h-12 rounded-2xl border-none bg-white text-2xl font-semibold text-gray-900 shadow-inner shadow-gray-200 focus-visible:ring-0 dark:bg-gray-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-full bg-indigo-50 px-4 py-2 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200">
              <ArrowDownToLine className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em]">Into</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white/70 p-5 shadow-sm shadow-indigo-100 dark:border-white/10 dark:bg-gray-900">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Destination Currency
            </label>
            <Select
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              disabled={!fiatOptions.length}
            >
              <SelectTrigger className="mt-3 w-full rounded-xl border-gray-200 bg-gray-50/80 py-4 text-base font-medium text-gray-700 dark:border-white/10 dark:bg-gray-900/40 dark:text-white">
                <SelectValue placeholder="--Specify Currency--" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-gray-100 bg-white shadow-xl dark:border-white/10 dark:bg-gray-900">
                {fiatOptions
                  .filter((currency) => Boolean(currency.id))
                  .map((currency) => (
                    <SelectItem
                      key={currency.id}
                      value={currency.id}
                      className="rounded-lg px-3 py-2 text-sm font-medium"
                    >
                      <div className="flex w-full items-center justify-between">
                        <span>{currency.name}</span>
                        <span className="text-xs uppercase text-gray-400">
                          {currency.symbol}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {!fiatOptions.length && (
              <p className="mt-3 text-xs text-amber-600">
                No fiat wallets are available yet. Wait for incoming reclaims to
                populate your fiat wallets.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              className="w-full cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 text-white shadow-lg shadow-emerald-500/40"
              size="lg"
              disabled={!canConvert || isPending}
              onClick={handleConvert}
            >
              {isPending ? "Submitting..." : "Convert"}
            </Button>
            {errorMessage && (
              <p className="text-center text-sm text-rose-500">{errorMessage}</p>
            )}
          </div>
        </section>

        {/* Content Column */}
        <section className="order-2 lg:order-1 lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-indigo-100/80 bg-indigo-50/60 p-5 text-sm leading-relaxed text-gray-700 shadow-sm dark:border-indigo-400/20 dark:bg-indigo-950/20 dark:text-gray-200">
            <p>
              <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                Convert
              </span>{" "}
              your assets into fiat currency with CSC Escrow & Settlement UK
              Ltd. Regulated agents desk the order and settle at the best rate
              available.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100/80 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setIsHowOpen((prev) => !prev)}
              aria-expanded={isHowOpen}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-indigo-500" />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  How does it work?
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "size-5 text-gray-500 transition-transform",
                  isHowOpen && "rotate-180"
                )}
              />
            </button>
            {isHowOpen && (
              <div className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  Convert into fiat the gold, silver, and other assets held by
                  CSC Escrow & Settlement UK Ltd. An escrow agent sources the
                  best market price while adhering to strict regulatory
                  requirements.
                </p>
                <p>
                  These liquidity specialists sell your securities securely and
                  profitably, remitting the proceeds into your verified fiat
                  wallet.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-red-200/70 bg-red-50/80 p-5 text-center text-sm text-red-700 shadow-sm dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
            <div className="mb-2 flex items-center justify-center gap-2 text-base font-bold">
              <ShieldCheck className="size-5" />
              PAYMENT SERVICES STATUS
            </div>
            <p>
              Authorized Payment Institution Since 16/11/2018 under GOV.UK regulation.
              All funds are secured under an Insurance Policy from the European
              Banking Association (EBA-ABE).
            </p>
            <p className="mt-2">
              Kindly note: This firm is permitted to provide payment services.
            </p>
          </div>
        </section>
      </div>
    </FlowModal>
  );
};

export default ConvertAssetModal;
