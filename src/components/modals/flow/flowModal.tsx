"use client";

import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface FlowModalProps extends React.ComponentProps<typeof Dialog> {
  trigger?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  dialogClassName?: string;
  titleClassName?: string;
}

const FlowModal = ({
  trigger,
  title,
  subtitle,
  eyebrow,
  footer,
  children,
  contentClassName,
  dialogClassName,
  titleClassName,
  ...dialogProps
}: FlowModalProps) => {
  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className={cn(
          "sm:max-w-6xl w-full border-none bg-transparent p-0 shadow-none",
          dialogClassName
        )}
      >
        <div
          className={cn(
            "max-h-[90vh] flex flex-col rounded-2xl border border-gray-100/80 bg-white/95 shadow-[0_25px_65px_rgba(15,23,42,0.25)] backdrop-blur dark:border-white/10 dark:bg-gray-900",
            contentClassName
          )}
        >
          <div className="relative border-b border-gray-100/80 px-8 py-6 dark:border-white/5">
            {eyebrow && (
              <p className="text-[11px] uppercase tracking-[0.25em] text-indigo-500">
                {eyebrow}
              </p>
            )}
            <h2 className={cn("text-2xl font-semibold text-gray-900 dark:text-white", titleClassName)}>
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
            <DialogClose className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:text-gray-900 dark:border-white/10 dark:text-gray-400 dark:hover:text-white">
              <X className="size-5" />
            </DialogClose>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>

          {footer && (
            <div className="border-t border-gray-100/80 px-8 py-5 dark:border-white/5">
              {footer}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlowModal;
