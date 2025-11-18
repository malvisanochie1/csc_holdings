"use client";

import React from "react";
import {
  FileText,
  RefreshCw,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKycRecords, useSubmitKycDocuments } from "@/lib/api/kyc";
import type { KycDocumentType, KycRecord } from "@/lib/types/api";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

const ID_TYPES = [
  { value: "passport", label: "Passport", hint: "Photo page", requiresBack: false },
  { value: "driver_license", label: "Driver's license", hint: "Front and back", requiresBack: true },
  { value: "national_id", label: "National ID", hint: "Government issued", requiresBack: true },
] as const;

const ADDRESS_TIPS = [
  "Utility bill, bank statement, or tax notice dated within 3 months.",
  "Full name and residential address must match your profile.",
  "Upload colour scans or clear mobile captures (no screenshots).",
];

const STATUS_META = {
  approved: {
    label: "Approved",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    description: "Verified",
  },
  pending: {
    label: "Pending review",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    description: "Compliance is reviewing",
  },
  rejected: {
    label: "Action required",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    description: "Please re-submit",
  },
  missing: {
    label: "Not submitted",
    badge: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
    description: "Upload required",
  },
} as const;

type DocumentEntry = {
  label: string;
  value: string;
};

type FileState = {
  front: File | null;
  back: File | null;
};

function getStatusMeta(status?: string) {
  if (!status) return STATUS_META.missing;
  const normalized = status.toLowerCase();
  if (normalized in STATUS_META) {
    return STATUS_META[normalized as keyof typeof STATUS_META];
  }
  return STATUS_META.pending;
}

function parseDocumentEntries(document?: KycRecord["document"]): DocumentEntry[] {
  if (!document) return [];

  const mapRecord = (record: Record<string, unknown>) =>
    Object.entries(record)
      .filter(([, value]) => typeof value === "string" && value)
      .map(([key, value]) => ({
        label: key.replace(/_/g, " "),
        value: value as string,
      }));

  if (typeof document === "string") {
    const trimmed = document.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed
          .filter((value): value is string => typeof value === "string")
          .map((value, index) => ({ label: `Document ${index + 1}`, value }));
      }
      if (parsed && typeof parsed === "object") {
        return mapRecord(parsed as Record<string, unknown>);
      }
    } catch {
      // treat as raw string
    }
    return [{ label: "Document", value: trimmed }];
  }

  if (Array.isArray(document)) {
    return document
      .filter((value): value is string => typeof value === "string")
      .map((value, index) => ({ label: `Document ${index + 1}`, value }));
  }

  if (typeof document === "object") {
    return mapRecord(document as Record<string, unknown>);
  }

  return [];
}

function FileDropInput({
  id,
  label,
  description,
  file,
  accept,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  file: File | null;
  accept?: string;
  onChange: (file: File | null) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-lg border border-dashed border-slate-200 bg-white/80 p-4 text-left transition hover:border-blue-500 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-blue-400"
      )}
    >
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{file ? file.name : description}</p>
        </div>
        <UploadCloud className="size-5 text-slate-400" />
      </div>
      {file && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start px-0 text-xs text-rose-500"
          onClick={(event) => {
            event.preventDefault();
            onChange(null);
          }}
        >
          Remove
        </Button>
      )}
    </label>
  );
}

