"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert } from "react-icons/md";
import { ArrowDownRight, ArrowUpDown, ArrowUpRight, Loader2 } from "lucide-react";
import ConvertAssetModal from "@/components/modals/convert/convertAssetModal";
import ConvertStepTwoModal from "@/components/modals/convert/convertStepTwoModal";
import ConvertStepThreeModal from "@/components/modals/convert/convertStepThreeModal";
import OngoingConversionModal from "@/components/modals/convert/ongoingConversionModal";
import TaxClearanceModal from "@/components/modals/withdrawal/TaxClearanceModal";
import EtfCodeModal from "@/components/modals/withdrawal/EtfCodeModal";
import EntityPinModal from "@/components/modals/withdrawal/EntityPinModal";
import FscsCodeModal from "@/components/modals/withdrawal/FscsCodeModal";
import RegulationCodeModal from "@/components/modals/withdrawal/RegulationCodeModal";
import FundTransferPinModal from "@/components/modals/withdrawal/FundTransferPinModal";
import { Withdraw } from "@/components/sections/withdraw/withdraw";
import { useCancelWithdrawalRequest, useUpdateWithdrawalStage } from "@/lib/api/withdrawal";
import { useToast } from "@/components/providers/toast-provider";
import Swal from "sweetalert2";
import { useAuthStore } from "@/lib/store/auth";
import { refetchCurrentUser } from "@/lib/api/auth";
import {
  findUserAssetByWalletId,
  findUserCurrencyById,
  formatConversionRateRange,
} from "@/lib/wallets";
import { useInsufficientBalanceAlert } from "@/components/modals/withdrawal/insufficientBalance";
import { formatUserCurrency } from "@/lib/currency";

interface AssetCardProps {
  img: string;
  currency: string;
  amount: number | string;
  option: string;
  className?: string;
  percentageChange?: number;
  showPercentage?: boolean;
  actionType?: "convert" | "withdraw";
  walletId?: string;
  userWalletId?: string;
}

