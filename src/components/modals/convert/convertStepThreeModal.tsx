"use client";

import React from "react";
import Image from "next/image";
import { Copy, ShieldCheck } from "lucide-react";
import FlowModal from "@/components/modals/flow/flowModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";
import { useUpdateConversionRequest } from "@/lib/api/conversion";
import type { PaymentWallet } from "@/lib/types/api";
import { formatUserCurrency } from "@/lib/currency";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";
import ConversionSuccessModal from "@/components/modals/convert/conversionSuccessModal";

type FlowModalBaseProps = Omit<
  React.ComponentProps<typeof FlowModal>,
  "title" | "subtitle" | "eyebrow" | "footer" | "children"
>;

interface ConvertStepThreeModalProps extends FlowModalBaseProps {
  assetName: string;
  paidAmount?: number | string | null;
  paymentWallet?: PaymentWallet | null;
  requestId?: string;
  onCompleted?: () => void;
  onSuccessMessage?: (message: string) => void;
  disableInlineSuccessModal?: boolean;
}

const ConvertStepThreeModal = ({
  assetName,
  paidAmount,
  paymentWallet,
  requestId,
  onCompleted,
  onSuccessMessage,
  disableInlineSuccessModal = false,
  contentClassName,
  dialogClassName,
  trigger,
  ...flowModalProps
}: ConvertStepThreeModalProps) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const {
    mutateAsync: updateConversion,
    isPending,
  } = useUpdateConversionRequest();

  const [isChecked, setIsChecked] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  const walletAddress = paymentWallet?.wallet ?? "";
  const qrImage = paymentWallet?.image ?? "/logo.png";
  const formattedAmount = formatUserCurrency(typeof paidAmount === 'string' ? parseFloat(paidAmount) || 0 : paidAmount ?? 0, user).displayValue;

  const handleCopy = async () => {
    if (!walletAddress) return;
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      showToast({ type: "error", title: "Clipboard not supported" });
      return;
    }
    try {
      await navigator.clipboard.writeText(walletAddress);
      showToast({ type: "success", title: "Wallet copied to clipboard" });
    } catch {
      showToast({ type: "error", title: "Unable to copy wallet" });
    }
  };

  const handleContinue = async () => {
    if (!requestId) return;
    try {
      const response = await updateConversion({
        id: requestId,
        payload: { confirmed_payment: true },
      });
      const message = response?.message ?? "Payment confirmed successfully";
      onSuccessMessage?.(message);
      if (!disableInlineSuccessModal) {
        setSuccessMessage(message);
        setIsSuccessOpen(true);
      }
      setIsChecked(false);
      flowModalProps.onOpenChange?.(false);
      onCompleted?.();
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to confirm payment",
        description,
      });
    }
  };

  const handleSuccessModalChange = (next: boolean) => {
    setIsSuccessOpen(next);
    if (!next) {
      setTimeout(() => setSuccessMessage(null), 200);
    }
  };

  return (
    <>
      <FlowModal
        trigger={trigger}
        title="Pay your Conversion Fee"
        subtitle={`Confirm your conversion payment for ${assetName}`}
        dialogClassName={cn("sm:max-w-xl", dialogClassName)}
        contentClassName={cn("w-full max-w-xl", contentClassName)}
        {...flowModalProps}
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100/80 bg-white/95 p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-inner dark:border-white/10 dark:bg-gray-950/80">
                <Image
                  src={qrImage}
                  alt="Wallet QR code"
                  width={200}
                  height={200}
                  className="h-48 w-48 object-contain"
                />
              </div>
              <div className="flex w-full flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {paymentWallet?.name ?? "BTC Wallet"}
                </p>
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-4 text-left dark:border-white/10 dark:bg-gray-900">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    Wallet Address
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="break-all font-mono text-sm text-gray-800 dark:text-gray-100">
                      {walletAddress || "No wallet provided"}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200"
                      onClick={handleCopy}
                      disabled={!walletAddress}
                    >
                      <Copy className="size-3.5" /> Copy
                    </button>
                  </div>
                </div>
                {paymentWallet?.message && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{paymentWallet.message}</p>
                )}
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-sm text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-emerald-500 dark:text-emerald-300" />
              <p>
                By checking this box you confirm that you have successfully transferred
                <strong> {formattedAmount}</strong> for the clearance of your Conversion fee.
              </p>
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
              checked={isChecked}
              onChange={(event) => setIsChecked(event.target.checked)}
            />
            <span>I confirm my payment has been sent successfully.</span>
          </label>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
              disabled={!isChecked || !requestId || isPending}
              onClick={handleContinue}
            >
              {isPending ? "Submitting..." : "Continue"}
            </Button>
          </div>
        </div>
      </FlowModal>

      {successMessage && (
        <ConversionSuccessModal
          open={isSuccessOpen}
          onOpenChange={handleSuccessModalChange}
          message={successMessage}
        />
      )}
    </>
  );
};

export default ConvertStepThreeModal;
