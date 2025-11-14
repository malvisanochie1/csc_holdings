"use client";

import React from "react";
import { ArrowRightLeft, ShieldAlert, Loader2 } from "lucide-react";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ConversionRequest, CurrencyAsset, PaymentWallet } from "@/lib/types/api";
import { useCancelConversionRequest } from "@/lib/api/conversion";
import { useToast } from "@/components/providers/toast-provider";
import ConvertStepTwoModal from "@/components/modals/convert/convertStepTwoModal";
import ConvertStepThreeModal from "@/components/modals/convert/convertStepThreeModal";
import { formatConversionRateRange } from "@/lib/wallets";
import { cn } from "@/lib/utils";

interface OngoingConversionModalProps
  extends Omit<React.ComponentProps<typeof FlowModal>, "children" | "title" | "subtitle" | "eyebrow"> {
  request: ConversionRequest;
  sourceAsset?: CurrencyAsset;
  destinationWallet?: CurrencyAsset;
  conversionPeriod?: string | number | null;
  paymentWallet?: PaymentWallet | null;
}

const OngoingConversionModal = ({
  trigger,
  request,
  sourceAsset,
  destinationWallet,
  conversionPeriod,
  paymentWallet,
  ...rest
}: OngoingConversionModalProps) => {
  const { titleClassName: restTitleClassName, ...flowModalProps } = rest;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isStepTwoOpen, setIsStepTwoOpen] = React.useState(false);
  const [isStepThreeOpen, setIsStepThreeOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const { showToast } = useToast();
  const {
    mutateAsync: cancelRequest,
    isPending: isCancelling,
  } = useCancelConversionRequest();

  const { percentageLabel, amountLabel } = formatConversionRateRange(
    sourceAsset,
    request.amount
  );

  const statusLabel = request.status?.replace(/_/g, " ") ?? "pending";
  const normalizedStatus = request.status?.toLowerCase();
  const isProcessing = normalizedStatus === "processing" || (request.step ?? 0) > 2;
  const isStepThree = request.step === 2;
  const isStepTwo = request.step === 1;
  const requestMessage = request.message?.trim();

  const handleCancel = async () => {
    try {
      const response = await cancelRequest(request.id);
      const message = response?.message ?? "Conversion request cancelled";
      showToast({ type: "success", title: message });
      setIsOpen(false);
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to cancel conversion",
        description,
      });
    }
  };

  const conversionTitle = `${sourceAsset?.name ?? "Asset"} → ${destinationWallet?.name ?? "Fiat"}`;
  const modalTitle = isProcessing ? "Conversion Processing" : "Ongoing Conversion Request";
  const modalSubtitle = isProcessing
    ? undefined
    : "You have a conversion that is currently being processed.";
  const eyebrowLabel = isProcessing ? undefined : "Conversion";

  const fallbackInfoMessage = isProcessing
    ? "Your confirmation was received. Our escrow desk is finalizing settlement within the stated conversion window."
    : `Your conversion fee should fall between ${percentageLabel} (≈ ${amountLabel}). Conversion window: ${conversionPeriod ?? "10 days"}. Submit the fee within this window to move your request into settlement.`;

  const informationalMessage = requestMessage || fallbackInfoMessage;

  const handleProceed = () => {
    if (isProcessing) return;
    setIsOpen(false);
    if (isStepThree) {
      setIsStepThreeOpen(true);
      return;
    }
    if (isStepTwo) {
      setIsStepTwoOpen(true);
    }
  };

  const handlePrimaryAction = () => {
    if (isProcessing) {
      setIsOpen(false);
      return;
    }
    handleProceed();
  };

  return (
    <>
      <FlowModal
        trigger={trigger}
        contentClassName="max-w-xl"
        dialogClassName="sm:max-w-xl"
        open={isOpen}
        onOpenChange={setIsOpen}
        title={modalTitle}
        subtitle={modalSubtitle}
        eyebrow={eyebrowLabel}
        titleClassName={cn(restTitleClassName, isProcessing ? "text-lg font-semibold" : undefined)}
        {...flowModalProps}
      >
        <section className="rounded-2xl border border-gray-100/80 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
          <div className="flex items-center gap-3 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            {isProcessing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowRightLeft className="size-4" />
            )}
            <span>{conversionTitle}</span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <p>
              <strong>Status:</strong> {statusLabel}
            </p>
            <p>
              Destination Wallet: <strong>{destinationWallet?.name ?? "Fiat Wallet"}</strong>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {informationalMessage}
            </p>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                Cancel Conversion
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md border border-gray-100 bg-white/95 p-0 shadow-2xl shadow-gray-900/10 dark:border-white/10 dark:bg-gray-900">
              <div className="space-y-4 px-6 py-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                    <ShieldAlert className="size-5" />
                  </span>
                  <AlertDialogHeader className="p-0">
                    <AlertDialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                      Confirm cancellation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                      This action cannot be undone. Cancelling will move your request back to the beginning of the queue.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100">
                  You’ll need to initiate a new conversion and repeat the compliance checks if you cancel now.
                </div>
              </div>
              <AlertDialogFooter className="gap-3 border-t border-gray-100 px-6 py-4 dark:border-white/5">
                <AlertDialogCancel className="cursor-pointer rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300">
                  Go back
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-500"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Yes, cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            type="button"
            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={handlePrimaryAction}
            disabled={!isProcessing && !isStepTwo && !isStepThree}
          >
            {isProcessing
              ? "Close"
              : isStepThree
                ? "Confirm Payment"
                : isStepTwo
                  ? "Proceed"
                  : "Unavailable"}
          </Button>
        </div>
      </FlowModal>

      <ConvertStepTwoModal
        open={isStepTwoOpen}
        onOpenChange={setIsStepTwoOpen}
        trigger={null}
        assetName={sourceAsset?.name ?? "Asset"}
        progress={request.percent ?? 0}
        feeRange={percentageLabel}
        amountRange={amountLabel}
        paymentAmount={paymentAmount}
        onPaymentAmountChange={setPaymentAmount}
        onContinue={() => {
          setPaymentAmount("");
          setIsStepTwoOpen(false);
        }}
        conversionPeriod={conversionPeriod}
        requestId={request.id}
      />

      <ConvertStepThreeModal
        open={isStepThreeOpen}
        onOpenChange={setIsStepThreeOpen}
        trigger={null}
        assetName={sourceAsset?.name ?? "Asset"}
        paidAmount={request.paid_amount ?? request.amount}
        paymentWallet={paymentWallet}
        requestId={request.id}
        onCompleted={() => setIsStepThreeOpen(false)}
      />
    </>
  );
};

export default OngoingConversionModal;
