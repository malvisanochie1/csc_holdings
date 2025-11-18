"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { ChatMessage, MessageAttachment } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading: boolean;
  onLoadMore: () => Promise<void>;
  hasMoreMessages: boolean;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  isLoading,
  onLoadMore,
  hasMoreMessages,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
      }),
    []
  );

  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMoreMessages) return;
    setLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [hasMoreMessages, loadingMore, onLoadMore]);

  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current && !userScrolled) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, userScrolled]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <=
        container.clientHeight + 100;
      setUserScrolled(!isAtBottom);

      if (container.scrollTop < 100 && hasMoreMessages && !loadingMore) {
        void loadMoreMessages();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMoreMessages, loadingMore, loadMoreMessages]);

  useEffect(() => {
    if (userScrolled && messages.length > 0) {
      setShowNewMessageIndicator(true);
    } else {
      setShowNewMessageIndicator(false);
    }
  }, [messages.length, userScrolled]);

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return timeFormatter.format(date);
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return dateFormatter.format(date);
  };

  const groupMessagesByDate = (msgs: ChatMessage[]) => {
    return msgs.reduce<Record<string, ChatMessage[]>>((groups, message) => {
      const day = formatMessageDate(message.created_at);
      if (!groups[day]) groups[day] = [];
      groups[day].push(message);
      return groups;
    }, {});
  };

  const getFileIcon = (fileType: string) => {
    if (fileType?.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.min(
      sizes.length - 1,
      Math.floor(Math.log(bytes) / Math.log(1024))
    );
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
  };

  const renderAttachment = (
    attachment: MessageAttachment,
    isCurrentUser: boolean
  ) => {
    const isImage =
      typeof attachment.is_image === "boolean"
        ? attachment.is_image
        : attachment.file_type?.startsWith("image/");

    if (isImage) {
      return (
        <div className="mt-2 max-w-xs overflow-hidden rounded-md">
          <a
            href={attachment.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <img
              src={attachment.download_url}
              alt={attachment.file_name}
              className="max-h-40 w-full rounded-md object-contain"
            />
          </a>
          <div className="flex items-center justify-between bg-black/50 p-1 text-xs text-white">
            <span className="mr-2 truncate">{attachment.file_name}</span>
            <a
              href={attachment.download_url}
              download={attachment.file_name}
              className="rounded p-1 hover:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-3 w-3" />
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <a
          href={attachment.download_url}
          download={attachment.file_name}
          className={cn(
            "flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted/50",
            isCurrentUser ? "bg-primary/20" : "bg-muted/30"
          )}
        >
          {getFileIcon(attachment.file_type)}
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">
              {attachment.file_name}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatFileSize(attachment.file_size)}
            </div>
          </div>
          <Download className="h-4 w-4 flex-shrink-0" />
        </a>
      </div>
    );
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">No messages yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start a conversation by typing a message below
          </p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 space-y-4 overflow-y-auto py-4"
      style={{ scrollbarWidth: "thin" }}
    >
      {isLoading && messages.length === 0 && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center p-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {date}
            </div>
          </div>

          {dateMessages.map((message) => {
            const isCurrentUser = message.sender_id === currentUserId;
            const isAdmin = message.is_admin;
            const hasAttachments =
              message.attachments && message.attachments.length > 0;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3",
                  isCurrentUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-12 w-12 rounded-full shadow-sm ring-2 ring-background">
                  <AvatarImage
                    src={message.sender?.avatar}
                    alt={message.sender?.first_name || ""}
                  />
                  <AvatarFallback className="rounded-full bg-muted text-base font-medium">
                    {isAdmin
                      ? "A"
                      : isCurrentUser
                      ? "U"
                      : message.sender?.first_name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "max-w-[80%] space-y-1",
                    isCurrentUser ? "items-end text-right" : "items-start text-left"
                  )}
                >
                  {!isCurrentUser && message.sender?.first_name && (
                    <div
                      className={cn(
                        "text-sm font-medium",
                        isAdmin ? "text-blue-400" : "text-foreground"
                      )}
                    >
                      {message.sender?.name ||
                        `${message.sender?.first_name ?? ""} ${
                          message.sender?.last_name ?? ""
                        }`.trim() ||
                        "Support"}
                    </div>
                  )}

                  {message.message && (
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        isCurrentUser
                          ? "rounded-tr-sm bg-primary text-primary-foreground"
                          : isAdmin
                          ? "rounded-tl-sm bg-blue-600/80 text-blue-50"
                          : "rounded-tl-sm border border-border/40 bg-muted/80 text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {message.message}
                      </p>
                    </div>
                  )}

                  {hasAttachments && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id}>
                          {renderAttachment(attachment, isCurrentUser)}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>{formatMessageTime(message.created_at)}</span>
                    {isCurrentUser && message.read_at && (
                      <span className="ml-1 text-primary">• Read</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      <div ref={messagesEndRef} />

      {userScrolled && messages.length > 0 && (
        <button
          className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-full bg-primary/80 p-2 text-primary-foreground shadow-lg transition-all hover:bg-primary"
          onClick={() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setUserScrolled(false);
            setShowNewMessageIndicator(false);
          }}
          type="button"
        >
          <ArrowDown className="h-5 w-5" />
          {showNewMessageIndicator && (
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
          )}
        </button>
      )}
    </div>
  );
};

export default ChatMessageList;
