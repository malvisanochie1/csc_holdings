"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import type {
  AuthPayloadLogin,
  AuthPayloadRegister,
  AuthResponseData,
  UpdateProfilePayload,
  UserResource,
} from "@/lib/types/api";
import { useAuthStore } from "@/lib/store/auth";
import { queryKeys } from "@/lib/queryKeys";

// Raw API functions
export function register(payload: AuthPayloadRegister) {
  return apiPost<AuthResponseData, AuthPayloadRegister>("/auth/register", payload);
}

export function login(payload: AuthPayloadLogin) {
  return apiPost<AuthResponseData, AuthPayloadLogin>("/auth/login", payload);
}

export function autoLogin(token: string) {
  return apiPost<AuthResponseData, { token: string }>("/auth/auto-login", { token });
}

export function getCurrentUser() {
  return apiGet<UserResource>("/user");
}

export function updateProfile(payload: UpdateProfilePayload) {
  return apiPost<UserResource, UpdateProfilePayload>("/update", payload);
}

export function logout() {
  return apiPost<unknown>("/auth/logout");
}

export async function refetchCurrentUser() {
  const response = await getCurrentUser();
  useAuthStore.getState().setUser(response.data);
  return response.data;
}

// React Query hooks
export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
    },
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
    },
  });
}

export function useAutoLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: autoLogin,
    onSuccess: (res) => {
      setAuth(res.data.user, res.data.token);
    },
  });
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: refetchCurrentUser,
    enabled: options?.enabled ?? true,
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      setUser(user.data);
      qc.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clear();
      qc.clear();
    },
  });
}
