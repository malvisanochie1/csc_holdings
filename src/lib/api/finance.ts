"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import type {
  DepositItem,
  SubmitDepositPayload,
  SubmitWithdrawalPayload,
  WalletTransactionsResponse,
  WithdrawalItem,
} from "@/lib/types/api";
import { queryKeys } from "@/lib/queryKeys";

// Raw API
export function getDeposits() {
  return apiGet<{ data: DepositItem[] }>("/deposits");
}

export function submitDeposit(payload: SubmitDepositPayload) {
  return apiPost<unknown, SubmitDepositPayload>("/deposit", payload);
}

export function getWithdrawals() {
  return apiGet<{ data: WithdrawalItem[] }>("/withdrawals");
}

export function submitWithdrawal(payload: SubmitWithdrawalPayload) {
  return apiPost<unknown, SubmitWithdrawalPayload>("/withdraw", payload);
}

export function getWalletTransactions() {
  return apiGet<WalletTransactionsResponse>("/wallet-transactions");
}

// Hooks
export function useDeposits() {
  return useQuery({
    queryKey: queryKeys.deposits,
    queryFn: async () => (await getDeposits()).data.data,
  });
}

export function useWithdrawals() {
  return useQuery({
    queryKey: queryKeys.withdrawals,
    queryFn: async () => (await getWithdrawals()).data.data,
  });
}

export function useWalletTransactions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.walletTransactions,
    queryFn: async () => (await getWalletTransactions()).data,
    enabled: options?.enabled ?? true,
  });
}

export function useSubmitDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitDeposit,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.deposits });
    },
  });
}

export function useSubmitWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitWithdrawal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.withdrawals });
    },
  });
}
