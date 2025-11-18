"use client";

import React from "react";
import Swal from "sweetalert2";

export interface InsufficientBalanceOptions {
  title?: string;
  description?: string;
}

export function showInsufficientBalanceAlert(options?: InsufficientBalanceOptions) {
  const title = options?.title ?? "Insufficient Balance";
  const description = options?.description ?? "";

  return Swal.fire({
    title,
    text: description,
    icon: "error",
    confirmButtonText: "Understood",
    confirmButtonColor: "#d33",
    backdrop: true,
    customClass: {
      popup: "swal-red-border",
    },
  });
}

export function useInsufficientBalanceAlert(defaults?: InsufficientBalanceOptions) {
  return React.useCallback(
    (overrides?: InsufficientBalanceOptions) =>
      showInsufficientBalanceAlert({ ...(defaults ?? {}), ...(overrides ?? {}) }),
    [defaults]
  );
}
