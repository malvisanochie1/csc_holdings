"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/auth";
import WithdrawalStageModal from "@/components/modals/withdrawal/withdrawalStageModal";

export const WithdrawalStageWatcher = () => {
  const { user } = useAuthStore();
  const request = user?.on_going_withdrawal_request;
  const [isOpen, setIsOpen] = React.useState(false);
  const lastRequestRef = React.useRef<{ id: string | null; stage: string | number | null }>(
    { id: null, stage: null }
  );

  React.useEffect(() => {
    if (!request || request.status?.toLowerCase() !== "pending") {
      setIsOpen(false);
      lastRequestRef.current = { id: null, stage: null };
      return;
    }

    const currentStage = request.stage ?? null;
    const hasChanged =
      lastRequestRef.current.id !== request.id || lastRequestRef.current.stage !== currentStage;

    if (hasChanged) {
      lastRequestRef.current = { id: request.id, stage: currentStage };
      setIsOpen(true);
    }
  }, [request]);

  if (!request || request.status?.toLowerCase() !== "pending") {
    return null;
  }

  return (
    <WithdrawalStageModal
      request={request}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={null}
    />
  );
};
