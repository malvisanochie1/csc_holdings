"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { AxiosError } from "axios";

import { usePusher } from "@/hooks/usePusher";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api/http";
import type { ConnectionStatus } from "@/services/pusher-service";

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  is_image?: boolean;
  created_at: string;
  updated_at: string;
  download_url: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string | null;
  is_admin: boolean;
  read_at: string | null;
  created_at: string;
  attachments: MessageAttachment[];
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    avatar: string;
  };
}

interface MessagesPaginatedResponse {
  data: ChatMessage[];
  next_page_url: string | null;
  prev_page_url: string | null;
  first_page_url: string;
  last_page_url: string;
  from: number;
  to: number;
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

interface MessageCreatedResponse {
  success: boolean;
  data: ChatMessage;
}

interface MessagePayload {
  message: string;
  attachments: string[];
  customer_id?: string;
}

export interface SelectedFile {
  file: File;
  preview?: string;
  uploading: boolean;
  progress: number;
  error?: string;
}

interface ChatHook {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  connectionStatus: ConnectionStatus;
  sendMessage: (message: string, file?: File) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMoreMessages: boolean;
  uploadFile: (file: File) => Promise<string>;
  selectedFiles: SelectedFile[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  isPolling: boolean;
  lastMessageTimestamp: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}

export function useChat(customerId?: string): ChatHook {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<string | null>(
    null
  );

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  const user = useAuthStore((state) => state.user);
  const targetUserId = customerId || user?.id;

  const {
    connectionStatus,
    error: connectionError,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
  } = usePusher();

  const fetchMessages = useCallback(
    async (pageToFetch = 1, showLoading = true, poll = false) => {
      try {
        if (showLoading) setIsLoading(true);
        if (!poll) setError(null);

        let endpoint = customerId
          ? `/chat/messages?customer_id=${customerId}&page=${pageToFetch}`
          : `/chat/messages?page=${pageToFetch}`;

        if (poll && lastMessageTimestamp) {
          endpoint += `&after=${encodeURIComponent(lastMessageTimestamp)}`;
        }

        const response = await api.get<MessagesPaginatedResponse>(endpoint);
        const payload = response.data;

        if (payload && Array.isArray(payload.data)) {
          const incoming = payload.data;
          if (incoming.length > 0) {
            const newestMessage = incoming[incoming.length - 1];
            setLastMessageTimestamp(newestMessage.created_at);
          }

          if (pageToFetch === 1 && !poll) {
            setMessages(incoming);
          } else {
            setMessages((prev) => {
              const existingIds = new Set(prev.map((msg) => msg.id));
              const newMessages = incoming.filter(
                (msg) => !existingIds.has(msg.id)
              );
              return poll
                ? [...prev, ...newMessages]
                : [...newMessages, ...prev];
            });
          }

          setHasMoreMessages(Boolean(payload.next_page_url));
          setPage(pageToFetch);
        } else {
          setError("Invalid response from server");
        }
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message =
          axiosErr.response?.data?.message || "Failed to load messages.";
        if (!poll) {
          setError(message);
        }
      } finally {
        if (showLoading) setIsLoading(false);
      }
    },
    [customerId, lastMessageTimestamp]
  );

  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;

    setIsPolling(true);
    pollingIntervalRef.current = setInterval(() => {
      if (isComponentMounted.current) {
        fetchMessages(1, false, true).catch(() => {
          /* handled via fetch */
        });
      }
    }, 5000);
  }, [fetchMessages]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
    }
  }, []);

  useEffect(() => {
    if (connectionError) {
      setError(connectionError);
    }
  }, [connectionError]);

  useEffect(() => {
    if (!targetUserId) return;

    if (connectionStatus === "connected") {
      stopPolling();

      interface MessageSentEvent {
        message: ChatMessage;
      }

      interface MessageReadEvent {
        message_id: string;
      }

      const channelName = `chat.customer.${targetUserId}`;

      subscribeToPrivateChannel<MessageSentEvent>(channelName, {
        ".message.sent": (event) => {
          if (event?.message) {
            setMessages((prev) => {
              if (prev.some((msg) => msg.id === event.message.id)) {
                return prev;
              }
              setLastMessageTimestamp(event.message.created_at);
              return [...prev, event.message];
            });
          }
        },
      });

      subscribeToPrivateChannel<MessageReadEvent>(channelName, {
        ".message.read": (event) => {
          if (!event?.message_id) return;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === event.message_id
                ? { ...msg, read_at: new Date().toISOString() }
                : msg
            )
          );
        },
      });

      fetchMessages().catch(() => {
        /* handled by hook */
      });
    } else {
      startPolling();
    }

    return () => {
      if (targetUserId) {
        unsubscribeFromChannel(`chat.customer.${targetUserId}`);
      }
      stopPolling();
    };
  }, [
    connectionStatus,
    targetUserId,
    subscribeToPrivateChannel,
    unsubscribeFromChannel,
    fetchMessages,
    startPolling,
    stopPolling,
  ]);

  useEffect(() => {
    isComponentMounted.current = true;
    return () => {
      isComponentMounted.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  const loadMoreMessages = useCallback(async () => {
    if (!hasMoreMessages || isLoading) return;
    await fetchMessages(page + 1, false);
  }, [hasMoreMessages, isLoading, page, fetchMessages]);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const idx = selectedFiles.findIndex((f) => f.file === file);

    try {
      const response = await api.post<{ url: string }>("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total && idx !== -1) {
            const pct = Math.round((event.loaded * 100) / event.total);
            setSelectedFiles((prev) => {
              const updated = [...prev];
              if (idx >= 0 && idx < updated.length) {
                updated[idx] = {
                  ...updated[idx],
                  progress: pct,
                };
              }
              return updated;
            });
          }
        },
      });

      return response.data.url;
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message || "Failed to upload file.";
      if (idx !== -1) {
        setSelectedFiles((prev) => {
          const updated = [...prev];
          if (idx >= 0 && idx < updated.length) {
            updated[idx] = {
              ...updated[idx],
              error: message,
              uploading: false,
            };
          }
          return updated;
        });
      }
      throw new Error(message);
    }
  };

  const addFile = useCallback((file: File) => {
    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }
    setSelectedFiles((prev) => [
      ...prev,
      { file, preview, uploading: false, progress: 0 },
    ]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const updatedFiles = [...prev];
      if (index >= 0 && index < updatedFiles.length) {
        if (updatedFiles[index].preview) {
          URL.revokeObjectURL(updatedFiles[index].preview as string);
        }
        updatedFiles.splice(index, 1);
      }
      return updatedFiles;
    });
  }, []);

  const sendMessage = async (message: string, file?: File) => {
    if (!user) {
      setError("You must be logged in to send messages.");
      return;
    }

    if (!message.trim() && !file && selectedFiles.length === 0) {
      return;
    }

    if (connectionStatus !== "connected") {
      setError("Connection lost. Messages cannot be sent at this time.");
      return;
    }

    try {
      let attachments: string[] = [];

      if (file) {
        attachments.push(await uploadFile(file));
      } else if (selectedFiles.length) {
        setSelectedFiles((prev) =>
          prev.map((selected) => ({
            ...selected,
            uploading: true,
            progress: 0,
          }))
        );

        try {
          const uploads = selectedFiles.map((selected) => uploadFile(selected.file));
          attachments = await Promise.all(uploads);
        } finally {
          selectedFiles.forEach((selected) => {
            if (selected.preview) {
              URL.revokeObjectURL(selected.preview);
            }
          });
          setSelectedFiles([]);
        }
      }

      const payload: MessagePayload = {
        message,
        attachments,
      };

      if (customerId) {
        payload.customer_id = customerId;
      }

      const response = await api.post<MessageCreatedResponse>(
        "/chat/messages",
        payload
      );

      if (response.data?.data) {
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === response.data.data.id)) {
            return prev;
          }
          return [...prev, response.data.data];
        });
      }

      setError(null);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message || "Failed to send message.";
      setError(message);
    }
  };

  return {
    messages,
    isLoading,
    error,
    connectionStatus,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    uploadFile,
    selectedFiles,
    addFile,
    removeFile,
    isPolling,
    lastMessageTimestamp,
    setError,
  };
}
