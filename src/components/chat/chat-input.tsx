"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import { Loader2, Paperclip, Send, X, File as FileIcon, FileText, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SelectedFile } from "@/hooks/useChat";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
  selectedFiles?: SelectedFile[];
  onFileRemove?: (index: number) => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onFileSelect,
  disabled = false,
  selectedFiles = [],
  onFileRemove,
}: ChatInputProps) {
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      (!value.trim() && selectedFiles.length === 0) ||
      disabled ||
      isSending
    ) {
      return;
    }

    setIsSending(true);
    try {
      await onSend();
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit(event);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileSelect) {
      Array.from(files).forEach((file) => onFileSelect(file));
      event.target.value = "";
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    if (file.type === "application/pdf") {
      return <FileText className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-2">
      {selectedFiles.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedFiles.map((fileUpload, index) => (
            <div
              key={`${fileUpload.file.name}-${index}`}
              className="relative flex items-center rounded-md border border-border/40 bg-card p-2 pr-8 text-xs"
            >
              <div className="flex items-center gap-2 max-w-[220px]">
                {getFileIcon(fileUpload.file)}
                <div className="truncate">{fileUpload.file.name}</div>
              </div>

              {fileUpload.uploading && (
                <div className="ml-2 text-xs text-primary">
                  {fileUpload.progress}%
                </div>
              )}

              {fileUpload.error && (
                <div className="ml-2 text-xs text-destructive">Error</div>
              )}

              <button
                type="button"
                className="absolute right-1 top-1 text-muted-foreground transition hover:text-foreground"
                onClick={() => onFileRemove?.(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <Input
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Reconnecting..." : "Type a message..."}
          className="flex-1 border-card-foreground/10 bg-card"
          disabled={disabled || isSending}
        />

        <Button
          size="icon"
          className="bg-primary text-primary-foreground"
          disabled={
            (!value.trim() && selectedFiles.length === 0) ||
            disabled ||
            isSending
          }
          type="submit"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
