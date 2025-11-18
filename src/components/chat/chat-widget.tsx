"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Loader2,
  MessageCircle,
  Minus,
  WifiOff,
  X as CloseIcon,
} from "lucide-react";

import ChatMessageList from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/chat-input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

const statusCopy: Record<
  string,
  { label: string; className: string; icon?: ReactNode }
> = {
  connected: { label: "Online", className: "text-white" },
  connecting: {
    label: "Connecting…",
    className: "text-white",
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  },
  disconnected: {
    label: "Offline",
    className: "text-white",
    icon: <WifiOff className="h-3.5 w-3.5" />,
  },
  failed: {
    label: "Offline",
    className: "text-white",
    icon: <WifiOff className="h-3.5 w-3.5" />,
  },
};

export function ChatWidget() {
  const { user, isAuthenticated } = useAuthStore();
  const {
    messages,
    isLoading,
    connectionStatus,
    sendMessage,
    loadMoreMessages,
    hasMoreMessages,
    selectedFiles,
    addFile,
    removeFile,
    error,
    setError,
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const previousMessageCount = useRef(messages.length);

  useEffect(() => {
    if (!isOpen && messages.length > previousMessageCount.current) {
      setHasUnread(true);
    }
    previousMessageCount.current = messages.length;
  }, [messages.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setError(null);
    }
  }, [isOpen, setError]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const statusMeta = useMemo(
    () => statusCopy[connectionStatus] ?? statusCopy.disconnected,
    [connectionStatus]
  );

  const handleSendMessage = async () => {
    await sendMessage(messageText);
    setMessageText("");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const renderPanel = (variant: "mobile" | "desktop") => (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="flex items-center justify-between bg-gradient-to-r from-[#3E2BCE] to-[#4F46E5] px-4 py-4 text-primary-foreground dark:from-[#2B227E] dark:to-[#4338CA]">
        <div>
          <p className="text-base font-semibold">CSC Concierge</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-white/80">
            {statusMeta.icon && <span className="flex items-center">{statusMeta.icon}</span>}
            <span className={cn("font-medium", statusMeta.className)}>{statusMeta.label}</span>
          </div>
        </div>
        {variant === "desktop" ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize chat"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="rounded-full p-1 text-white/90 transition hover:bg-white/15 hover:text-white"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2 bg-rose-500/10 px-4 py-2 text-xs text-rose-600 dark:text-rose-200">
          <span className="truncate">{error}</span>
          <button
            type="button"
            className="rounded-full p-1 hover:bg-rose-500/10"
            aria-label="Dismiss error"
            onClick={() => setError(null)}
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className={cn("flex flex-col", variant === "desktop" ? "h-[420px]" : "flex-1")}>
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 text-xs text-muted-foreground">
          <div>
            <p className="text-sm font-semibold text-foreground">Live Specialist</p>
            <p>Usually replies in under 2 minutes</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatMessageList
            messages={messages}
            currentUserId={user.id}
            isLoading={isLoading}
            onLoadMore={loadMoreMessages}
            hasMoreMessages={hasMoreMessages}
          />
        </div>
        <div className="border-t border-border/60 bg-muted/60 px-4 py-3 dark:bg-slate-900/60">
          <ChatInput
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onSend={handleSendMessage}
            onFileSelect={addFile}
            onFileRemove={removeFile}
            selectedFiles={selectedFiles}
            disabled={connectionStatus !== "connected"}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-24 right-3 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && !isMobile && (
        <div className="pointer-events-auto w-[320px] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-[0_25px_70px_rgba(20,23,67,0.25)] sm:w-[380px]">
          {renderPanel("desktop")}
        </div>
      )}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-[60] bg-black/50 sm:hidden">
          <div className="flex h-full w-full flex-col overflow-hidden rounded-none bg-card text-card-foreground shadow-2xl">
            {renderPanel("mobile")}
          </div>
        </div>
      )}
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="h-14 w-14 rounded-full border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 p-0 text-white shadow-[0_15px_40px_rgba(13,15,54,0.25)] transition hover:from-emerald-400 hover:to-emerald-500 dark:from-emerald-400 dark:to-emerald-500"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <MessageCircle className="h-6 w-6" />
          {hasUnread && (
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-500" />
          )}
        </div>
      </Button>
    </div>
  );
}
