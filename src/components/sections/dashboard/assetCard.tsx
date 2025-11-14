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
import { ArrowUpDown, Loader2 } from "lucide-react";
import ConvertAssetModal from "@/components/modals/convert/convertAssetModal";
import ConvertStepTwoModal from "@/components/modals/convert/convertStepTwoModal";
import ConvertStepThreeModal from "@/components/modals/convert/convertStepThreeModal";
import OngoingConversionModal from "@/components/modals/convert/ongoingConversionModal";
import WithdrawalStageModal from "@/components/modals/withdrawal/withdrawalStageModal";
import { Withdraw } from "@/components/sections/withdraw/withdraw";
import { useCancelWithdrawalRequest } from "@/lib/api/withdrawal";
import { useToast } from "@/components/providers/toast-provider";
import Swal from "sweetalert2";
import { useAuthStore } from "@/lib/store/auth";
import {
  findUserAssetByWalletId,
  findUserCurrencyById,
  formatConversionRateRange,
} from "@/lib/wallets";
import { useInsufficientBalanceAlert } from "@/components/modals/withdrawal/insufficientBalance";

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
  percentageChange = 0,
  showPercentage = true,
  actionType,
  walletId,
  userWalletId,
}: AssetCardProps) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const isNegative = percentageChange < 0;
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
  const resolvedAction =
    actionType ?? (option?.toLowerCase() === "convert" ? "convert" : "withdraw");

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
  const withdrawalButtonTitle = isWithdrawalProcessing
    ? "Withdrawal processing"
    : "Continue withdrawal";
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = React.useState(false);
  const [isWithdrawalMenuOpen, setIsWithdrawalMenuOpen] = React.useState(false);
  const {
    mutateAsync: cancelWithdrawal,
    isPending: isCancellingWithdrawal,
  } = useCancelWithdrawalRequest();

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
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently cancel the withdrawal. You will need to start a new withdrawal request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel withdrawal!",
      cancelButtonText: "No, keep it",
      reverseButtons: true,
      customClass: {
        popup: "swal-red-border",
      },
    });
    if (!confirm.isConfirmed) {
      setIsWithdrawalMenuOpen(false);
      return;
    }
    try {
      const response = await cancelWithdrawal(matchingWithdrawalRequest.id);
      const successMessage = response?.message ?? "Withdrawal cancelled";
      showToast({ type: "success", title: successMessage });
      setIsWithdrawalMenuOpen(false);
    } catch (error) {
      const apiError = error as Error & { error?: string };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;
      showToast({
        type: "error",
        title: apiError?.message || "Unable to cancel withdrawal",
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
          activeConversionRequest.amount
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
                showInsufficientBalance({
                  description: "Wait for incoming reclaims to begin conversion.",
                })
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
        {numericAmount <= 0 || !fiatWallet ? (
          <button
            type="button"
            className={actionTriggerClass}
            onClick={() =>
              showInsufficientBalance({
                description: "Fund this wallet to enable withdrawals.",
              })
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
                      <span className="absolute -top-0.5 -right-0.5 inline-flex size-2 animate-ping rounded-full bg-indigo-400" />
                    )}
                    <span className="sr-only">Ongoing withdrawal actions</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52 p-2 space-y-1">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleWithdrawalContinue();
                    }}
                    className="cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Continue withdrawal
                  </DropdownMenuItem>
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
              <WithdrawalStageModal
                request={matchingWithdrawalRequest}
                open={isWithdrawalModalOpen}
                onOpenChange={setIsWithdrawalModalOpen}
                trigger={null}
              />
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
        <div className="text-gray-800 dark:text-white text-lg font-bold mb-0.5">
          ${numericAmount.toLocaleString()}
        </div>
        {showPercentage && percentageChange !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            <span>{isNegative ? '▼' : '▲'}</span>
            <span>{Math.abs(percentageChange)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
