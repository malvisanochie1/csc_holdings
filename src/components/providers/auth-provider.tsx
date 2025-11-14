"use client";

import React from "react";
import { useAuthStore } from "@/lib/store/auth";
import { refetchCurrentUser } from "@/lib/api/auth";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { token, _hasHydrated } = useAuthStore();
  const lastFetchedTokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!_hasHydrated) return;

    if (!token) {
      lastFetchedTokenRef.current = null;
      return;
    }

    if (lastFetchedTokenRef.current === token) {
      return;
    }

    lastFetchedTokenRef.current = token;

    let isMounted = true;

    refetchCurrentUser().catch((error) => {
      if (!isMounted) return;
      console.error("AuthProvider: Failed to refetch current user", error);
      // allow retry on next render by clearing the cached token
      lastFetchedTokenRef.current = null;
    });

    return () => {
      isMounted = false;
    };
  }, [_hasHydrated, token]);

  return <>{children}</>;
}
