"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { getStageContent } from "@/lib/constants/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";
import { useAuthStore } from "@/lib/store/auth";
import { useSiteTitle } from "@/hooks/use-site-title";

interface RegulationCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (code: string) => void;
  onCancel?: () => void;
  request: WithdrawalRequest;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const RegulationCodeModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  request,
  isLoading = false,
  trigger
}: RegulationCodeModalProps) => {
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  const { user } = useAuthStore();
  const siteTitle = useSiteTitle();
  
  // Get dynamic percent from user charges with fallback
  const chargePercent = user?.charges?.percent || "23";
  
  const stageContent = getStageContent("regulation_code", {
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
      contentClassName="max-w-2xl"
      dialogClassName="sm:max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <Image src="/loading.gif" alt="Loading" width={180} height={180} className="h-32 w-32" />
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
            100%
          </div>
          {isLoading && (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {stageContent.processingMessage}
            </p>
          )}
        </div>

        <div className="space-y-4 text-left max-w-2xl mx-auto">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            GOV.UK is in charge of regulating {siteTitle}.
          </p>
          
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Contract for Difference (CFD) trading profits must conform to our organisational standards. Regulations are a crucial component of CFD-related funds.
          </p>
          
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Individuals who trade cryptocurrencies, commodities, etc. as CFDs must comply with these regulations to make a withdrawal.
          </p>
          
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Contact our support team for further information.
          </p>
          
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            To obtain the regulatory code, <strong>{chargePercent}%</strong> of the regulatory fee is required.
          </p>
          
          <div className="space-y-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 dark:text-red-200">PAYMENT SERVICES STATUS</p>
            <p className="text-sm text-red-600 dark:text-red-300">
              Authorized Payment Institution Since 16/11/2018. Under the regulation of GOV.UK. All funds here are secured under an Insurance Policy from the European Banking Association (EBA-ABE).
            </p>
            <p className="text-sm font-medium text-red-600 dark:text-red-300">
              KINDLY NOTE: This is a firm permitted to provide payment services.
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
                  key={`regulation-digit-${index}`}
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

export default RegulationCodeModal;
