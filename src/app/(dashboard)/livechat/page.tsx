"use client";

import { useMemo, useState } from "react";
import { WifiOff } from "lucide-react";

import ChatMessageList from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/chat-input";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import { useChat } from "@/hooks/useChat";
import { useAuthStore } from "@/lib/store/auth";

const statusCopy = {
  connected: {
    label: "Online",
    tone: "text-emerald-500",
  },
  connecting: {
    label: "Connecting…",
    tone: "text-amber-500",
  },
  disconnected: {
    label: "Offline",
    tone: "text-rose-500",
  },
  failed: {
    label: "Offline",
    tone: "text-rose-500",
  },
} as const;

export default function LivechatPage() {
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
  } = useChat();
  const { user, _hasHydrated } = useAuthStore();
  const [messageText, setMessageText] = useState("");

  const statusMeta = useMemo(
    () => statusCopy[connectionStatus] ?? statusCopy.disconnected,
    [connectionStatus]
  );

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    await sendMessage(messageText);
    setMessageText("");
  };

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen home-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen home-bg flex items-center justify-center text-muted-foreground">
        <p className="text-lg font-semibold">Please sign in to access Live Chat</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-bg flex h-screen overflow-hidden">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
          <div className="flex-1 px-3 sm:px-5 pb-24 sm:pb-5 overflow-y-auto">
            <div className="pt-3 sm:pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Live Concierge
                  </p>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Talk to CSC Support
                  </h1>
                  <p className="text-sm text-slate-500">
                    Our recovery specialists are online 24/7 to assist with your portfolio.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${statusMeta.tone}`}>
                    {statusMeta.label}
                  </span>
                  {connectionStatus !== "connected" && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <WifiOff className="h-4 w-4" />
                      Reconnecting…
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex h-[70vh] flex-col border border-slate-200 bg-white">
              <div className="flex-1 overflow-hidden bg-slate-50">
                <ChatMessageList
                  messages={messages}
                  currentUserId={user.id}
                  isLoading={isLoading}
                  onLoadMore={loadMoreMessages}
                  hasMoreMessages={hasMoreMessages}
                />
              </div>
              <div className="border-t border-slate-200 bg-white p-4">
                <ChatInput
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  onSend={handleSendMessage}
                  onFileSelect={addFile}
                  selectedFiles={selectedFiles}
                  onFileRemove={removeFile}
                  disabled={connectionStatus !== "connected"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
