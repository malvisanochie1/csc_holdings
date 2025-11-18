"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/auth";
import TaxClearanceModal from "@/components/modals/withdrawal/TaxClearanceModal";
import EtfCodeModal from "@/components/modals/withdrawal/EtfCodeModal";
import EntityPinModal from "@/components/modals/withdrawal/EntityPinModal";
import FscsCodeModal from "@/components/modals/withdrawal/FscsCodeModal";
import RegulationCodeModal from "@/components/modals/withdrawal/RegulationCodeModal";
import FundTransferPinModal from "@/components/modals/withdrawal/FundTransferPinModal";
import { useUpdateWithdrawalStage } from "@/lib/api/withdrawal";
import { useToast } from "@/components/providers/toast-provider";
import Swal from "sweetalert2";
import { refetchCurrentUser } from "@/lib/api/auth";

export const WithdrawalStageWatcher = () => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const { mutateAsync: updateStage, isPending } = useUpdateWithdrawalStage();
  const request = user?.on_going_withdrawal_request;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const lastRequestRef = React.useRef<{ id: string | null; stage: string | null }>(
    { id: null, stage: null }
  );

  React.useEffect(() => {
    if (!request || request.status?.toLowerCase() !== "pending" || isProcessing) {
      if (!isProcessing) {
        setIsOpen(false);
        lastRequestRef.current = { id: null, stage: null };
      }
      return;
    }

    const currentStage = request.stage ?? null;
    const hasChanged =
      lastRequestRef.current.id !== request.id || lastRequestRef.current.stage !== currentStage;

    if (hasChanged && !isOpen) {
      lastRequestRef.current = { id: request.id, stage: currentStage };
      setIsOpen(true);
    }
  }, [request, isProcessing, isOpen]);

  const handleStageSubmit = async (code: string) => {
    if (!request || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const response = await updateStage({
        id: request.id,
        payload: {
          stage: request.stage,
          code: code,
        },
      });
      
      // Check if withdrawal is completed
      if ((response as { data?: { status?: string } })?.data?.status === "completed") {
        setIsProcessing(false);
        setIsOpen(false);
        // Show completion modal with custom SweetAlert
        Swal.fire({
          title: "",
          html: `
            <div class="withdrawal-success-card">
              <div class="success-icon">
                <span class="success-circle"></span>
                <span class="success-check"></span>
              </div>
              <h2>
                Withdrawal completed, kindly wait for confirmation.
              </h2>
            </div>
            <style>
              .withdrawal-success-card {
                background: linear-gradient(135deg, #1e3a8a, #3b4c7a);
                padding: 40px;
                border-radius: 16px;
                color: white;
                text-align: center;
              }
              .withdrawal-success-card h2 {
                font-size: 28px;
                font-weight: 600;
                margin: 0;
                line-height: 1.3;
              }
              .success-icon {
                position: relative;
                width: 90px;
                height: 90px;
                margin: 0 auto 24px;
              }
              .success-circle {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 4px solid rgba(16, 185, 129, 0.35);
                animation: pulse-circle 1.6s ease-out infinite;
              }
              .success-check {
                position: absolute;
                top: 28px;
                left: 24px;
                width: 42px;
                height: 24px;
                border-left: 4px solid #34d399;
                border-bottom: 4px solid #34d399;
                transform: rotate(-45deg) scale(0.8);
                transform-origin: bottom left;
                opacity: 0;
                animation: draw-check 0.6s ease forwards 0.2s;
              }
              @keyframes pulse-circle {
                0% { transform: scale(0.9); opacity: 0.8; }
                70% { transform: scale(1); opacity: 0.3; }
                100% { transform: scale(1.1); opacity: 0; }
              }
              @keyframes draw-check {
                to { opacity: 1; transform: rotate(-45deg) scale(1); }
              }
            </style>
          `,
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#dc2626",
          cancelButtonColor: "#6b7280",
          background: "transparent",
          backdrop: "rgba(0,0,0,0.8)",
          customClass: {
            popup: "!bg-transparent !shadow-none",
            htmlContainer: "!p-0 !m-0"
          }
        }).then(() => {
          // Refetch user data after completion
          refetchCurrentUser().catch(console.error);
        });
      } else {
        setIsOpen(false);
        
        // Show SweetAlert with progress
        
        Swal.fire({
          title: "",
          html: `
            <div style="text-align: center; padding: 30px;">
              <div style="margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(45deg, #3b82f6, #1d4ed8); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <div style="width: 50px; height: 50px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
              </div>
              <h2 style="font-size: 24px; font-weight: 700; margin: 0 0 15px 0; color: #1f2937;">Processing Withdrawal</h2>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">Please wait while we process your request...</p>
            </div>
            <style>
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .swal2-progress-bar {
                height: 2px !important;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8) !important;
              }
            </style>
          `,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false
        }).then(async () => {
          // Refetch user data and reset processing state
          try {
            await refetchCurrentUser();
            setIsProcessing(false);
            // The useEffect will handle opening the next modal automatically
          } catch (error) {
            console.error("Failed to refetch user:", error);
            setIsProcessing(false);
          }
        });
      }
    } catch (error) {
      const apiError = error as Error & { error?: string; message?: string };
      
      // Reset processing state and close modal to avoid z-index conflicts
      setIsProcessing(false);
      setIsOpen(false);
      
      const errorText = apiError?.error && apiError.error !== apiError.message 
        ? apiError.error 
        : "Please try again or contact support";

      showToast({
        type: "error",
        title: apiError?.message || "Unable to update withdrawal",
        description: errorText,
      });

      window.setTimeout(() => setIsOpen(true), 350);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!request || request.status?.toLowerCase() !== "pending") {
    return null;
  }


  // Render the appropriate modal based on the stage
  switch (request.stage) {
    case "fund_transfer_pin":
      return (
        <FundTransferPinModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    case "tax_clearance":
      return (
        <TaxClearanceModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    case "etf_code":
      return (
        <EtfCodeModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    case "entity_pin":
      return (
        <EntityPinModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    case "fscs_code":
      return (
        <FscsCodeModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    case "regulation_code":
      return (
        <RegulationCodeModal
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={handleStageSubmit}
          onCancel={handleCancel}
          request={request}
          isLoading={isPending}
        />
      );

    default:
      // Fallback for any unknown stages
      console.warn(`Unknown withdrawal stage: ${request.stage}`);
      return null;
  }
};
