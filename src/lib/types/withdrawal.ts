import { WithdrawalRequest } from "./api";

export enum WithdrawalStage {
  MethodSelection = "METHOD_SELECTION",
  CryptoDetails = "CRYPTO_DETAILS",
  BankDetails = "BANK_DETAILS",
  PinEntry = "PIN_ENTRY",
  Status = "STATUS",
}

export interface WithdrawalFormData {
  method?: "crypto" | "bank";
  walletAddress?: string;
  network?: string; // For crypto
  accountName?: string; // For bank
  accountNumber?: string; // For bank
  iban?: string; // For bank
  bankName?: string; // For bank
  swift?: string; // For bank
  notes?: string; // For bank
  // Add other fields as needed
}

export interface WithdrawalFlowState {
  currentStage: WithdrawalStage;
  formData: WithdrawalFormData;
  withdrawalRequest?: WithdrawalRequest;
  withdrawalStatus?: "success" | "failed" | "pending";
  withdrawalMessage?: string;
  // Add any other state needed for the flow, e.g., error messages, loading states
}
