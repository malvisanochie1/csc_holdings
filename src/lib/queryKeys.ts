export const queryKeys = {
  currentUser: ["currentUser"] as const,
  settings: ["settings"] as const,
  deposits: ["deposits"] as const,
  withdrawals: ["withdrawals"] as const,
  notifications: ["notifications"] as const,
  walletTransactions: ["walletTransactions"] as const,
  walletTransactionsView: (walletId: string) =>
    ["walletTransactions", walletId] as const,
  userTransactions: ["userTransactions"] as const,
  kyc: ["kycVerification"] as const,
};