const AssetCard = ({
  img,
  currency,
  amount,
  option,
  className = "",
  percentageChange,
  showPercentage = true,
  actionType,
  walletId,
  userWalletId,
}: AssetCardProps) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [stepTwoAmount, setStepTwoAmount] = React.useState("");
  const showInsufficientBalance = useInsufficientBalanceAlert();

  const parseAmount = (value?: number | string) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value.replace(/,/g, ""));
      return Number.isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  };

  const numericAmount = parseAmount(amount) ?? 0;
  const previousAmountRef = React.useRef(numericAmount);
  const isFirstRenderRef = React.useRef(true);
  const [amountTrend, setAmountTrend] = React.useState<"up" | "down" | null>(null);

  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      previousAmountRef.current = numericAmount;
      return;
    }

    const prev = previousAmountRef.current;
    if (numericAmount !== prev) {
      setAmountTrend(numericAmount >= prev ? "up" : "down");
      previousAmountRef.current = numericAmount;
      const timeout = setTimeout(() => setAmountTrend(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [numericAmount]);
  
  // Custom number formatter for currencies with 2 decimal places
  const formatCurrencyBalance = (amount: number) => {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const resolvedAction =
    actionType ?? (option?.toLowerCase() === "convert" ? "convert" : "withdraw");
  const userTotalAssetValue = React.useMemo(() => {
    const candidates: Array<number | string | undefined> = [
      user?.total_asset_val as number | string | undefined,
      user?.total_asset as number | string | undefined,
    ];
    for (const value of candidates) {
      const parsedValue = parseAmount(value);
      if (typeof parsedValue === "number" && Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
    return 0;
  }, [user?.total_asset, user?.total_asset_val]);
  const requiresConversionBeforeWithdraw =
    resolvedAction === "withdraw" && userTotalAssetValue > 0;

  const conversions = React.useMemo(
    () => user?.on_going_conversion_requests ?? [],
    [user?.on_going_conversion_requests]
  );
  const withdrawalRequest = React.useMemo(
    () => user?.on_going_withdrawal_request ?? null,
    [user?.on_going_withdrawal_request]
  );
  const activeConversionRequest = React.useMemo(() => {
    if (!conversions.length || !walletId) return undefined;
    return conversions.find((request) => request.from_wallet_id === walletId);
  }, [conversions, walletId]);

  const matchingWithdrawalRequest = React.useMemo(() => {
    if (!withdrawalRequest) return null;
    const cardIds = [walletId, userWalletId].filter(Boolean) as string[];
    if (!cardIds.length) return null;
    const requestIds = [
      withdrawalRequest.from_wallet_id,
      withdrawalRequest.wallet_id,
      withdrawalRequest.currency_id,
      withdrawalRequest.user_wallet_id,
    ].filter(Boolean) as string[];
    if (!requestIds.length) return null;
    const matches = cardIds.some((id) => requestIds.includes(id));
    return matches ? withdrawalRequest : null;
  }, [withdrawalRequest, walletId, userWalletId]);

  const sourceAsset = React.useMemo(
    () => findUserAssetByWalletId(user, walletId),
    [user, walletId]
  );

  const destinationWallet = React.useMemo(
    () => findUserCurrencyById(user, activeConversionRequest?.to_wallet_id),
    [user, activeConversionRequest?.to_wallet_id]
  );

  const fiatWallet = React.useMemo(() => findUserCurrencyById(user, walletId), [user, walletId]);

  const activeStep =
    typeof activeConversionRequest?.step === "number" ? activeConversionRequest.step : null;
  const canTriggerStepTwo = activeStep === 1;
  const canTriggerStepThree = activeStep === 2;
  const hasActiveConversion = Boolean(activeConversionRequest);
  const hasActiveWithdrawal = resolvedAction === "withdraw" && Boolean(matchingWithdrawalRequest);
  const shouldShowActionMenu = !hasActiveConversion && !hasActiveWithdrawal;
  const isProcessingState = React.useMemo(() => {
    if (!activeConversionRequest) return false;
    if (typeof activeConversionRequest.step === "number" && activeConversionRequest.step > 2) {
      return true;
    }
    const status = activeConversionRequest.status?.toLowerCase();
    return status === "processing";
  }, [activeConversionRequest]);

  React.useEffect(() => {
    if (!activeConversionRequest) {
      setStepTwoAmount("");
    }
  }, [activeConversionRequest]);

  const actionTriggerClass =
    "block w-full px-3 py-1.5 text-left text-sm font-medium text-gray-600 dark:text-gray-200";
  const isWithdrawalProcessing =
    matchingWithdrawalRequest?.status?.toLowerCase() === "processing";
  const isWithdrawalCompleted =
    matchingWithdrawalRequest?.status?.toLowerCase() === "completed";
  const isWithdrawalPending =
    matchingWithdrawalRequest?.status?.toLowerCase() === "pending";
    
  const withdrawalButtonTitle = isWithdrawalProcessing
    ? "Withdrawal processing"
    : isWithdrawalCompleted
    ? "Withdrawal completed"
    : "Continue withdrawal";
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = React.useState(false);
  const [isWithdrawalMenuOpen, setIsWithdrawalMenuOpen] = React.useState(false);
  const {
    mutateAsync: cancelWithdrawal,
    isPending: isCancellingWithdrawal,
  } = useCancelWithdrawalRequest();
  const { mutateAsync: updateStage, isPending: isUpdatingStage } = useUpdateWithdrawalStage();

  React.useEffect(() => {
    if (!matchingWithdrawalRequest) {
      setIsWithdrawalModalOpen(false);
      setIsWithdrawalMenuOpen(false);
    }
  }, [matchingWithdrawalRequest]);

  const handleWithdrawalContinue = () => {
    setIsWithdrawalModalOpen(true);
    setIsWithdrawalMenuOpen(false);
  };

  const handleWithdrawalCancel = async () => {
    if (!matchingWithdrawalRequest) return;
    
    // Close the existing modal first to avoid z-index conflicts
    setIsWithdrawalMenuOpen(false);
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently cancel the withdrawal. You will need to start a new withdrawal request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel withdrawal!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (!result.isConfirmed) {
      // If user cancels, reopen the modal
      setIsWithdrawalMenuOpen(true);
      return;
    }

    // Show loading state in SweetAlert
    Swal.fire({
      title: "Cancelling withdrawal...",
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
      const response = await cancelWithdrawal(matchingWithdrawalRequest.id);
      const message = response?.message ?? "Withdrawal cancelled";
      
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
        text: apiError?.message || "Unable to cancel withdrawal",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      
      showToast({
        type: "error",
        title: apiError?.message || "Unable to cancel withdrawal",
        description,
      });
      
      // Reopen the modal on error
      setIsWithdrawalMenuOpen(true);
    }
  };

  const handleStageSubmit = async (code: string) => {
    if (!matchingWithdrawalRequest) return;

    try {
      const response = await updateStage({
        id: matchingWithdrawalRequest.id,
        payload: {
          stage: matchingWithdrawalRequest.stage,
          code: code,
        },
      });
      const successMessage = response?.message ?? "Withdrawal stage updated successfully";
      
      // Check if withdrawal is completed
      if ((response as { data?: { status?: string } })?.data?.status === "completed") {
        setIsWithdrawalModalOpen(false);
        // Show completion modal with custom SweetAlert
        Swal.fire({
          title: "",
          html: `
            <div style="background: linear-gradient(135deg, #1e3a8a, #3b4c7a); padding: 40px; border-radius: 16px; color: white; text-align: center;">
              <div style="margin-bottom: 30px;">
                <svg width="80" height="80" viewBox="0 0 24 24" style="margin: 0 auto; animation: checkmark-bounce 0.8s ease-out;">
                  <circle cx="12" cy="12" r="11" fill="none" stroke="#10B981" stroke-width="2" style="animation: checkmark-circle 0.8s ease-out;"/>
                  <path d="M8 12l2 2 4-4" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray: 20; stroke-dashoffset: 20; animation: checkmark-path 0.8s ease-out 0.3s forwards;"/>
                </svg>
              </div>
              <style>
                @keyframes checkmark-bounce {
                  0% { transform: scale(0); opacity: 0; }
                  50% { transform: scale(1.2); }
                  100% { transform: scale(1); opacity: 1; }
                }
                @keyframes checkmark-circle {
                  0% { stroke-dasharray: 0 68; }
                  100% { stroke-dasharray: 68 68; }
                }
                @keyframes checkmark-path {
                  0% { stroke-dashoffset: 20; }
                  100% { stroke-dashoffset: 0; }
                }
              </style>
              <h2 style="font-size: 28px; font-weight: 600; margin: 0 0 20px 0; line-height: 1.2;">
                Withdrawal completed, kindly wait for confirmation.
              </h2>
              <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 0;">${successMessage}</p>
            </div>
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
        setIsWithdrawalModalOpen(false);
        
        // Show loading state in SweetAlert (consistent with conversion cancellation style)
        Swal.fire({
          title: "Processing withdrawal...",
          text: "Please wait while we process your request.",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        // Set a timer to close the loading modal and refetch user data
        setTimeout(async () => {
          Swal.close();
          try {
            await refetchCurrentUser();
          } catch (error) {
            console.error("Failed to refetch user:", error);
          }
        }, 3000);
      }
    } catch (error) {
      const apiError = error as Error & { error?: string; message?: string };
      
      // Show error as danger toast instead of modal
      const description = apiError?.error && apiError.error !== apiError.message 
        ? apiError.error 
        : undefined;
      
      showToast({
        type: "error",
        title: apiError?.message || "Invalid code",
        description,
      });
    }
  };

  const renderAction = () => {
    if (resolvedAction === "convert") {
      if (hasActiveConversion && activeConversionRequest) {
        const sourceAsset = findUserAssetByWalletId(
          user,
          activeConversionRequest.from_wallet_id
        );
        const { percentageLabel, amountLabel } = formatConversionRateRange(
          sourceAsset,
          activeConversionRequest.amount,
          user
        );

        const progressValue =
          typeof activeConversionRequest.percent === "number"
            ? activeConversionRequest.percent
            : undefined;

        if (canTriggerStepTwo) {
          return (
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="p-0"
            >
              <ConvertStepTwoModal
                trigger={
                  <button type="button" className={actionTriggerClass}>
                    Continue Conversion
                  </button>
                }
                assetName={sourceAsset?.name ?? currency}
                progress={progressValue}
                feeRange={percentageLabel}
                amountRange={amountLabel}
                paymentAmount={stepTwoAmount}
                onPaymentAmountChange={(value) => setStepTwoAmount(value)}
                onContinue={() => setStepTwoAmount("")}
                conversionPeriod={user?.conversion_period ?? null}
                requestId={activeConversionRequest.id}
              />
            </DropdownMenuItem>
          );
        }

        if (canTriggerStepThree) {
          return (
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="p-0"
            >
              <ConvertStepThreeModal
                trigger={
                  <button type="button" className={actionTriggerClass}>
                    Confirm Conversion Fee
                  </button>
                }
                assetName={sourceAsset?.name ?? currency}
                paidAmount={activeConversionRequest.paid_amount ?? activeConversionRequest.amount}
                paymentWallet={user?.payment_wallet ?? null}
                requestId={activeConversionRequest.id}
                onCompleted={() => setStepTwoAmount("")}
              />
            </DropdownMenuItem>
          );
        }
      }

      const showInsufficient = numericAmount <= 0;
      return (
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="p-0"
        >
          {showInsufficient ? (
            <button
              type="button"
              className={actionTriggerClass}
              onClick={() =>
                showInsufficientBalance()
              }
            >
              Convert
            </button>
          ) : (
            <ConvertAssetModal
              asset={{
                id: walletId,
                user_wallet_id: userWalletId ?? walletId,
                name: currency,
                symbol: option,
                balance: numericAmount,
                amount: numericAmount,
              }}
              trigger={
                <button type="button" className={actionTriggerClass}>
                  Convert
                </button>
              }
            />
          )}
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem
        onSelect={(event) => event.preventDefault()}
        className="p-0"
      >
        {requiresConversionBeforeWithdraw ? (
          <button
            type="button"
            className={actionTriggerClass}
            onClick={() =>
              Swal.fire({
                title: "Convert assets to FIAT",
                text: "Please convert all your asset before withdrawal",
                icon: "error",
                confirmButtonText: "Understood",
                confirmButtonColor: "#d33",
                customClass: {
                  popup: "swal-red-border",
                },
              })
            }
          >
            Withdraw
          </button>
        ) : numericAmount <= 0 || !fiatWallet ? (
          <button
            type="button"
            className={actionTriggerClass}
            onClick={() =>
              showInsufficientBalance()
            }
          >
            Withdraw
          </button>
        ) : (
          <Withdraw
            wallet={fiatWallet}
            trigger={
              <button type="button" className={actionTriggerClass}>
                Withdraw
              </button>
            }
          />
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <div
      className={`card p-3 flex flex-col justify-between min-h-[100px] ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            width={20}
            height={20}
            src={img}
            alt={currency}
            className="rounded-full w-5 h-5 object-cover"
          />
          <span className="text-gray-700 dark:text-white font-medium text-sm">
            {currency}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeConversionRequest && (
            <OngoingConversionModal
              trigger={
                <button
                  type="button"
                  className={`cursor-pointer relative inline-flex items-center justify-center rounded-full p-2 transition hover:scale-105 ${
                    isProcessingState
                      ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 ring-1 ring-amber-200 dark:from-amber-500/10 dark:to-amber-400/10"
                  }`}
                  title={isProcessingState ? "Conversion processing" : "View ongoing conversion"}
                >
                  {isProcessingState ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUpDown className="size-4 animate-pulse" />
                  )}
                  {!isProcessingState && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex size-2 animate-ping rounded-full bg-emerald-400" />
                  )}
                  <span className="sr-only">View ongoing conversion</span>
                </button>
              }
              request={activeConversionRequest}
              sourceAsset={sourceAsset ?? undefined}
              destinationWallet={destinationWallet}
              conversionPeriod={user?.conversion_period ?? null}
              paymentWallet={user?.payment_wallet ?? null}
            />
          )}
          {resolvedAction === "withdraw" && matchingWithdrawalRequest && (
            <>
              <DropdownMenu open={isWithdrawalMenuOpen} onOpenChange={setIsWithdrawalMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`cursor-pointer relative inline-flex items-center justify-center rounded-full p-2 transition hover:scale-105 ${
                      isWithdrawalProcessing
                        ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-200"
                        : "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 ring-1 ring-indigo-200 dark:from-indigo-500/10 dark:to-indigo-400/10"
                    }`}
                    title={withdrawalButtonTitle}
                  >
                    {isWithdrawalProcessing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUpDown className="size-4 animate-pulse" />
                    )}
                    {!isWithdrawalProcessing && (
                      <span 
                        className={`absolute -top-0.5 -right-0.5 inline-flex size-2 rounded-full ${
                          isWithdrawalCompleted 
                            ? "bg-emerald-500" 
                            : isWithdrawalPending 
                            ? "animate-ping bg-indigo-400" 
                            : "bg-indigo-400"
                        }`}
                      />
                    )}
                    <span className="sr-only">Ongoing withdrawal actions</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-2 space-y-1">
                  {!isWithdrawalCompleted && (
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        handleWithdrawalContinue();
                      }}
                      className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Continue withdrawal
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleWithdrawalCancel();
                    }}
                    disabled={isCancellingWithdrawal}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  >
                    {isCancellingWithdrawal ? "Cancelling..." : "Cancel withdrawal"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Continue withdrawal modal based on stage */}
              {matchingWithdrawalRequest?.stage === "fund_transfer_pin" && (
                <FundTransferPinModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
              {matchingWithdrawalRequest?.stage === "tax_clearance" && (
                <TaxClearanceModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
              {matchingWithdrawalRequest?.stage === "etf_code" && (
                <EtfCodeModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
              {matchingWithdrawalRequest?.stage === "entity_pin" && (
                <EntityPinModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
              {matchingWithdrawalRequest?.stage === "fscs_code" && (
                <FscsCodeModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
              {matchingWithdrawalRequest?.stage === "regulation_code" && (
                <RegulationCodeModal
                  open={isWithdrawalModalOpen}
                  onOpenChange={setIsWithdrawalModalOpen}
                  request={matchingWithdrawalRequest}
                  isLoading={isUpdatingStage}
                  onSubmit={handleStageSubmit}
                  onCancel={() => setIsWithdrawalModalOpen(false)}
                />
              )}
            </>
          )}
          {shouldShowActionMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:ring-0 focus:border-0 focus:outline-none cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <MdMoreVert size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>{renderAction()}</DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <div
          className={`text-lg font-bold mb-0.5 transition-colors ${
            amountTrend === "up"
              ? "text-emerald-500"
              : amountTrend === "down"
              ? "text-red-500"
              : "text-gray-800 dark:text-white"
          }`}
        >
          {resolvedAction === "convert"
            ? formatUserCurrency(numericAmount, user).displayValue
            : `${option} ${formatCurrencyBalance(numericAmount)}`}
        </div>
        {showPercentage && typeof percentageChange === "number" && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              percentageChange >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {percentageChange >= 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{Math.abs(percentageChange).toFixed(2)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
