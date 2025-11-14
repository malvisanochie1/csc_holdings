"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost } from "@/lib/api/http";
import type { ConversionRequestResponse } from "@/lib/types/api";
import { refetchCurrentUser } from "@/lib/api/auth";
import { queryKeys } from "@/lib/queryKeys";

export interface SubmitConversionPayload {
  from_wallet_id: string;
  to_wallet_id: string;
}

export function submitConversionRequest(payload: SubmitConversionPayload) {
  return apiPost<ConversionRequestResponse, SubmitConversionPayload>(
    "/conversion-requests",
    payload
  );
}

export type UpdateConversionRequestPayload = {
  amount?: string;
  confirmed_payment?: boolean;
  [key: string]: unknown;
};

export function updateConversionRequest(
  requestId: string,
  payload: UpdateConversionRequestPayload
) {
  return apiPost<ConversionRequestResponse, UpdateConversionRequestPayload>(
    `/conversion-requests/update/${requestId}`,
    payload
  );
}

export function cancelConversionRequest(requestId: string) {
  return apiPost<ConversionRequestResponse>(`/conversion-requests/cancel/${requestId}`);
}

export function useSubmitConversionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitConversionRequest,
    onSuccess: async (response) => {
      await refetchCurrentUser();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      return response;
    },
  });
}

export function useUpdateConversionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateConversionRequestPayload;
    }) => updateConversionRequest(id, payload),
    onSuccess: async (response) => {
      await refetchCurrentUser();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      return response;
    },
  });
}

export function useCancelConversionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelConversionRequest,
    onSuccess: async (response) => {
      await refetchCurrentUser();
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      return response;
    },
  });
}
