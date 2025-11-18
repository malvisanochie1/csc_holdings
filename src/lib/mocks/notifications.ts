import type { NotificationFeedItem } from "@/lib/types/api";
import snapshot from "../../../Notes/Data/notifications.json";

type NotificationSnapshot = {
  data?: NotificationFeedItem[];
};

const { data: snapshotData } = snapshot as NotificationSnapshot;

if (!snapshotData || !Array.isArray(snapshotData)) {
  throw new Error("Failed to load notification snapshot");
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function normalizeSnapshot(data: NotificationFeedItem[]): NotificationFeedItem[] {
  return data.map((item) => ({
    ...item,
    read: item.read ?? Boolean(item.read_at),
  }));
}

const globalStore = globalThis as typeof globalThis & {
  __cscMockNotifications?: NotificationFeedItem[];
};

if (!globalStore.__cscMockNotifications) {
  globalStore.__cscMockNotifications = normalizeSnapshot(clone(snapshotData));
}

const notificationsStore = globalStore.__cscMockNotifications!;

export function getMockNotifications(): NotificationFeedItem[] {
  return clone(notificationsStore);
}

export function markMockNotificationAsRead(notificationId: string | number): NotificationFeedItem {
  const id = String(notificationId);
  const target = notificationsStore.find((item) => String(item.id) === id);

  if (!target) {
    throw Object.assign(new Error("Notification not found"), { statusCode: 404 });
  }

  target.read = true;
  if (!target.read_at) {
    target.read_at = new Date().toISOString();
  }

  return clone(target);
}
