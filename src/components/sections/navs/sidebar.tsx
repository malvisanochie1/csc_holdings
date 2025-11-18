"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { NavKey, desktopNavItems } from "../../text/csc";
import RecoveryPortal from "../recoveryPortal";
import { useLogout } from "@/lib/api/auth";
import { useSiteTitle } from "@/hooks/use-site-title";
interface SidebarProps {
  active?: NavKey;
}

export default function Sidebar({ active }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: triggerLogout, isPending: isLoggingOut } = useLogout();
  const siteTitle = useSiteTitle();
  const uppercaseSiteTitle = React.useMemo(() => siteTitle.toUpperCase(), [siteTitle]);

  const inferredActive: NavKey = React.useMemo(() => {
    if (!pathname) return "dashboard";
    if (pathname.startsWith("/dashboard/transactions") || pathname.startsWith("/dashboard/transaction")) {
      return "transactions";
    }
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/verification")) return "verification";
    if (pathname.startsWith("/notifications")) return "notifications";
    if (pathname.startsWith("/livechat")) return "livechat";
    if (pathname.startsWith("/settings")) return "settings";
    if (pathname.startsWith("/login")) return "logout";
    return "dashboard";
  }, [pathname]);

  const currentActive = (active ?? inferredActive) as NavKey;

  const handleLogout = React.useCallback(() => {
    triggerLogout(undefined, {
      onSettled: () => {
        router.push("/login");
      },
    });
  }, [router, triggerLogout]);

  return (
    <aside className="w-full h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Upper content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Link href="/" className="pt-6 px-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt={`${siteTitle} logo`}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
              </div>
              <div className="text-gray-800 dark:text-white">
                <h1 className="text-sm font-bold leading-tight">{uppercaseSiteTitle}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Trusted escrow desk</p>
              </div>
            </div>
        </Link>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto space-y-1 px-3">
          {desktopNavItems.map((item) => {
            const isLogoutItem = item.key === "logout";
            const isActive = !isLogoutItem && item.key === currentActive;
            const linkClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${isLogoutItem ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`;

            const label = isLogoutItem && isLoggingOut ? "Logging out..." : item.label;

            const content = (
              <>
                <span
                  className={`text-lg ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400"
                  }`}
                >
                  {item.icon}
                </span>

                <span className={`text-sm font-medium flex-1 ${isActive ? "text-white" : ""}`}>
                  {label}
                </span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </>
            );

            if (isLogoutItem) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={handleLogout}
                  className={`${linkClass} w-full text-left`}
                  disabled={isLoggingOut}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={linkClass}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0">
        <RecoveryPortal />
      </div>
    </aside>
  );
}
