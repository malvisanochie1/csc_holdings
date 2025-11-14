"use client";

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateConversionRequest } from "@/lib/api/conversion";
import { useToast } from "@/components/providers/toast-provider";
import FlowModal from "@/components/modals/flow/flowModal";
import { cn } from "@/lib/utils";

type FlowModalBaseProps = Omit<
  React.ComponentProps<typeof FlowModal>,
  "title" | "subtitle" | "eyebrow" | "footer" | "children"
>;

interface ConvertStepTwoModalProps extends FlowModalBaseProps {
  trigger?: React.ReactNode;
  assetName: string;
  btcAddress?: string;
  progress?: number;
  feeRange?: string;
  amountRange?: string;
  paymentAmount?: string;
  onPaymentAmountChange?: (value: string) => void;
  onContinue?: () => void;
  conversionPeriod?: string | number | null;
  requestId?: string;
}

const defaultAddress = "16wy8LGZri25Rbtk5iD6xxGvZ6txZXVZb";

const ConvertStepTwoModal = ({
  trigger,
  assetName,
  btcAddress = defaultAddress,
  progress = 80,
  feeRange = "0.00% - 0.00%",
  amountRange = "$0 - $0",
  paymentAmount = "",
  onPaymentAmountChange,
  onContinue,
  conversionPeriod,
  requestId,
  contentClassName,
  dialogClassName,
  ...flowModalProps
}: ConvertStepTwoModalProps) => {
  const { showToast } = useToast();
  const {
    mutateAsync: updateConversion,
    isPending: isUpdating,
  } = useUpdateConversionRequest();
  const [inputError, setInputError] = React.useState<string | null>(null);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value ?? "";
    const sanitized = rawValue
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");
    onPaymentAmountChange?.(sanitized);
    if (inputError) {
      setInputError(null);
    }
  };

  const resolvedConversionPeriod = React.useMemo(() => {
    if (conversionPeriod === undefined || conversionPeriod === null || conversionPeriod === "") {
      return "10 days";
    }
    if (typeof conversionPeriod === "number") {
      return `${conversionPeriod} days`;
    }
    return conversionPeriod;
  }, [conversionPeriod]);

  const handleContinue = async () => {
    if (!requestId) {
      onContinue?.();
      return;
    }

    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setInputError("Enter the conversion fee amount to proceed");
      return;
    }

    try {
      const response = await updateConversion({
        id: requestId,
        payload: { amount: paymentAmount },
      });
      const successMessage = response?.message ?? "Conversion request updated";
      showToast({ type: "success", title: successMessage });
      onContinue?.();
      flowModalProps.onOpenChange?.(false);
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to update conversion",
        description,
      });
    }
  };

  return (
    <FlowModal
      trigger={trigger ?? undefined}
      title="Step 2"
      subtitle="Continue your conversion request"
      dialogClassName={cn("sm:max-w-xl", dialogClassName)}
      contentClassName={cn(
        "w-full bg-white/95 sm:max-w-xl dark:bg-gray-950",
        contentClassName
      )}
      {...flowModalProps}
    >
      <div className="space-y-7">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-300">
            Loading
          </p>
          <Image
            src="/loading.gif"
            alt="Loading animation"
            width={140}
            height={140}
            className="h-28 w-28 object-contain"
          />
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-100">
            <span>{progress}%</span>
            <span className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-700 dark:border-t-transparent" />
          </div>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p>
            You are required to pay a conversion fee ranging between
            <strong> {feeRange}</strong> which is equal to approximately
            <strong> {amountRange}</strong>. This mobilizes an escrow representative to facilitate the sale of your
            <strong> {assetName}</strong> at the best market value.
          </p>
          <p>
            Kindly make your payment to the bitcoin address below:
            <br />
            <span className="font-semibold text-gray-900 dark:text-white">{btcAddress}</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Type the amount you would like to pay for conversion:
          </label>
          <Input
            value={paymentAmount}
            inputMode="decimal"
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 dark:border-white/15 dark:bg-gray-900 dark:text-white"
          />
          {inputError && <p className="text-xs text-rose-500">{inputError}</p>}
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          Within the duration of <strong>{resolvedConversionPeriod}</strong>, the conversion rate will remain {feeRange}.
          After this timeframe, conversion rates are subject to change according to real-time asset price fluctuations.
        </p>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            size="lg"
            className="cursor-pointer bg-lime-500 text-white hover:bg-lime-400 disabled:opacity-60"
            onClick={handleContinue}
            disabled={isUpdating}
          >
            {isUpdating ? "Processing..." : "Continue →"}
          </Button>
        </div>
      </div>
    </FlowModal>
  );
};

export default ConvertStepTwoModal;
