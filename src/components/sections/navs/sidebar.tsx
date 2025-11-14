"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { NavKey, navItems } from "../../text/csc";
import RecoveryPortal from "../recoveryPortal";
import { useLogout } from "@/lib/api/auth";
interface SidebarProps {
  active?: NavKey;
}

export default function Sidebar({ active }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: triggerLogout, isPending: isLoggingOut } = useLogout();

  const inferredActive: NavKey = React.useMemo(() => {
    if (!pathname) return "notifications";
    if (pathname.startsWith("/dashboard/transactions")) return "transactions";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/notification")) return "notifications";
    if (pathname.startsWith("/login")) return "logout";
    return "notifications";
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
                alt="CSC logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain brightness-0 invert"
              />
            </div>
            <div className="text-gray-800 dark:text-white">
              <h1 className="text-sm font-bold leading-tight">CSC ESCROW</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">UK LIMITED</p>
            </div>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto space-y-1 px-3">
          {navItems.map((item) => {
            const isLogoutItem = item.key === "logout";
            const isActive = !isLogoutItem && item.key === currentActive;
            const linkClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            } ${isLogoutItem ? "disabled:opacity-60 disabled:cursor-not-allowed" : ""}`;

            const label = isLogoutItem && isLoggingOut ? "Logging out..." : item.label;

            const content = (
              <>
                <span
                  className={`text-lg ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
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
