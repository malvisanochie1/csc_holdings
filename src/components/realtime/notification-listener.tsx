"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BellRing, Info, Loader2, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/store/auth";
import { refetchCurrentUser } from "@/lib/api/auth";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { usePusher } from "@/hooks/usePusher";
import { markNotificationAsRead } from "@/lib/api/notifications";
import { queryKeys } from "@/lib/queryKeys";
import type { UserNotification } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const FAST_POLLING_INTERVAL = 5000;
const FALLBACK_POLLING_INTERVAL = 30000;

type Variant = "info" | "success" | "warning" | "danger";

const VARIANT_STYLES: Record<
  Variant,
  { accent: string; badge: string; text: string }
> = {
  info: {
    accent: "bg-slate-50 text-slate-600",
    badge: "bg-slate-200 text-slate-700",
    text: "text-slate-600",
  },
  success: {
    accent: "bg-emerald-50 text-emerald-600",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-700",
  },
  warning: {
    accent: "bg-amber-50 text-amber-600",
    badge: "bg-amber-500 text-white",
    text: "text-amber-700",
  },
  danger: {
    accent: "bg-rose-50 text-rose-600",
    badge: "bg-rose-500 text-white",
    text: "text-rose-700",
  },
};

function resolveVariant(notification?: UserNotification | null): Variant {
  const tone =
    notification?.status ||
    (typeof notification?.type === "string" ? notification.type : "");
  const normalized = tone?.toLowerCase();

  if (!normalized) return "info";
  if (["success", "completed", "complete"].includes(normalized)) return "success";
  if (["warning", "pending", "attention"].includes(normalized)) return "warning";
  if (["danger", "error", "failed", "critical"].includes(normalized)) {
    return "danger";
  }
  return "info";
}

function isUnread(notification: UserNotification) {
  const readFlag = (notification as { read?: boolean }).read;
  return !notification.read_at && readFlag !== true;
}

export function NotificationListener() {
  const { user, token, _hasHydrated } = useAuthStore();
  const {
    connectionStatus,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
  } = usePusher();
  const queryClient = useQueryClient();
  const { playSound } = useNotificationSound();

  const [activeNotification, setActiveNotification] =
    useState<UserNotification | null>(null);
  const [isMarking, setIsMarking] = useState(false);

  const channelsRef = useRef(new Set<string>());
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);

  const userId = user?.id;

  const refreshUser = useCallback(async () => {
    if (!token) return null;
    const nextUser = await refetchCurrentUser();
    queryClient.setQueryData(queryKeys.currentUser, nextUser);
    return nextUser;
  }, [queryClient, token]);

  const handleNotificationEvent = useCallback(() => {
    playSound();
    refreshUser().catch(() => {
      /* fallback polling handles retry */
    });
  }, [playSound, refreshUser]);

  const handleUserUpdate = useCallback(() => {
    refreshUser().catch(() => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          handleUserUpdate();
        }
      }, FAST_POLLING_INTERVAL);
    });
  }, [refreshUser]);

  const pollForUpdates = useCallback(async () => {
    if (isPollingRef.current || connectionStatus === "connected") return;
    isPollingRef.current = true;
    try {
      await refreshUser();
    } finally {
      isPollingRef.current = false;
    }
  }, [connectionStatus, refreshUser]);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return;
    pollForUpdates().catch(() => {
      /* handled downstream */
    });
    pollIntervalRef.current = setInterval(() => {
      pollForUpdates().catch(() => {
        /* handled downstream */
      });
    }, FALLBACK_POLLING_INTERVAL);
  }, [pollForUpdates]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [stopPolling]);

  useEffect(() => {
    if (!_hasHydrated || !userId || connectionStatus !== "connected") return;

    const channels = channelsRef.current;
    const notificationChannel = `notification.${userId}`;
    const userChannel = `user.${userId}`;

    if (!channels.has(notificationChannel)) {
      subscribeToPrivateChannel(notificationChannel, {
        ".notification.message": handleNotificationEvent,
      });
      channels.add(notificationChannel);
    }

    if (!channels.has(userChannel)) {
      subscribeToPrivateChannel(userChannel, {
        ".user.updated": handleUserUpdate,
      });
      channels.add(userChannel);
    }

    return () => {
      [notificationChannel, userChannel].forEach((channel) => {
        if (channels.has(channel)) {
          channels.delete(channel);
          unsubscribeFromChannel(channel);
        }
      });
    };
  }, [
    _hasHydrated,
    userId,
    connectionStatus,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    handleNotificationEvent,
    handleUserUpdate,
  ]);

  useEffect(() => {
    if (!token || connectionStatus === "connected") {
      stopPolling();
      return;
    }
    startPolling();
    return () => {
      stopPolling();
    };
  }, [token, connectionStatus, startPolling, stopPolling]);

  const firstUnread = useMemo(() => {
    if (!user?.notifications || user.notifications.length === 0) return null;
    return user.notifications.find(isUnread) ?? null;
  }, [user?.notifications]);

  useEffect(() => {
    setActiveNotification(firstUnread);
  }, [firstUnread]);

  useEffect(() => {
    if (!token) {
      setActiveNotification(null);
    }
  }, [token]);

  const handleMarkAsRead = useCallback(async () => {
    if (!activeNotification) return;

    setIsMarking(true);
    try {
      await markNotificationAsRead(activeNotification.id);
    } catch {
      // keep UI responsive even if API fails; refetch below
    } finally {
      setIsMarking(false);
      refreshUser().catch(() => {
        setActiveNotification(null);
      });
    }
  }, [activeNotification, refreshUser]);

  if (!_hasHydrated || !token || !activeNotification) {
    return null;
  }

  const variant = VARIANT_STYLES[resolveVariant(activeNotification)];
  const dataPayload =
    activeNotification.data && typeof activeNotification.data === "object"
      ? (activeNotification.data as Record<string, unknown>)
      : null;
  const nestedTitle =
    dataPayload && typeof dataPayload["title"] === "string"
      ? (dataPayload["title"] as string)
      : undefined;
  const nestedMessage =
    dataPayload && typeof dataPayload["message"] === "string"
      ? (dataPayload["message"] as string)
      : undefined;

  const title = activeNotification.title || nestedTitle || "Account Update";
  const message =
    activeNotification.message || nestedMessage || "You have a new notification.";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex justify-center px-4 sm:bottom-24 sm:justify-end sm:px-6">
      <div className="pointer-events-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.2)] backdrop-blur">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl",
              variant.accent
            )}
          >
            <BellRing className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {title}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  variant.badge
                )}
              >
                Live
              </span>
            </div>
            <p className={cn("mt-1 text-sm leading-snug", variant.text)}>
              {message}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-slate-400">
              <Info className="h-3.5 w-3.5" />
              <span>Stay on this page to keep receiving updates.</span>
            </p>
          </div>
          <button
            type="button"
            aria-label="Mark notification as read"
            onClick={handleMarkAsRead}
            disabled={isMarking}
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          >
            {isMarking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
