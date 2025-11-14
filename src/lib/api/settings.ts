"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api/http";
import type { SettingsData, SiteData } from "@/lib/types/api";
import { queryKeys } from "@/lib/queryKeys";

export function getSettings() {
  return apiGet<SettingsData>("/settings");
}

export function getSiteData() {
  return apiGet<SiteData>("/data");
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: async () => (await getSettings()).data,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSiteData() {
  return useQuery({
    queryKey: queryKeys.siteData,
    queryFn: async () => (await getSiteData()).data,
    staleTime: 5 * 60 * 1000,
  });
}
