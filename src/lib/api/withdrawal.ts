"use client";

import { type QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/http";
import { refetchCurrentUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/queryKeys";
import type {
  SubmitWithdrawalPayload,
  WithdrawalRequestResponse,
  WithdrawalUpdateResponse,
} from "@/lib/types/api";

export interface UpdateWithdrawalStagePayload {
  stage: string;
  code: string;
}

export function submitWithdrawalRequest(payload: SubmitWithdrawalPayload) {
  return apiPost<WithdrawalRequestResponse, SubmitWithdrawalPayload>(
    "/withdraw",
    payload
  );
}

export function updateWithdrawalStage(
  requestId: string,
  payload: UpdateWithdrawalStagePayload
) {
  return apiPost<WithdrawalUpdateResponse, UpdateWithdrawalStagePayload>(
    `/withdrawal/update/${requestId}`,
    payload
  );
}

export function cancelWithdrawalRequest(requestId: string) {
  return apiPost<WithdrawalRequestResponse>(`/withdrawal/cancel/${requestId}`);
}

async function refreshUserWithQueryInvalidate(queryClient: QueryClient) {
  await refetchCurrentUser();
  queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
}

export function useSubmitWithdrawalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitWithdrawalRequest,
    onSuccess: async () => {
      await refreshUserWithQueryInvalidate(queryClient);
    },
  });
}

export function useUpdateWithdrawalStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWithdrawalStagePayload }) =>
      updateWithdrawalStage(id, payload),
    onSuccess: async () => {
      await refreshUserWithQueryInvalidate(queryClient);
    },
  });
}

export function useCancelWithdrawalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelWithdrawalRequest,
    onSuccess: async () => {
      await refreshUserWithQueryInvalidate(queryClient);
    },
  });
}
