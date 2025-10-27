"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { NavKey, navItems } from "../../text/csc";
import RecoveryPortal from "../recoveryPortal";
import { ModeToggle } from "@/components/ui/modetoggle";
interface SidebarProps {
  active?: NavKey;
}

export default function Sidebar({ active }: SidebarProps) {
  const pathname = usePathname();

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
  return (
    <aside className="w-full h-full overflow-y-auto min-h-screen border-r border-gray-200 pt-4 flex flex-col pb-2">
      {/* Upper content */}
      <div className="flex-1">
        <Link href="/">
          <div className="flex flex-col gap-3 mb-4 ps-6 dark:text-gray-300">
            <Image
              src="/logo.png"
              alt="CSC logo"
              width={60}
              height={60}
              className="w-[50px] object-contain"
            />
            <div>
              <div>
                <h1 className="text-sm font-bold flex items-center flex-nowrap">
                  CSC ESCROW & SETTLEMENT
                </h1>
              </div>
              <div className="text-sm font-bold">UK LIMITED</div>
            </div>
          </div>
        </Link>

        <hr className="h-[1px] w-40 mx-auto border-0 bg-gradient-to-r from-[#00000000] via-[#21212166] to-[#00000000]" />

        <nav aria-label="Main navigation" className="space-y-1 px-6 pt-4">
          {navItems.map((item) => {
            const isActive = item.key === currentActive;
            const linkClass = `flex items-center gap-3 p-3 rounded transition-all duration-150 group ${
              isActive
                ? "bg-white shadow-md ring-1 dark:ring-slate-800 ring-gray-200 dark:bg-slate-800"
                : "hover:bg-white hover:rounded hover:dark:bg-slate-800 rounded"
            }`;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={linkClass}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`grid place-content-center w-7 h-7 rounded px-2 ${
                    isActive
                      ? "nav-blue-bg text-gray-300"
                      : "bg-white dark:bg-slate-800 shadow nav-blue-text group-hover:bg-white dark:nav-blue-bg"
                  }`}
                >
                  <span
                    className={`w-5 h-5 ps-0.5 -mb-1 mx-auto ${
                      isActive ? "" : "opacity-90"
                    }`}
                  >
                    {item.icon}
                  </span>
                </span>

                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-gray-800 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          <ModeToggle />
        </nav>
      </div>

      {/* Bottom section */}
      <RecoveryPortal />
    </aside>
  );
}
