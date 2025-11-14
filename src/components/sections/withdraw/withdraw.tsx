"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  withdrawalMethodTabs,
  withdrawalCryptoOptions,
  type WithdrawalMethodKey,
} from "@/components/text/withdrawal";
import type { CurrencyAsset, SubmitWithdrawalPayload } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { useSubmitWithdrawalRequest } from "@/lib/api/withdrawal";
import { useToast } from "@/components/providers/toast-provider";

export interface WithdrawProps extends Omit<React.ComponentProps<typeof FlowModal>, "title" | "children"> {
  triggerText?: string;
  wallet?: CurrencyAsset;
  defaultMethod?: WithdrawalMethodKey;
}

const defaultTriggerClasses =
  "inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500";

export function Withdraw({
  triggerText = "Withdraw",
  trigger,
  wallet,
  defaultMethod = "crypto",
  open,
  onOpenChange,
  ...dialogProps
}: WithdrawProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [method, setMethod] = React.useState<WithdrawalMethodKey>(defaultMethod);
  const [selectedCryptoId, setSelectedCryptoId] = React.useState(
    withdrawalCryptoOptions[0]?.id ?? "bitcoin"
  );
  const [cryptoForm, setCryptoForm] = React.useState({ walletAddress: "" });
  const [bankForm, setBankForm] = React.useState({
    accountName: "",
    accountNumber: "",
    iban: "",
    bankName: "",
    swift: "",
    notes: "",
  });
  const { showToast } = useToast();
  const { mutateAsync: submitWithdrawal, isPending } = useSubmitWithdrawalRequest();

  const selectedCrypto = React.useMemo(
    () => withdrawalCryptoOptions.find((option) => option.id === selectedCryptoId) ?? withdrawalCryptoOptions[0],
    [selectedCryptoId]
  );

  const parseBalanceValue = (value?: number | string) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/,/g, ""));
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  const availableBalanceValue = parseBalanceValue(wallet?.balance ?? wallet?.balance_val);
  const availableBalanceLabel = React.useMemo(
    () => availableBalanceValue.toLocaleString(),
    [availableBalanceValue]
  );
  const walletCurrencyId = wallet?.id;

  const resetForms = () => {
    setCryptoForm({ walletAddress: "" });
    setBankForm({ accountName: "", accountNumber: "", iban: "", bankName: "", swift: "", notes: "" });
  };

  const handleClose = (next: boolean) => {
    if (typeof open !== "boolean") {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      resetForms();
    }
  };

  const handleSubmit = async () => {
    const amountValue = availableBalanceValue;

    if (!walletCurrencyId) {
      showToast({ type: "error", title: "Wallet information missing" });
      return;
    }

    if (!amountValue || Number.isNaN(amountValue) || amountValue <= 0) {
      showToast({ type: "error", title: "Enter a valid amount" });
      return;
    }

    try {
      const payload: SubmitWithdrawalPayload = {
        amount: amountValue,
        method,
        wallet_id: walletCurrencyId,
        currency_id: walletCurrencyId,
        currency_name: wallet?.name,
      };

      if (method === "crypto") {
        if (!cryptoForm.walletAddress.trim()) {
          showToast({ type: "error", title: "Wallet address is required" });
          return;
        }
        payload.network = selectedCrypto?.network;
        payload.wallet_address = cryptoForm.walletAddress.trim();
        payload.crypto_type = selectedCrypto?.label;
      } else {
        if (!bankForm.accountName || !bankForm.accountNumber || !bankForm.bankName) {
          showToast({ type: "error", title: "Complete your bank details" });
          return;
        }
        payload.bank_account_name = bankForm.accountName;
        payload.bank_account_number = bankForm.accountNumber;
        payload.bank_iban = bankForm.iban;
        payload.bank_name = bankForm.bankName;
        payload.bank_swift_code = bankForm.swift;
        payload.bank_additional_info = bankForm.notes;
      }

      const response = await submitWithdrawal(payload);
      const successMessage = response?.message ?? "Withdrawal request submitted";
      showToast({ type: "success", title: successMessage });
      handleClose(false);
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to submit withdrawal",
        description,
      });
    }
  };

  const renderCryptoOptions = () => (
    <div className="grid gap-3 sm:grid-cols-2">
      {withdrawalCryptoOptions.map((option) => {
        const isActive = selectedCryptoId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={cn(
              "cursor-pointer rounded-2xl border px-4 py-3 text-left transition focus:outline-none",
              isActive
                ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-400/10"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-gray-900"
            )}
            onClick={() => setSelectedCryptoId(option.id)}
          >
            <div className="flex items-center gap-3">
              <Image
                src={option.icon}
                alt={option.label}
                width={32}
                height={32}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {option.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const cryptoFormView = (
    <div className="space-y-6">
      {renderCryptoOptions()}
      <Field>
        <FieldLabel>Transaction amount</FieldLabel>
        <Input
          value={`${wallet?.symbol ?? "$"} ${availableBalanceLabel}`}
          readOnly
          disabled
          className="h-12 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Balance: {availableBalanceLabel} {wallet?.symbol ?? "USD"}
        </p>
      </Field>
      <Field>
        <FieldLabel>Wallet address</FieldLabel>
        <Input
          value={cryptoForm.walletAddress}
          onChange={(event) =>
            setCryptoForm((prev) => ({ ...prev, walletAddress: event.target.value }))
          }
          placeholder="Enter BTC/crypto wallet address"
          className="h-12 rounded-xl"
        />
      </Field>
    </div>
  );

  const bankFormView = (
    <div className="space-y-6">
      <Field>
        <FieldLabel>Transaction amount</FieldLabel>
        <Input
          value={`${wallet?.symbol ?? "$"} ${availableBalanceLabel}`}
          readOnly
          disabled
          className="h-12 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Account holder name</FieldLabel>
          <Input
            value={bankForm.accountName}
            onChange={(event) =>
              setBankForm((prev) => ({ ...prev, accountName: event.target.value }))
            }
            placeholder="Enter full name"
            className="rounded-xl"
          />
        </Field>
        <Field>
          <FieldLabel>Account number</FieldLabel>
          <Input
            value={bankForm.accountNumber}
            onChange={(event) =>
              setBankForm((prev) => ({ ...prev, accountNumber: event.target.value }))
            }
            placeholder="Enter account number"
            className="rounded-xl"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>IBAN</FieldLabel>
          <Input
            value={bankForm.iban}
            onChange={(event) => setBankForm((prev) => ({ ...prev, iban: event.target.value }))}
            placeholder="International bank account number"
            className="rounded-xl"
          />
        </Field>
        <Field>
          <FieldLabel>Bank name</FieldLabel>
          <Input
            value={bankForm.bankName}
            onChange={(event) => setBankForm((prev) => ({ ...prev, bankName: event.target.value }))}
            placeholder="Enter bank name"
            className="rounded-xl"
          />
        </Field>
      </div>
      <Field>
        <FieldLabel>Swift / BIC</FieldLabel>
        <Input
          value={bankForm.swift}
          onChange={(event) => setBankForm((prev) => ({ ...prev, swift: event.target.value }))}
          placeholder="Enter swift code"
          className="rounded-xl"
        />
      </Field>
      <Field>
        <FieldLabel>Notes (optional)</FieldLabel>
        <Input
          value={bankForm.notes}
          onChange={(event) => setBankForm((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Extra compliance instructions"
          className="rounded-xl"
        />
      </Field>
    </div>
  );

  const triggerNode = trigger ?? (
    <span className={defaultTriggerClasses}>{triggerText}</span>
  );

  const resolvedOpen = typeof open === "boolean" ? open : internalOpen;

  return (
    <FlowModal
      trigger={triggerNode}
      open={resolvedOpen}
      onOpenChange={handleClose}
      title="Fund Withdrawal"
      subtitle="Choose a withdrawal rail and confirm your details"
      contentClassName="max-w-4xl"
      dialogClassName="sm:max-w-4xl"
      {...dialogProps}
    >
      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        <div className="space-y-3">
          {withdrawalMethodTabs.map((item) => {
            const isActive = method === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "w-full rounded-xl border px-4 py-3 text-left transition cursor-pointer",
                  isActive
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10"
                    : "border-gray-100 bg-white hover:border-gray-200 dark:border-white/10 dark:bg-gray-900"
                )}
                onClick={() => setMethod(item.key)}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </p>
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {wallet && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-gray-900">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Available balance</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {wallet.symbol ?? "$"} {availableBalanceLabel}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{wallet.name}</p>
            </div>
          )}

          {method === "crypto" ? cryptoFormView : bankFormView}

          <div className="flex justify-end">
            <Button
              type="button"
              className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Processing..." : "Submit withdrawal"}
            </Button>
          </div>
        </div>
      </div>
    </FlowModal>
  );
}
