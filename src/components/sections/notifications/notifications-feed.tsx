"use client";

import React from "react";
import { Bell, CheckCircle2, Loader2, MailOpen, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMarkNotificationAsRead,
  useNotifications,
} from "@/lib/api/notifications";
import type { NotificationFeedItem } from "@/lib/types/api";

type FilterKey = "all" | "unread" | "read";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
];

const COLOR_STYLES: Record<
  string,
  { badge: string; icon: string; ring: string; accent: string }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-700",
    icon: "bg-blue-100 text-blue-600",
    ring: "ring-blue-100",
    accent: "text-blue-600",
  },
  orange: {
    badge: "bg-orange-50 text-orange-700",
    icon: "bg-orange-100 text-orange-600",
    ring: "ring-orange-100",
    accent: "text-orange-600",
  },
  green: {
    badge: "bg-emerald-50 text-emerald-700",
    icon: "bg-emerald-100 text-emerald-600",
    ring: "ring-emerald-100",
    accent: "text-emerald-600",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700",
    icon: "bg-rose-100 text-rose-600",
    ring: "ring-rose-100",
    accent: "text-rose-600",
  },
  purple: {
    badge: "bg-indigo-50 text-indigo-700",
    icon: "bg-indigo-100 text-indigo-600",
    ring: "ring-indigo-100",
    accent: "text-indigo-600",
  },
};

function getColorStyles(color?: string) {
  if (!color) {
    return COLOR_STYLES.blue;
  }
  return COLOR_STYLES[color.toLowerCase()] ?? COLOR_STYLES.blue;
}

function isNotificationRead(notification: NotificationFeedItem) {
  return Boolean(notification.read || notification.read_at);
}

function getTimestamp(notification: NotificationFeedItem) {
  const raw =
    notification.time ||
    notification.updated_at ||
    notification.read_at ||
    notification.created_at;
  const parsed = raw ? Date.parse(raw) : NaN;
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function formatGroupLabel(date: Date) {
  const today = new Date();
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate());
  const diffMs = startOfDay(today).getTime() - startOfDay(date).getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Tomorrow";
  if (diffDays === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

function formatRelative(date: Date, fallback?: string) {
  if (fallback) return fallback;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

type GroupedNotifications = {
  label: string;
  timestamp: number;
  items: NotificationFeedItem[];
};

export default function NotificationsFeed() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useNotifications();
  const notifications = React.useMemo<NotificationFeedItem[]>(
    () => (data ?? []) as NotificationFeedItem[],
    [data]
  );
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = React.useState(false);

  const markMutation = useMarkNotificationAsRead();

  const sortedNotifications = React.useMemo(() => {
    return [...notifications].sort(
      (a, b) => getTimestamp(b) - getTimestamp(a)
    );
  }, [notifications]);

  const filteredNotifications = React.useMemo(() => {
    return sortedNotifications.filter((notification) => {
      if (filter === "unread") return !isNotificationRead(notification);
      if (filter === "read") return isNotificationRead(notification);
      return true;
    });
  }, [filter, sortedNotifications]);

  const groupedNotifications = React.useMemo(() => {
    const groups = new Map<string, GroupedNotifications>();
    filteredNotifications.forEach((notification) => {
      const timestamp = getTimestamp(notification);
      const date = new Date(timestamp);
      const key = date.toISOString().slice(0, 10);
      if (!groups.has(key)) {
        groups.set(key, {
          label: formatGroupLabel(date),
          timestamp,
          items: [],
        });
      }
      groups.get(key)!.items.push(notification);
    });
    return Array.from(groups.values()).sort(
      (a, b) => b.timestamp - a.timestamp
    );
  }, [filteredNotifications]);

  const unreadCount = React.useMemo(
    () => notifications.filter((item) => !isNotificationRead(item)).length,
    [notifications]
  );

  const handleMarkAsRead = React.useCallback(
    async (notificationId: string | number) => {
      if (!notificationId) return;
      setActiveId(String(notificationId));
      try {
        await markMutation.mutateAsync(notificationId);
      } finally {
        setActiveId(null);
      }
    },
    [markMutation]
  );

  const handleMarkAll = React.useCallback(async () => {
    const unread = sortedNotifications.filter(
      (item) => !isNotificationRead(item)
    );
    if (unread.length === 0) return;
    setIsMarkingAll(true);
    try {
      for (const notification of unread) {
        await markMutation.mutateAsync(notification.id);
      }
    } finally {
      setIsMarkingAll(false);
    }
  }, [markMutation, sortedNotifications]);

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse w-2/3"></div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 rounded-2xl bg-slate-50 dark:bg-slate-800/60 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 flex flex-col gap-4">
        <div>
          <p className="text-base font-semibold text-rose-600">Heads up</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We couldn&apos;t load your notifications. Please refresh to try
            again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1">
            {FILTERS.map((button) => (
              <button
                key={button.key}
                type="button"
                onClick={() => setFilter(button.key)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                  filter === button.key
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow"
                    : "text-slate-500 dark:text-slate-400"
                )}
              >
                {button.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleMarkAll}
              disabled={isMarkingAll || unreadCount === 0}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMarkingAll ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MailOpen className="h-4 w-4" />
              )}
              Mark all read
            </button>
          </div>
        </div>

        {groupedNotifications.length === 0 ? (
          <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              You&apos;re all caught up
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              New security alerts, withdrawal statuses, and recovery milestones
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.label} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {group.label}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                </div>
                <div className="space-y-3">
                  {group.items.map((notification) => {
                    const isRead = isNotificationRead(notification);
                    const styles = getColorStyles(notification.color);
                    const timestamp = new Date(getTimestamp(notification));

                    return (
                      <article
                        key={notification.id}
                        className={cn(
                          "rounded-3xl border p-4 sm:p-5 transition bg-white dark:bg-slate-900",
                          isRead
                            ? "border-slate-100 dark:border-slate-800"
                            : "border-emerald-200 shadow-lg shadow-emerald-100/80 dark:border-emerald-400/50"
                        )}
                      >
                        <div className="flex gap-3 sm:gap-4">
                          <div
                            className={cn(
                              "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center ring-4 flex-shrink-0",
                              styles.icon,
                              styles.ring
                            )}
                            aria-hidden="true"
                          >
                            <Bell className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {notification.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                  <span className={cn("font-semibold", styles.accent)}>
                                    {notification.type ?? "General"}
                                  </span>
                                  <span>•</span>
                                  <span>{formatTimestamp(timestamp)}</span>
                                  <span>•</span>
                                  <span>
                                    {formatRelative(
                                      timestamp,
                                      typeof notification.created_at === "string"
                                        ? notification.created_at
                                        : undefined
                                    )}
                                  </span>
                                </div>
                              </div>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
                                  styles.badge
                                )}
                              >
                                {notification.color ?? "update"}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                {isRead ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    <span>Marked as read</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                                    <span>New update</span>
                                  </>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleMarkAsRead(notification.id)}
                                disabled={isRead || activeId === String(notification.id)}
                                className={cn(
                                  "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold transition",
                                  isRead
                                    ? "border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500 cursor-not-allowed"
                                    : "border-slate-200 text-slate-700 hover:border-slate-900 dark:border-slate-700 dark:text-slate-200"
                                )}
                              >
                                {activeId === String(notification.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MailOpen className="h-4 w-4" />
                                )}
                                {isRead ? "Read" : "Mark as read"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
