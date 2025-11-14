"use client";

import React from "react";
import ConvertStepTwoModal from "@/components/modals/convert/convertStepTwoModal";
import ConvertStepThreeModal from "@/components/modals/convert/convertStepThreeModal";
import ConversionSuccessModal from "@/components/modals/convert/conversionSuccessModal";
import { useAuthStore } from "@/lib/store/auth";
import { findUserAssetByWalletId, formatConversionRateRange } from "@/lib/wallets";

export const ConversionRequestWatcher = () => {
  const { user } = useAuthStore();
  const requests = React.useMemo(
    () => user?.on_going_conversion_requests ?? [],
    [user?.on_going_conversion_requests]
  );

  const pendingRequests = React.useMemo(
    () =>
      requests.filter((request) => request.status?.toLowerCase() === "pending"),
    [requests]
  );

  const activeRequest = React.useMemo(() => {
    if (!pendingRequests.length) return undefined;
    if (pendingRequests.length === 1) return pendingRequests[0];
    return [...pendingRequests].sort((a, b) => (b.step ?? 0) - (a.step ?? 0))[0];
  }, [pendingRequests]);

  const [isStepTwoOpen, setIsStepTwoOpen] = React.useState(false);
  const [isStepThreeOpen, setIsStepThreeOpen] = React.useState(false);
  const [inputAmount, setInputAmount] = React.useState("");
  const lastRequestId = React.useRef<string | null>(null);
  const lastStep = React.useRef<number | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  const requestStep = typeof activeRequest?.step === "number" ? activeRequest.step : null;
  const shouldShowStepThree = requestStep === 2;
  const shouldShowStepTwo = requestStep === 1;

  React.useEffect(() => {
    if (!activeRequest || (!shouldShowStepTwo && !shouldShowStepThree)) {
      lastRequestId.current = null;
      lastStep.current = null;
      setIsStepTwoOpen(false);
      setIsStepThreeOpen(false);
      setInputAmount("");
      return;
    }

    const hasChanged =
      lastRequestId.current !== activeRequest.id || lastStep.current !== requestStep;

    if (hasChanged) {
      lastRequestId.current = activeRequest.id;
      lastStep.current = requestStep;
      setInputAmount("");
      if (shouldShowStepThree) {
        setIsStepThreeOpen(true);
        setIsStepTwoOpen(false);
      } else if (shouldShowStepTwo) {
        setIsStepTwoOpen(true);
        setIsStepThreeOpen(false);
      }
    }
  }, [activeRequest, requestStep, shouldShowStepTwo, shouldShowStepThree]);

  const handleGlobalSuccess = React.useCallback((message: string) => {
    setSuccessMessage(message);
    setIsSuccessOpen(true);
  }, []);

  const handleSuccessModalChange = (next: boolean) => {
    setIsSuccessOpen(next);
    if (!next) {
      setTimeout(() => setSuccessMessage(null), 200);
    }
  };

  if (!activeRequest && !successMessage) return null;

  const sourceAsset = activeRequest
    ? findUserAssetByWalletId(user, activeRequest.from_wallet_id)
    : undefined;
  const { percentageLabel, amountLabel } = formatConversionRateRange(
    sourceAsset,
    activeRequest?.amount
  );

  const progressValue =
    typeof activeRequest?.percent === "number" ? activeRequest.percent : undefined;

  return (
    <>
      {activeRequest && shouldShowStepThree && (
        <ConvertStepThreeModal
          open={isStepThreeOpen}
          onOpenChange={setIsStepThreeOpen}
          trigger={null}
          assetName={sourceAsset?.name ?? "Asset"}
          paidAmount={activeRequest.paid_amount ?? activeRequest.amount}
          paymentWallet={user?.payment_wallet ?? null}
          requestId={activeRequest.id}
          onCompleted={() => setIsStepThreeOpen(false)}
          onSuccessMessage={handleGlobalSuccess}
          disableInlineSuccessModal
        />
      )}

      {activeRequest && shouldShowStepTwo && (
        <ConvertStepTwoModal
          open={isStepTwoOpen}
          onOpenChange={setIsStepTwoOpen}
          trigger={null}
          assetName={sourceAsset?.name ?? "Asset"}
          progress={progressValue}
          feeRange={percentageLabel}
          amountRange={amountLabel}
          paymentAmount={inputAmount}
          onPaymentAmountChange={setInputAmount}
          onContinue={() => setIsStepTwoOpen(false)}
          conversionPeriod={user?.conversion_period ?? null}
          requestId={activeRequest.id}
        />
      )}

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
