"use client";

import { useCallback, useEffect, useState } from "react";

import PusherService, {
  type ConnectionStatus,
} from "@/services/pusher-service";

export function usePusher() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("disconnected");
  const [error, setError] = useState<string | null>(null);

  const pusherService = PusherService.getInstance();

  useEffect(() => {
    const unsubscribe = pusherService.onConnectionChange((status, err) => {
      setConnectionStatus(status);
      setError(err || null);
    });

    if (pusherService.getStatus() === "disconnected") {
      pusherService.connect();
    }

    return () => {
      unsubscribe();
    };
  }, [pusherService]);

  const subscribeToPrivateChannel = useCallback(
    <T = unknown>(
      channelName: string,
      events: Record<string, (data: T) => void>
    ) => {
      pusherService.subscribeToPrivateChannel<T>(channelName, events);
    },
    [pusherService]
  );

  const unsubscribeFromChannel = useCallback(
    (channelName: string) => {
      pusherService.unsubscribeFromChannel(channelName);
    },
    [pusherService]
  );

  const reconnect = useCallback(() => {
    pusherService.disconnect();
    pusherService.connect();
  }, [pusherService]);

  return {
    connectionStatus,
    error,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    reconnect,
  };
}
