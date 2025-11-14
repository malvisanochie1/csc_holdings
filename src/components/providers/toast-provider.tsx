"use client";

import React from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

export interface ToastPayload {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

interface ToastItem extends ToastPayload {
  id: string;
  createdAt: number;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (payload: ToastPayload) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return <CheckCircle2 className="size-5 text-emerald-500" />;
  }
  if (type === "error") {
    return <XCircle className="size-5 text-rose-500" />;
  }
  return <CheckCircle2 className="size-5 text-slate-500" />;
}

function ToastItemView({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full min-w-[280px] max-w-sm items-start gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-lg shadow-gray-900/10",
        toast.type === "success" && "border-emerald-100",
        toast.type === "error" && "border-rose-100"
      )}
    >
      <ToastIcon type={toast.type} />
      <div className="flex-1 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">{toast.title}</p>
        {toast.description && <p className="text-xs text-gray-500 mt-0.5">{toast.description}</p>}
      </div>
      <button
        type="button"
        className="text-gray-400 hover:text-gray-600"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = React.useCallback(
    ({ title, description, type = "info", duration = 4000 }: ToastPayload) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const nextToast: ToastItem = {
        id,
        title,
        description,
        type,
        duration,
        createdAt: Date.now(),
      };
      setToasts((prev) => [...prev, nextToast]);
      window.setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex w-full flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
        {toasts.map((toast) => (
          <ToastItemView key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
