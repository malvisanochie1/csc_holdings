"use client";

import { apiGet } from "@/lib/api/http";

export interface ChatUnreadCountResponse {
  unread_count: number;
}

export async function getChatUnreadCount() {
  const response = await apiGet<ChatUnreadCountResponse>("/chat/unread-count");
  return response.data;
}
