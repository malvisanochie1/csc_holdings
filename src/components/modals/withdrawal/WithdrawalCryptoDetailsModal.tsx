import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { withdrawalCryptoOptions } from "@/components/text/withdrawal";
import type { CurrencyAsset, SubmitWithdrawalPayload, WithdrawalRequest } from "@/lib/types/api";
import { WithdrawalFormData, WithdrawalStage } from "@/lib/types/withdrawal";
import { useToast } from "@/components/providers/toast-provider";
import { useSubmitWithdrawalRequest } from "@/lib/api/withdrawal";

interface WithdrawalCryptoDetailsModalProps {
  wallet?: CurrencyAsset;
  availableBalanceLabel: string;
  formData: WithdrawalFormData;
  onUpdateFormData: (data: Partial<WithdrawalFormData>) => void;
  onBack: () => void;
  onNext: (stage: WithdrawalStage) => void;
  onUpdateWithdrawalRequest: (request: WithdrawalRequest) => void;
}

const WithdrawalCryptoDetailsModal: React.FC<WithdrawalCryptoDetailsModalProps> = ({
  wallet,
  availableBalanceLabel,
  formData,
  onUpdateFormData,
  onBack,
  onNext,
  onUpdateWithdrawalRequest,
}) => {
  const [selectedCryptoId, setSelectedCryptoId] = React.useState(
    withdrawalCryptoOptions[0]?.id ?? "bitcoin"
  );
  const [walletAddress, setWalletAddress] = React.useState(formData.walletAddress || "");
  const [walletAddressError, setWalletAddressError] = React.useState<string | null>(null);

  const { showToast } = useToast();
  const { mutateAsync: submitWithdrawal, isPending } = useSubmitWithdrawalRequest();

  const selectedCrypto = React.useMemo(
    () => withdrawalCryptoOptions.find((option) => option.id === selectedCryptoId) ?? withdrawalCryptoOptions[0],
    [selectedCryptoId]
  );

  const handleSubmit = async () => {
    if (!walletAddress.trim()) {
      setWalletAddressError("Wallet address is required");
      return;
    }

    if (!wallet?.id) {
      showToast({ type: "error", title: "Wallet information missing" });
      return;
    }

    const amountValue = parseFloat(availableBalanceLabel.replace(/,/g, '')); // Assuming availableBalanceLabel is a string like "1,234.56"

    if (isNaN(amountValue) || amountValue <= 0) {
      showToast({ type: "error", title: "Enter a valid amount" });
      return;
    }

    try {
      const payload: SubmitWithdrawalPayload = {
        amount: amountValue,
        method: "crypto",
        wallet_id: wallet.id,
        currency_id: wallet.id,
        currency_name: wallet.name,
        network: selectedCrypto?.network,
        wallet_address: walletAddress.trim(),
        crypto_type: selectedCrypto?.label,
      };
      const response = await submitWithdrawal(payload);
      const successMessage = response?.message ?? "Withdrawal request submitted";
      showToast({ type: "success", title: successMessage });
      onUpdateFormData({ walletAddress: walletAddress.trim(), network: selectedCrypto?.network });
      if (response?.data?.withdrawal_request) {
        onUpdateWithdrawalRequest(response.data.withdrawal_request);
        onNext(WithdrawalStage.PinEntry);
      } else {
        showToast({ type: "error", title: "Withdrawal request not returned from API" });
      }
    } catch (error) {
      const apiError = error as Error & { error?: string; errors?: Record<string, string[]>; withdrawal_request?: WithdrawalRequest };
      const description =
        apiError?.error && apiError.error !== apiError.message
          ? apiError.error
          : undefined;

      if (apiError.errors?.wallet_address) {
        setWalletAddressError(apiError.errors.wallet_address[0]);
      } else {
        showToast({
          type: "error",
          title: apiError?.message || "Unable to submit withdrawal",
          description,
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {withdrawalCryptoOptions.map((option) => {
          const isActive = selectedCryptoId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={cn(
                "cursor-pointer rounded-2xl border px-4 py-3 text-left transition focus:outline-none",
                isActive
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-400/10"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-white/10 dark:bg-gray-900"
              )}
              onClick={() => setSelectedCryptoId(option.id)}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={option.icon}
                  alt={option.label}
                  width={32}
                  height={32}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {option.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <Field>
        <FieldLabel>Transaction amount</FieldLabel>
        <Input
          value={`${wallet?.symbol ?? "$"} ${availableBalanceLabel}`}
          readOnly
          disabled
          className="h-12 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Balance: {availableBalanceLabel} {wallet?.symbol ?? "USD"}
        </p>
      </Field>
      <Field>
        <FieldLabel>Wallet address</FieldLabel>
        <Input
          value={walletAddress}
          onChange={(event) => {
            setWalletAddress(event.target.value);
            if (walletAddressError) {
              setWalletAddressError(null);
            }
          }}
          placeholder="Enter BTC/crypto wallet address"
          className="h-12 rounded-xl"
        />
        {walletAddressError && <FieldError>{walletAddressError}</FieldError>}
      </Field>

      <div className="flex justify-between gap-3">
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
          {isPending ? "Processing..." : "Submit withdrawal"}
        </Button>
      </div>
    </div>
  );
};

export default WithdrawalCryptoDetailsModal;
