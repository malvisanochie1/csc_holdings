"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { BsBank2 } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaCommentsDollar } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";

type NavKey =
  | "dashboard"
  | "profile"
  | "transactions"
  | "notifications"
  | "logout";

interface SidebarProps {
  active?: NavKey;
}

const navItems: {
  key: NavKey;
  label: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <BsBank2 size={14} />,
  },
  {
    key: "profile",
    label: "Profile",
    href: "/profile",
    icon: <FaUser size={14} />,
  },
  {
    key: "transactions",
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: <FaCommentsDollar size={14} />,
  },
  {
    key: "notifications",
    label: "Notifications",
    href: "/notification",
    icon: <FaBell />,
  },
  {
    key: "logout",
    label: "Logout",
    href: "/logout",
    icon: <TbLogout2 size={14} />,
  },
];

export default function Sidebar({ active }: SidebarProps) {
  const pathname = usePathname();

  // infer active key from pathname when active prop isn't provided
  const inferredActive: NavKey = React.useMemo(() => {
    if (!pathname) return "notifications";
    if (pathname.startsWith("/dashboard/transactions")) return "transactions";
    if (pathname.startsWith("/dashboard")) return "dashboard";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname.startsWith("/notification")) return "notifications";
    if (pathname.startsWith("/logout")) return "logout";
    return "notifications";
  }, [pathname]);

  const currentActive = (active ?? inferredActive) as NavKey;
  return (
    <aside className="w-full hidden lg:flex h-full overflow-y-auto min-h-screen border-r border-gray-200 px-6 py-6 flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="CSC logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div>
            <div className="text-sm font-semibold">
              CSC ESCROW &amp; SETTLEMENT
            </div>
            <div className="text-xs text-gray-500">UK LIMITED</div>
          </div>
        </div>

        <nav aria-label="Main navigation" className="space-y-3">
          {navItems.map((item) => {
            const isActive = item.key === currentActive;
            const linkClass = `flex items-center gap-3 p-2 rounded-lg transition-all duration-150 group ${
              isActive
                ? "bg-white shadow-md ring-1 ring-gray-200"
                : "hover:bg-white/50"
            }`;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={linkClass}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-md ${
                    isActive
                      ? "bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white"
                      : "bg-white/60 text-[#6D28D9] group-hover:bg-[#f3e8ff]"
                  }`}
                >
                  <span className={`w-5 h-5 ${isActive ? "" : "opacity-90"}`}>
                    {item.icon}
                  </span>
                </span>

                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 bg-gradient-to-br from-teal-400 to-indigo-600 text-white">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-white/20 rounded-full p-2">
                {/* small icon */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm font-semibold">Asset Recovery Portal</div>
            <div className="mt-3">
              <button className="w-full inline-flex items-center justify-center gap-2 bg-white text-orange-600 rounded-md py-2 text-xs font-semibold">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 21h22L12 2 1 21z" fill="#FB923C" />
                  <path
                    d="M12 16v-4"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                UNVERIFIED ACCOUNT
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
