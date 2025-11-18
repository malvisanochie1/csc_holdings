import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { CurrencyAsset, SubmitWithdrawalPayload, WithdrawalRequest } from "@/lib/types/api";
import { WithdrawalFormData, WithdrawalStage } from "@/lib/types/withdrawal";
import { useToast } from "@/components/providers/toast-provider";
import { useSubmitWithdrawalRequest } from "@/lib/api/withdrawal";

interface WithdrawalBankDetailsModalProps {
  wallet?: CurrencyAsset;
  availableBalanceLabel: string;
  formData: WithdrawalFormData;
  onUpdateFormData: (data: Partial<WithdrawalFormData>) => void;
  onBack: () => void;
  onNext: (stage: WithdrawalStage) => void;
  onUpdateWithdrawalRequest: (request: WithdrawalRequest) => void;
}

const WithdrawalBankDetailsModal: React.FC<WithdrawalBankDetailsModalProps> = ({
  wallet,
  availableBalanceLabel,
  formData,
  onUpdateFormData,
  onBack,
  onNext,
  onUpdateWithdrawalRequest,
}) => {
  const [accountName, setAccountName] = React.useState(formData.accountName || "");
  const [accountNumber, setAccountNumber] = React.useState(formData.accountNumber || "");
  const [iban, setIban] = React.useState(formData.iban || "");
  const [bankName, setBankName] = React.useState(formData.bankName || "");
  const [swift, setSwift] = React.useState(formData.swift || "");
  const [notes, setNotes] = React.useState(formData.notes || "");

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});

  const { showToast } = useToast();
  const { mutateAsync: submitWithdrawal, isPending } = useSubmitWithdrawalRequest();

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    if (!accountName.trim()) newErrors.accountName = "Account holder name is required";
    if (!accountNumber.trim()) newErrors.accountNumber = "Account number is required";
    if (!bankName.trim()) newErrors.bankName = "Bank name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({ type: "error", title: "Please fill in all required bank details" });
      return;
    }

    if (!wallet?.id) {
      showToast({ type: "error", title: "Wallet information missing" });
      return;
    }

    const amountValue = parseFloat(availableBalanceLabel.replace(/,/g, ''));

    if (isNaN(amountValue) || amountValue <= 0) {
      showToast({ type: "error", title: "Enter a valid amount" });
      return;
    }

    try {
      const payload: SubmitWithdrawalPayload = {
        amount: amountValue,
        method: "bank",
        wallet_id: wallet.id,
        currency_id: wallet.id,
        currency_name: wallet.name,
        bank_account_name: accountName.trim(),
        bank_account_number: accountNumber.trim(),
        bank_iban: iban.trim(),
        bank_name: bankName.trim(),
        bank_swift_code: swift.trim(),
        bank_additional_info: notes.trim(),
      };

      const response = await submitWithdrawal(payload);
      const successMessage = response?.message ?? "Withdrawal request submitted";
      showToast({ type: "success", title: successMessage });
      onUpdateFormData({
        accountName,
        accountNumber,
        iban,
        bankName,
        swift,
        notes,
      });
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

      // Attempt to map API errors to form fields
      const newErrors: Record<string, string | null> = {};
      if (apiError.errors) {
        if (apiError.errors.bank_account_name) newErrors.accountName = apiError.errors.bank_account_name[0];
        if (apiError.errors.bank_account_number) newErrors.accountNumber = apiError.errors.bank_account_number[0];
        if (apiError.errors.bank_name) newErrors.bankName = apiError.errors.bank_name[0];
        // Add more mappings for other bank fields as needed
      }
      setErrors((prev) => ({ ...prev, ...newErrors }));

      if (Object.keys(newErrors).length === 0) {
        showToast({
          type: "error",
          title: apiError?.message || "Unable to submit withdrawal",
          description,
        });
      }
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
    setErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  return (
    <div className="space-y-6">
      <Field>
        <FieldLabel>Transaction amount</FieldLabel>
        <Input
          value={`${wallet?.symbol ?? "$"} ${availableBalanceLabel}`}
          readOnly
          disabled
          className="h-12 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Account holder name</FieldLabel>
          <Input
            value={accountName}
            onChange={handleInputChange(setAccountName, "accountName")}
            placeholder="Enter full name"
            className="rounded-xl"
          />
          {errors.accountName && <FieldError>{errors.accountName}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>Account number</FieldLabel>
          <Input
            value={accountNumber}
            onChange={handleInputChange(setAccountNumber, "accountNumber")}
            placeholder="Enter account number"
            className="rounded-xl"
          />
          {errors.accountNumber && <FieldError>{errors.accountNumber}</FieldError>}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>IBAN</FieldLabel>
          <Input
            value={iban}
            onChange={handleInputChange(setIban, "iban")}
            placeholder="International bank account number"
            className="rounded-xl"
          />
          {errors.iban && <FieldError>{errors.iban}</FieldError>}
        </Field>
        <Field>
          <FieldLabel>Bank name</FieldLabel>
          <Input
            value={bankName}
            onChange={handleInputChange(setBankName, "bankName")}
            placeholder="Enter bank name"
            className="rounded-xl"
          />
          {errors.bankName && <FieldError>{errors.bankName}</FieldError>}
        </Field>
      </div>
      <Field>
        <FieldLabel>Swift / BIC</FieldLabel>
        <Input
          value={swift}
          onChange={handleInputChange(setSwift, "swift")}
          placeholder="Enter swift code"
          className="rounded-xl"
        />
        {errors.swift && <FieldError>{errors.swift}</FieldError>}
      </Field>
      <Field>
        <FieldLabel>Notes (optional)</FieldLabel>
        <Input
          value={notes}
          onChange={handleInputChange(setNotes, "notes")}
          placeholder="Extra compliance instructions"
          className="rounded-xl"
        />
        {errors.notes && <FieldError>{errors.notes}</FieldError>}
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

export default WithdrawalBankDetailsModal;
