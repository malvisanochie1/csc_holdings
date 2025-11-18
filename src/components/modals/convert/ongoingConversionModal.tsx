"use client";

import React from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import type { ConversionRequest, CurrencyAsset, PaymentWallet } from "@/lib/types/api";
import { useCancelConversionRequest } from "@/lib/api/conversion";
import { useToast } from "@/components/providers/toast-provider";
import { useAuthStore } from "@/lib/store/auth";
import Swal from "sweetalert2";
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
  const { user } = useAuthStore();
  const { titleClassName: restTitleClassName, ...flowModalProps } = rest;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isStepTwoOpen, setIsStepTwoOpen] = React.useState(false);
  const [isStepThreeOpen, setIsStepThreeOpen] = React.useState(false);
  const [paymentAmount, setPaymentAmount] = React.useState("");
  const { showToast } = useToast();
  const {
    mutateAsync: cancelRequest,
  } = useCancelConversionRequest();

  const { percentageLabel, amountLabel } = formatConversionRateRange(
    sourceAsset,
    request.amount,
    user
  );

  const statusLabel = request.status?.replace(/_/g, " ") ?? "pending";
  const normalizedStatus = request.status?.toLowerCase();
  const isProcessing = normalizedStatus === "processing" || (request.step ?? 0) > 2;
  const isStepThree = request.step === 2;
  const isStepTwo = request.step === 1;
  const requestMessage = request.message?.trim();

  const handleCancel = async () => {
    // Close the existing modal first to avoid z-index conflicts
    setIsOpen(false);
    
    const result = await Swal.fire({
      title: "Are you sure you want to cancel?",
      html: '<span style="color: #dc2626;">This action cannot be undone. Your request will be reset, and you\'ll be required to begin a new conversion and full compliance verification.</span>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) {
      // If user cancels, reopen the modal
      setIsOpen(true);
      return;
    }

    // Show loading state in SweetAlert
    Swal.fire({
      title: "Cancelling conversion...",
      text: "Please wait while we process your cancellation.",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await cancelRequest(request.id);
      const message = response?.message ?? "Conversion request cancelled";
      
      // Show success message
      await Swal.fire({
        title: "Cancelled!",
        text: message,
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      
      showToast({ type: "success", title: message });
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : "Please try again or contact support";
      
      // Show error message
      await Swal.fire({
        title: "Error!",
        text: apiError?.message || "Unable to cancel conversion",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      
      showToast({
        type: "error",
        title: apiError?.message || "Unable to cancel conversion",
        description,
      });
      
      // Reopen the modal on error
      setIsOpen(true);
    }
  };

  const conversionTitle = `${sourceAsset?.name ?? "Asset"} → ${destinationWallet?.name ?? "Fiat"}`;
  const modalTitle = isProcessing ? "Conversion Processing" : "Ongoing Conversion Request";
  const modalSubtitle = isProcessing
    ? undefined
    : "You have a conversion that is currently being processed.";
  const eyebrowLabel = isProcessing ? undefined : "Conversion";

  const fallbackInfoMessage = isProcessing
    ? "Your confirmation was received. Our escrow desk is finalizing settlement within the stated conversion period."
    : `Your conversion fee should fall between ${percentageLabel} (≈ ${amountLabel}). Conversion period: ${conversionPeriod ?? "10 days"}. Conversion fees should be submitted within the duration.`;

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
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer border-rose-200 text-rose-600 hover:bg-rose-50"
            onClick={handleCancel}
          >
            Cancel Conversion
          </Button>

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
