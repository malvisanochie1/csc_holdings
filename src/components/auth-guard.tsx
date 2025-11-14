"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait for Zustand to hydrate before making auth decisions
    if (!_hasHydrated) return;

    if (requireAuth && !token) {
      // Redirect to login if auth is required but user is not authenticated
      router.push("/login");
    } else if (!requireAuth && token) {
      // Redirect to dashboard if auth is not required but user is authenticated
      router.push("/dashboard");
    }
  }, [token, _hasHydrated, requireAuth, router]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If auth is required but no token, don't render children (redirect will handle)
  if (requireAuth && !token) {
    return null;
  }

  // If auth is not required but user is authenticated, don't render children (redirect will handle)
  if (!requireAuth && token) {
    return null;
  }

  return <>{children}</>;
}