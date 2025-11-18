"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import type { SettingsData, UpdateSettingsPayload, ApiResponse, UserResource } from "@/lib/types/api";
import { queryKeys } from "@/lib/queryKeys";
import { useAuthStore } from "@/lib/store/auth";

export function getSettings() {
  return apiGet<SettingsData>("/settings");
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => (await getSettings()).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function updateSettings(payload: UpdateSettingsPayload) {
  return apiPost<ApiResponse<UserResource>>("/update", payload);
}

// Validate user data structure to prevent app crashes
function isValidUserData(data: unknown): data is UserResource {
  if (!data || typeof data !== "object" || data === null) return false;
  
  const userObj = data as Record<string, unknown>;
  
  // Check required fields
  const requiredFields = ["id", "first_name", "last_name", "email"];
  if (!requiredFields.every(field => userObj[field] && typeof userObj[field] === "string")) {
    return false;
  }
  
  // Validate arrays if they exist
  if (userObj.assets && !Array.isArray(userObj.assets)) return false;
  if (userObj.currencies && !Array.isArray(userObj.currencies)) return false;
  if (userObj.notifications && !Array.isArray(userObj.notifications)) return false;
  
  // Validate currency object if it exists
  if (userObj.currency && (typeof userObj.currency !== "object" || userObj.currency === null || !(userObj.currency as Record<string, unknown>).id)) {
    return false;
  }
  
  return true;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (response) => {
      // Validate and update user data if response contains valid user data
      if (response?.data && isValidUserData(response.data)) {
        setUser(response.data);
      }
      
      // Invalidate both settings and user data
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}
