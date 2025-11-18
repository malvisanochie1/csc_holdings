"use client";

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/store/auth";
import type { ApiErrors, ApiResponse } from "@/lib/types/api";

const FALLBACK_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function resolveBaseURL() {
  if (typeof window === "undefined") {
    return FALLBACK_BASE;
  }

  const hostname = window.location.hostname.toLowerCase();
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local");

  if (isLocalhost) {
    return FALLBACK_BASE;
  }

  return window.location.origin+'/api/v1';
}

const baseURL = resolveBaseURL();

export const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach Authorization token if present
api.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  } catch {
    // no-op in SSR or if store unavailable
  }
  return config;
});

// Handle 401 responses centrally
api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      try {
        useAuthStore.getState().clear();
      } catch {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

type ErrorPayload = {
  message?: string;
  errors?: ApiErrors;
};

async function handle<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<ApiResponse<T>> {
  try {
    const { data } = await promise;
    return data;
  } catch (err) {
    const e = err as AxiosError<ErrorPayload>;
    const message = e.response?.data?.message || e.message || "Request failed";
    const errors = e.response?.data?.errors;
    const errorDetail = (e.response?.data as { error?: string })?.error;
    const errorType = (e.response?.data as { error_type?: string })?.error_type;
    throw Object.assign(new Error(message), {
      errors,
      status: e.response?.status,
      error: errorDetail,
      errorType,
      response: e.response?.data,
    });
  }
}

export function apiGet<T>(url: string, config?: AxiosRequestConfig) {
  return handle<T>(api.get(url, config));
}

export function apiPost<T, P = unknown>(url: string, payload?: P, config?: AxiosRequestConfig) {
  return handle<T>(api.post(url, payload, config));
}

export function apiPut<T, P = unknown>(url: string, payload?: P, config?: AxiosRequestConfig) {
  return handle<T>(api.put(url, payload, config));
}

export function apiDelete<T>(url: string, config?: AxiosRequestConfig) {
  return handle<T>(api.delete(url, config));
}
