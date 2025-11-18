"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import type { BroadcastDriver } from "laravel-echo";
import type {
  ChannelAuthorizationCallback,
  ChannelAuthorizationData,
} from "pusher-js/types/src/core/auth/options";

import { api } from "@/lib/api/http";

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "failed";
export type ConnectionChangeListener = (
  status: ConnectionStatus,
  error?: string
) => void;

class PusherService {
  private static instance: PusherService;
  private echo: Echo<BroadcastDriver> | null = null;
  private status: ConnectionStatus = "disconnected";
  private error: string | null = null;
  private listeners: ConnectionChangeListener[] = [];
  private connectionBound = false;

  private constructor() {}

  public static getInstance(): PusherService {
    if (!PusherService.instance) {
      PusherService.instance = new PusherService();
    }
    return PusherService.instance;
  }

  public connect(): void {
    if (this.echo || this.status === "connecting") return;

    if (typeof window === "undefined") {
      this.setStatus("failed", "Pusher is only available in the browser.");
      return;
    }

    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    if (!key) {
      this.setStatus("failed", "Missing Pusher credentials.");
      return;
    }

    this.setStatus("connecting");

    try {
      if (!window.Pusher) {
        window.Pusher = Pusher;
      }

      const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1";

      this.echo = new Echo({
        broadcaster: "pusher",
        key,
        cluster,
        forceTLS: true,
        authorizer: (channel: { name: string }) => ({
          authorize: (
            socketId: string,
            callback: ChannelAuthorizationCallback
          ) => {
            api
              .post("/broadcasting/auth", {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(null, response.data as ChannelAuthorizationData);
              })
              .catch((error) => {
                const err =
                  error instanceof Error
                    ? error
                    : new Error("Authorization failed");
                callback(err, null);
              });
          },
        }),
      });

      this.bindConnectionEvents();
      this.setStatus("connected");
    } catch (err) {
      this.setStatus(
        "failed",
        err instanceof Error ? err.message : "Failed to initialize Pusher."
      );
    }
  }

  public disconnect(): void {
    if (!this.echo) return;
    this.echo.disconnect();
    this.echo = null;
    this.setStatus("disconnected");
    this.connectionBound = false;
  }

  public subscribeToPrivateChannel<T>(
    channelName: string,
    events: Record<string, (data: T) => void>
  ): void {
    if (!this.echo) this.connect();
    if (!this.echo) return;

    const normalizedName = channelName.replace(/^private-/, "");
    const channel = this.echo.private(normalizedName);

    Object.entries(events).forEach(([event, callback]) => {
      channel.listen(event, callback);
    });
  }

  public subscribeToChannel<T>(
    channelName: string,
    events: Record<string, (data: T) => void>
  ): void {
    if (!this.echo) this.connect();
    if (!this.echo) return;

    const channel = this.echo.channel(channelName);
    Object.entries(events).forEach(([event, callback]) => {
      channel.listen(event, callback);
    });
  }

  public unsubscribeFromChannel(channelName: string): void {
    if (!this.echo) return;
    const normalizedName = channelName.replace(/^private-/, "");
    this.echo.leave(normalizedName);
    this.echo.leave(`private-${normalizedName}`);
  }

  public onConnectionChange(listener: ConnectionChangeListener): () => void {
    this.listeners.push(listener);
    listener(this.status, this.error || undefined);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public getError(): string | null {
    return this.error;
  }

  private setStatus(status: ConnectionStatus, error?: string): void {
    this.status = status;
    this.error = error || null;
    this.listeners.forEach((listener) => listener(status, this.error || undefined));
  }

  private bindConnectionEvents(): void {
    if (!this.echo || this.connectionBound) return;
    const connector = this.echo.connector as unknown as {
      pusher?: Pusher;
    };
    const pusherInstance = connector?.pusher;
    if (!pusherInstance) return;

    const connection = pusherInstance.connection;
    this.connectionBound = true;

    connection.bind("connected", () => this.setStatus("connected"));
    connection.bind("connecting", () => this.setStatus("connecting"));
    connection.bind("disconnected", () => this.setStatus("disconnected"));
    connection.bind("unavailable", () =>
      this.setStatus("failed", "Realtime service unavailable.")
    );
    connection.bind("failed", () =>
      this.setStatus("failed", "Realtime service failed.")
    );
    connection.bind("error", (event: { error?: string; message?: string }) => {
      const message =
        event?.error || event?.message || "Realtime connection error.";
      this.setStatus("failed", message);
    });
  }
}

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

export default PusherService;
