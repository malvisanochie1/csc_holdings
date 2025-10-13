"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { NavKey, navItems } from "../../text/csc";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

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
    if (!pathname) return "notifications";
    if (pathname.startsWith("/dashboard/transactions")) return "transactions";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/notification")) return "notifications";
    if (pathname.startsWith("/logout")) return "logout";
    return "notifications";
  }, [pathname]);

  const renderNavLinks = (isMobile = false) =>
    navItems.map((item) => {
      const isActive = item.key === inferredActive;
      const commonClasses =
        "text-sm font-medium transition-colors duration-150";
      const desktopClasses = isActive
        ? "text-gray-900"
        : "text-gray-600 hover:text-gray-900";
      const mobileClasses = isActive
        ? "bg-white text-gray-900"
        : "text-gray-600 hover:bg-gray-50";
      return (
        <Link
          key={item.key}
          href={item.href}
          className={
            isMobile
              ? `block px-3 py-2 rounded-md ${mobileClasses} ${commonClasses}`
              : `${desktopClasses} ${commonClasses}`
          }
          aria-current={isActive ? "page" : undefined}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <section className="w-full">
      <header className="w-full border-gray-200 bg-white hidden sm:flex xl:hidden">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/">
                <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png"
                    alt="CSC logo"
                    width={100}
                    height={100}
                    className="w-10 md:w-20 h-10 md:h-20 object-contain"
                  />
                  <div className="hidden sm:block text-sm font-semibold">
                    CSC ESCROW &amp; SETTLEMENT UK LTD
                  </div>
                </div>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 md:hidden rounded-md text-gray-700 hover:bg-white/60"
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
            className={`absolute left-0 right-0 z-40 bg-white shadow-lg  transition-all duration-200 origin-top transform ${
              open
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <nav className="px-2 pb-4 space-y-1">{renderNavLinks(true)}</nav>
          </div>
        </div>
      </header>
      {/* mobile nave */}
      <div
        className="fixed inset-x-0 bottom-0 px-2 pt-3 pb-5 bg-white z-50 hover:nav-blue-bg hover:text-white nav-blue-text sm:hidden"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="flex items-baseline justify-between pb-2">
          {navItems.map((user) => {
            const isActive = user.key === inferredActive;
            return (
              <li key={user.key}>
                <Link href={user.href}>
                  <span
                    className={`mx-auto ${isActive ? "text-[#3E2BCE]/50" : ""}`}
                  >
                    {user.icon}{" "}
                  </span>
                  <div
                    className={`text-center text-[10px] sm:text-sm ${
                      isActive ? "text-[#3E2BCE]/50" : ""
                    }`}
                  >
                    {" "}
                    {user.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