function SubmittedDocuments({ entries }: { entries: DocumentEntry[] }) {
  if (!entries.length) return null;
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60">
      <p className="font-semibold uppercase tracking-wide text-slate-500">Recent uploads</p>
      <ul className="mt-2 space-y-2">
        {entries.map((entry) => (
          <li key={`${entry.label}-${entry.value}`} className="flex flex-col rounded-xl bg-white/80 p-2 dark:bg-slate-900/80">
            <span className="font-medium text-slate-800 dark:text-slate-100">{entry.label}</span>
            <span className="break-all text-[11px] text-slate-500">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KycVerificationCenter() {
  const { data, isLoading, isRefetching, refetch } = useKycRecords();
  const { mutateAsync: submitDocuments, isPending } = useSubmitKycDocuments();
  const { showToast } = useToast();

  const [idFiles, setIdFiles] = React.useState<FileState>({ front: null, back: null });
  const [addressFile, setAddressFile] = React.useState<File | null>(null);
  const [selectedIdType, setSelectedIdType] = React.useState<typeof ID_TYPES[number]["value"]>(ID_TYPES[0].value);
  const [submittingType, setSubmittingType] = React.useState<KycDocumentType | null>(null);

  const selectedIdConfig = React.useMemo(
    () => ID_TYPES.find((item) => item.value === selectedIdType) ?? ID_TYPES[0],
    [selectedIdType]
  );
  const showBackUpload = selectedIdConfig.requiresBack;

  React.useEffect(() => {
    if (!selectedIdConfig.requiresBack) {
      setIdFiles((prev) => (prev.back ? { ...prev, back: null } : prev));
    }
  }, [selectedIdConfig]);

  const identityRecord = data?.find((record) => record.type?.toLowerCase() === "id");
  const addressRecord = data?.find((record) => record.type?.toLowerCase() === "proof_of_address");
  const identityDocuments = React.useMemo(() => parseDocumentEntries(identityRecord?.document), [identityRecord]);
  const addressDocuments = React.useMemo(() => parseDocumentEntries(addressRecord?.document), [addressRecord]);

  const handleSubmit = React.useCallback(
    async (type: KycDocumentType) => {
      const requiresBack = selectedIdConfig.requiresBack;

      if (type === "id" && (!idFiles.front || (requiresBack && !idFiles.back))) {
        showToast({
          title: "Files required",
          description: requiresBack
            ? "Upload both front and back images for your selected ID."
            : "Upload the document image for your selected ID.",
          type: "error",
        });
        return;
      }
      if (type === "proof_of_address" && !addressFile) {
        showToast({
          title: "File required",
          description: "Upload a recent proof of address before submitting.",
          type: "error",
        });
        return;
      }

      setSubmittingType(type);
      try {
        const formData = new FormData();
        formData.append("type", type);

        if (type === "id") {
          formData.append("id_front", idFiles.front as File);
          if (requiresBack && idFiles.back) {
            formData.append("id_back", idFiles.back);
          }
          formData.append("document_category", selectedIdType);
        } else {
          formData.append("document", addressFile as File);
        }

        await submitDocuments(formData);
        showToast({
          title: "Documents submitted",
          description: type === "id" ? "Identity files received." : "Address proof received.",
          type: "success",
        });
        if (type === "id") {
          setIdFiles({ front: null, back: null });
        } else {
          setAddressFile(null);
        }
        await refetch();
      } catch (error) {
        showToast({
          title: "Submission failed",
          description: (error as Error)?.message ?? "Unable to submit documents right now.",
          type: "error",
        });
      } finally {
        setSubmittingType(null);
      }
    },
    [addressFile, idFiles.back, idFiles.front, refetch, selectedIdConfig, selectedIdType, showToast, submitDocuments]
  );

  const isSubmittingId = isPending && submittingType === "id";
  const isSubmittingAddress = isPending && submittingType === "proof_of_address";

  return (
    <div className="space-y-5 pb-16">
      <section className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_1px_0_rgba(15,23,42,0.06)] sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Identity verification</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Proof of ID</h2>
          </div>
          <Badge className={cn("border text-[11px]", getStatusMeta(identityRecord?.status).badge)}>
            {getStatusMeta(identityRecord?.status).label}
          </Badge>
        </header>

        <div className="mt-5 space-y-4">
          <p className="text-xs uppercase text-slate-500">Select ID type</p>
          <div className="flex flex-wrap gap-2">
            {ID_TYPES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setSelectedIdType(item.value)}
                className={cn(
                  "cursor-pointer rounded-xl border px-4 py-2 text-left text-sm transition",
                  selectedIdType === item.value
                    ? "border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-400 dark:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60"
                )}
              >
                <span className="block font-semibold">{item.label}</span>
                <span className="text-xs text-slate-500">{item.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "mt-5 grid gap-4",
            showBackUpload ? "md:grid-cols-2" : "md:grid-cols-1"
          )}
        >
          <FileDropInput
            id="kyc-id-front"
            label={showBackUpload ? "Front side" : `${selectedIdConfig.label} document`}
            description={showBackUpload ? "Full document visible" : "Upload a clear scan or photo"}
            file={idFiles.front}
            accept="image/*,application/pdf"
            onChange={(file) => setIdFiles((prev) => ({ ...prev, front: file }))}
          />
          {showBackUpload && (
            <FileDropInput
              id="kyc-id-back"
              label="Back side"
              description="Include MRZ where available"
              file={idFiles.back}
              accept="image/*,application/pdf"
              onChange={(file) => setIdFiles((prev) => ({ ...prev, back: file }))}
            />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            AES-256 encrypted transfer
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-rose-500"
              onClick={() => setIdFiles({ front: null, back: null })}
              disabled={!idFiles.front && !idFiles.back}
            >
              Clear
            </Button>
            <Button type="button" size="sm" onClick={() => handleSubmit("id")} disabled={isSubmittingId}>
              {isSubmittingId ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" />
                  Submit ID
                </>
              )}
            </Button>
          </div>
        </div>

        <SubmittedDocuments entries={identityDocuments} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-[0_1px_0_rgba(15,23,42,0.06)] sm:p-6 dark:border-slate-800 dark:bg-slate-900/70">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase text-slate-500">Address verification</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Proof of Address</h2>
          </div>
          <Badge className={cn("border text-[11px]", getStatusMeta(addressRecord?.status).badge)}>
            {getStatusMeta(addressRecord?.status).label}
          </Badge>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FileDropInput
            id="kyc-address"
            label="Proof of address"
            description="Upload PDF or image"
            file={addressFile}
            accept="image/*,application/pdf"
            onChange={setAddressFile}
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Accepted documents</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>Utility bill</li>
              <li>Bank statement</li>
              <li>Tax assessment</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-blue-500" />
            Issued within the last 3 months
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-rose-500"
              onClick={() => setAddressFile(null)}
              disabled={!addressFile}
            >
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSubmit("proof_of_address")}
              disabled={isSubmittingAddress}
            >
              {isSubmittingAddress ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" />
                  Submit Address
                </>
              )}
            </Button>
          </div>
        </div>

        <SubmittedDocuments entries={addressDocuments} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 shadow-[0_1px_0_rgba(15,23,42,0.06)] sm:p-6 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase text-slate-500">Before you upload</p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Checklist</h3>
          </div>
          <Badge variant="outline" className="text-[11px]">
            Avg. review under 24h
          </Badge>
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {ADDRESS_TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      {(isLoading || isRefetching) && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60">
          Syncing verification data...
        </div>
      )}
    </div>
  );
}

export default KycVerificationCenter;
