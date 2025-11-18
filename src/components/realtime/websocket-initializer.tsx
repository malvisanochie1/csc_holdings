"use client";

import { useEffect, useRef } from "react";

import { NotificationListener } from "@/components/realtime/notification-listener";
import { ChatNotificationListener } from "@/components/realtime/chat-notification-listener";
import { useAuthStore } from "@/lib/store/auth";
import { usePusher } from "@/hooks/usePusher";
import type { ConnectionStatus } from "@/services/pusher-service";
import { useToast } from "@/components/providers/toast-provider";

export function WebSocketInitializer() {
  const { token, isAuthenticated, _hasHydrated } = useAuthStore();
  const { connectionStatus, error } = usePusher();
  const { showToast } = useToast();
  const previousStatus = useRef<ConnectionStatus | null>(null);

  useEffect(() => {
    if (!_hasHydrated || !isAuthenticated || !token) {
      previousStatus.current = null;
      return;
    }

    const prev = previousStatus.current;
    if (prev === connectionStatus) return;

    if (prev) {
      if (connectionStatus === "connecting") {
        showToast({
          title: "Reconnecting…",
          description: "Attempting to restore realtime updates.",
          type: "info",
        });
      } else if (connectionStatus === "disconnected" || connectionStatus === "failed") {
        showToast({
          title: "Realtime connection lost",
          description: "We'll keep polling for updates until we're back online.",
          type: "error",
        });
      }
    }

    previousStatus.current = connectionStatus;
  }, [
    connectionStatus,
    isAuthenticated,
    token,
    _hasHydrated,
    showToast,
  ]);

  useEffect(() => {
    if (!error || !_hasHydrated || !isAuthenticated || !token) return;
    showToast({
      title: "Realtime connection issue",
      description: error,
      type: "error",
    });
  }, [error, isAuthenticated, token, _hasHydrated, showToast]);

  if (!_hasHydrated || !isAuthenticated || !token) {
    return null;
  }

  return (
    <>
      <NotificationListener />
      <ChatNotificationListener />
    </>
  );
}
