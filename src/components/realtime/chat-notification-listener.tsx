"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/store/auth";
import { getChatUnreadCount } from "@/lib/api/chat";
import { useNotificationSound } from "@/hooks/use-notification-sound";
import { usePusher } from "@/hooks/usePusher";
import type { ChatMessage } from "@/hooks/useChat";

const CHAT_ROUTE = "/livechat";
const CHAT_POLL_INTERVAL = 60000;

export function ChatNotificationListener() {
  const { user, token, _hasHydrated } = useAuthStore();
  const {
    connectionStatus,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
  } = usePusher();
  const { playSound } = useNotificationSound();
  const router = useRouter();
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const isOnChatPage = pathname?.startsWith(CHAT_ROUTE);
  const userId = user?.id;

  const fetchUnreadCount = useCallback(async () => {
    if (!token) {
      setUnreadCount(0);
      return 0;
    }
    try {
      const data = await getChatUnreadCount();
      const nextCount = Number(data?.unread_count ?? 0);
      setUnreadCount(nextCount);
      setLastRefreshed(Date.now());
      return nextCount;
    } catch {
      return 0;
    }
  }, [token]);

  const startPolling = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(() => {
      if (!isOnChatPage) {
        fetchUnreadCount().catch(() => {
          /* handled internally */
        });
      }
    }, CHAT_POLL_INTERVAL);
  }, [fetchUnreadCount, isOnChatPage]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!_hasHydrated || !token) {
      setUnreadCount(0);
      stopPolling();
      return;
    }
    fetchUnreadCount().catch(() => {
      /* handled internally */
    });
  }, [_hasHydrated, token, fetchUnreadCount, stopPolling]);

  useEffect(() => {
    if (!token) {
      stopPolling();
      return;
    }
    if (connectionStatus === "connected") {
      stopPolling();
      fetchUnreadCount().catch(() => {
        /* handled internally */
      });
    } else {
      startPolling();
    }
  }, [connectionStatus, token, startPolling, stopPolling, fetchUnreadCount]);

  useEffect(() => {
    if (!userId || connectionStatus !== "connected") return;

    interface MessageSentEvent {
      message?: ChatMessage;
    }

    const channelName = `chat.customer.${userId}`;
    subscribeToPrivateChannel<MessageSentEvent>(channelName, {
      ".message.sent": (event) => {
        const incoming = event?.message;
        if (!incoming) return;
        if (incoming.sender_id === userId) return;
        if (isOnChatPage) return;
        playSound();
        fetchUnreadCount().catch(() => {
          /* handled internally */
        });
      },
    });

    return () => {
      unsubscribeFromChannel(channelName);
    };
  }, [
    userId,
    connectionStatus,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    isOnChatPage,
    playSound,
    fetchUnreadCount,
  ]);

  useEffect(() => {
    if (isOnChatPage) {
      setUnreadCount(0);
    }
  }, [isOnChatPage]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleNavigateToChat = useCallback(() => {
    router.push(CHAT_ROUTE);
    setUnreadCount(0);
  }, [router]);

  const shouldShowAlert =
    Boolean(token) && !isOnChatPage && unreadCount > 0 && _hasHydrated;

  const subtitle = useMemo(() => {
    if (!lastRefreshed) return "Concierge typically responds in 2 minutes.";
    const minutes = Math.max(
      1,
      Math.round((Date.now() - lastRefreshed) / 60000)
    );
    return `Updated ${minutes} min ago • Tap to open live chat`;
  }, [lastRefreshed]);

  if (!shouldShowAlert) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-[55] flex justify-center px-4 sm:bottom-10 sm:justify-end sm:px-6">
      <button
        type="button"
        className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-3xl border border-indigo-100 bg-white/95 p-4 text-left shadow-[0_20px_60px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_75px_rgba(15,23,42,0.35)]"
        onClick={handleNavigateToChat}
      >
        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 min-w-[22px] rounded-full bg-rose-500 px-1.5 text-center text-xs font-semibold text-white">
            {unreadCount}
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Concierge replied
          </p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
          Live
        </div>
      </button>
    </div>
  );
}
