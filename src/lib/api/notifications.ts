"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api/http";
import { queryKeys } from "@/lib/queryKeys";
import type { ApiResponse, NotificationFeedItem } from "@/lib/types/api";
import { getMockNotifications, markMockNotificationAsRead } from "@/lib/mocks/notifications";

const USE_MOCK_NOTIFICATIONS =
  process.env.NEXT_PUBLIC_USE_MOCK_NOTIFICATIONS === "true" ||
  !process.env.NEXT_PUBLIC_API_BASE_URL;

const NOTIFICATIONS_ENDPOINT = "/notifications";

function getMarkReadEndpoint(notificationId: string | number) {
  return `/notifications/${notificationId}/read`;
}

function buildMockResponse<T>(data: T, message: string): ApiResponse<T> {
  return {
    status: "success",
    success: true,
    message,
    data,
  };
}

export function fetchNotifications() {
  if (USE_MOCK_NOTIFICATIONS) {
    return Promise.resolve(
      buildMockResponse(
        getMockNotifications(),
        "Notifications fetched successfully"
      )
    );
  }
  return apiGet<NotificationFeedItem[]>(NOTIFICATIONS_ENDPOINT);
}

export function markNotificationAsRead(notificationId: string | number) {
  if (USE_MOCK_NOTIFICATIONS) {
    return Promise.resolve(
      buildMockResponse(
        markMockNotificationAsRead(notificationId),
        "Notification marked as read"
      )
    );
  }
  return apiPost<NotificationFeedItem>(getMarkReadEndpoint(notificationId));
}

export function useNotifications() {
  return useQuery<NotificationFeedItem[]>({
    queryKey: queryKeys.notifications,
    queryFn: async (): Promise<NotificationFeedItem[]> => {
      const response = await fetchNotifications();
      return response.data;
    },
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string | number) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}
