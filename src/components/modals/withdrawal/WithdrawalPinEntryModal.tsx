"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PinInput, PinInputGroup, PinInputInput } from "@/components/ui/pin-input";
import { useToast } from "@/components/providers/toast-provider";
import { getWithdrawalStageCopy } from "@/components/text/withdrawal";
import type { WithdrawalRequest } from "@/lib/types/api";
import { useUpdateWithdrawalStage } from "@/lib/api/withdrawal";
import Swal from "sweetalert2";
import { WithdrawalFormData, WithdrawalStage } from "@/lib/types/withdrawal";

interface WithdrawalPinEntryModalProps {
  formData: WithdrawalFormData;
  onBack: () => void;
  onNext: (stage: WithdrawalStage, status?: "success" | "failed" | "pending", message?: string) => void;
  withdrawalRequest?: WithdrawalRequest; // This will be passed from the backend after submit
}

const WithdrawalPinEntryModal = ({
  formData,
  onBack,
  onNext,
  withdrawalRequest,
}: WithdrawalPinEntryModalProps) => {
  const { showToast } = useToast();
  const { mutateAsync: updateStage, isPending } = useUpdateWithdrawalStage();
  const [pinValue, setPinValue] = React.useState<string[]>([]);
  void formData;

  // Use withdrawalRequest from props if available, otherwise fallback to a default structure
  const currentRequest: WithdrawalRequest = withdrawalRequest || {
    id: "temp-id", // Placeholder
    user_id: "temp-user-id", // Placeholder
    status: "pending", // Placeholder
    stage: "etf_code", // Default stage for pin entry if not provided
    amount: 0, // Placeholder
    code_length: 6, // Default PIN length
  };

  const digits = currentRequest.code_length && currentRequest.code_length > 0 ? currentRequest.code_length : 6;

  const copy = getWithdrawalStageCopy(currentRequest.stage, {
    amount: currentRequest.amount,
    percent: typeof currentRequest.percent === "number" ? currentRequest.percent : undefined,
    showPercent: currentRequest.show_percent ?? undefined,
    message: currentRequest.message ?? undefined,
  });

  React.useEffect(() => {
    // Reset pin value when component mounts or request changes
    setPinValue([]);
  }, [currentRequest.id, currentRequest.stage]);

  const codeString = pinValue.join("");

  const handleSubmit = async () => {
    if (codeString.length < digits) {
      showToast({ type: "error", title: `Enter the ${digits}-digit code` });
      return;
    }

    if (!currentRequest.id) {
      showToast({ type: "error", title: "Withdrawal request ID is missing." });
      return;
    }

    try {
      const response = await updateStage({
        id: currentRequest.id,
        payload: {
          stage: currentRequest.stage,
          code: codeString,
        },
      });
      const successMessage = response?.message ?? "Withdrawal stage updated";
      showToast({ type: "success", title: successMessage });
      onNext(WithdrawalStage.Status, "success", successMessage); // Transition to status stage on success
    } catch (error) {
      const apiError = error as Error & { error?: string; message?: string };
      const errorMessage = apiError?.message || "Unable to update withdrawal";
      const errorDescription = apiError?.error || "";
      Swal.fire({
        icon: "error",
        title: errorMessage,
        text: errorDescription,
        customClass: {
          popup: "swal-red-border",
        },
      });
      onNext(WithdrawalStage.Status, "failed", errorMessage); // Transition to status stage on failure
    }
  };

  const resolvedProgress = typeof copy.progress === "number" ? copy.progress : null;

  const pinLabel = copy.pinLabel ?? "Compliance code";

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image src="/loading.gif" alt="Loading" width={180} height={180} className="h-32 w-32" />
        {resolvedProgress !== null && (
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {resolvedProgress}% complete
          </p>
        )}
      </div>

      <div className="space-y-3 text-left">
        {copy.description && (
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {copy.description}
          </p>
        )}
        {copy.note && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{copy.note}</p>
        )}
        {copy.learnMoreLabel && (
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700 transition hover:border-gray-400 dark:border-white/20 dark:text-gray-200"
            onClick={() => {
              if (copy.learnMoreUrl && typeof window !== "undefined") {
                window.open(copy.learnMoreUrl, "_blank");
              }
            }}
          >
            {copy.learnMoreLabel}
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-gray-500 dark:text-gray-400">
            {pinLabel}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Provide the {digits}-digit code shared by your liaison.
          </p>
        </div>
        <PinInput
          value={pinValue}
          onValueChange={(details) => setPinValue(details.value)}
          otp
          blurOnComplete
        >
          <PinInputGroup>
            {Array.from({ length: digits }).map((_, index) => (
              <React.Fragment key={`digit-${index}`}>
                <PinInputInput index={index} />
                {index < digits - 1 && <span className="text-sm text-gray-400">-</span>}
              </React.Fragment>
            ))}
          </PinInputGroup>
        </PinInput>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-white"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </Button>
        <Button
          type="button"
          className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Proceed"}
        </Button>
      </div>
    </div>
  );
};

export default WithdrawalPinEntryModal;
