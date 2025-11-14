"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserResource } from "@/lib/types/api";

type AuthState = {
  user: UserResource | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setAuth: (user: UserResource, token: string) => void;
  setUser: (user: UserResource | null) => void;
  setToken: (token: string | null) => void;
  clear: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: Boolean(token) }),
      setUser: (user) =>
        set((state) => ({ user, isAuthenticated: Boolean(state.token) })),
      setToken: (token) =>
        set({ token, isAuthenticated: Boolean(token) }),
      clear: () => set({ user: null, token: null, isAuthenticated: false }),
      setHasHydrated: (hasHydrated) =>
        set({ _hasHydrated: hasHydrated }),
    }),
    {
      name: "auth", // localStorage key
      version: 1,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
