"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { NavKey, mobileNavItems, desktopNavItems } from "../../text/csc";
import { useLogout } from "@/lib/api/auth";
import { useSiteTitle } from "@/hooks/use-site-title";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const { mutate: triggerLogout, isPending: isLoggingOut } = useLogout();
  const siteTitle = useSiteTitle();
  const uppercaseSiteTitle = React.useMemo(() => siteTitle.toUpperCase(), [siteTitle]);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
    if (pathname.startsWith("/logout")) return "logout";
    return "dashboard";
  }, [pathname]);

  const handleLogout = React.useCallback(() => {
    triggerLogout(undefined, {
      onSettled: () => {
        router.push("/login");
      },
    });
  }, [router, triggerLogout]);

  const renderNavLinks = (isMobile = false) =>
    desktopNavItems.map((item) => {
      const isLogoutItem = item.key === "logout";
      const isActive = !isLogoutItem && item.key === inferredActive;
      const label = isLogoutItem && isLoggingOut ? "Logging out..." : item.label;
      const commonClasses =
        "text-sm font-medium transition-colors duration-150";
      const desktopClasses = isActive
        ? "text-gray-900"
        : "text-gray-600 hover:text-gray-900";
      const mobileClasses = isActive
        ? "bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300"
        : "text-gray-600- hover:bg-gray-50 text-gray-900 dark:hover:bg-gray-600 dark:text-gray-300";

      if (isLogoutItem) {
        return (
          <button
            key={item.key}
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={
              isMobile
                ? `block px-3 py-2 rounded-md mx-1 ${mobileClasses} ${commonClasses} disabled:opacity-60 disabled:cursor-not-allowed`
                : `${desktopClasses} ${commonClasses} disabled:opacity-60 disabled:cursor-not-allowed`
            }
          >
            {label}
          </button>
        );
      }

      return (
        <Link
          key={item.key}
          href={item.href}
          className={
            isMobile
              ? `block px-3 py-2 rounded-md mx-1 ${mobileClasses} ${commonClasses}`
              : `${desktopClasses} ${commonClasses}`
          }
          aria-current={isActive ? "page" : undefined}
        >
          {label}
        </Link>
      );
    });

  return (
    <section className="w-full">
      <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden sm:flex xl:hidden sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt={`${siteTitle} logo`}
                    width={100}
                    height={100}
                    className="w-10 md:w-20 h-10 md:h-20 object-contain"
                  />
                  <div className="hidden sm:block text-sm font-semibold">
                    {uppercaseSiteTitle}
                  </div>
                </div>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 md:hidden rounded-md text-gray-700 hover:bg-white/60 dark:hover:bg-gray-600"
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? <HiX size={22} /> : <HiOutlineMenu size={22} />}
              </button>
            </div>

            <nav className="pb-4 hidden md:flex font-light">
              {renderNavLinks(true)}
            </nav>
          </div>

          {/* Dropdown Menu */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className={`absolute left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-lg  transition-all duration-200 origin-top transform pt-3 ${
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <nav className="px-2 pb-4 space-y-1">{renderNavLinks(true)}</nav>
          </div>
        </div>
      </header>
      {/* Mobile Bottom Navigation */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 sm:hidden shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.15)]"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => {
            const isActive = item.key === inferredActive;
            return (
              <li key={item.key} className="flex-1">
                <Link href={item.href} className="flex flex-col items-center gap-0.5 py-0.5">
                  <div className={`flex items-center justify-center w-10 h-8 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 scale-105"
                      : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}>
                    <span className={`${
                      isActive
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className={`text-[9px] font-medium transition-colors ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
