"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import type { KycRecord } from "@/lib/types/api";
import { queryKeys } from "@/lib/queryKeys";

export function getKycRecords() {
  return apiGet<KycRecord[]>("/user/verification");
}

export function submitKycDocuments(formData: FormData) {
  return apiPost<KycRecord | KycRecord[]>("/update/kyc", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function useKycRecords() {
  return useQuery({
    queryKey: queryKeys.kyc,
    queryFn: async () => (await getKycRecords()).data,
    staleTime: 60 * 1000,
  });
}

export function useSubmitKycDocuments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitKycDocuments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kyc });
    },
  });
}
