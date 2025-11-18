"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import type {
  DepositItem,
  SubmitDepositPayload,
  SubmitWithdrawalPayload,
  Transaction,
  TransactionsResponse,
  WalletTransactionsResponse,
  WalletTransactionsViewResponse,
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

export function getWalletTransactionsView(walletId: string) {
  return apiGet<WalletTransactionsViewResponse>(`/wallet-transactions/${walletId}`);
}

export function getUserTransactions() {
  return apiGet<Transaction[]>("/user/transactions");
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

export function useWalletTransactionsView(
  walletId?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: queryKeys.walletTransactionsView(walletId ?? "unknown"),
    queryFn: async () => {
      if (!walletId) {
        throw new Error("walletId is required to fetch wallet transactions view");
      }
      return (await getWalletTransactionsView(walletId)).data;
    },
    enabled: Boolean(walletId) && (options?.enabled ?? true),
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

export function useUserTransactions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.userTransactions,
    queryFn: async () => {
      const response = await getUserTransactions();
      const normalizedData = Array.isArray(response?.data)
        ? (response.data as Transaction[])
        : [];
      return {
        status: response?.status ?? "success",
        message: response?.message ?? "",
        data: normalizedData,
      } satisfies TransactionsResponse;
    },
    enabled: options?.enabled ?? true,
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
