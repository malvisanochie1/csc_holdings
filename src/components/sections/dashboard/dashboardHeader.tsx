"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/modetoggle";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuthStore } from "@/lib/store/auth";
import type { UserNotification } from "@/lib/types/api";
import { useLogout } from "@/lib/api/auth";

const DashboardHeader = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'U';
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const notifications = useMemo(
    () => (Array.isArray(user?.notifications) ? (user?.notifications as UserNotification[]) : []),
    [user?.notifications]
  );

  const pendingNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.read_at && !(notification as { read?: boolean }).read
      ),
    [notifications]
  );

  const unreadCount = pendingNotifications.length;

  const handleProfileNavigate = () => {
    router.push("/profile");
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="card p-4 mb-3 flex items-center justify-between">
      {/* Welcome Section */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
          Hi <span className="text-gray-900 dark:text-white font-bold">
            {user?.first_name || 'User'}
          </span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">
          Account ID: {user?.account_id || '2322433'}
        </p>
      </div>

      {/* Right Section - Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-700/50"
          >
            <FaBell className="text-gray-600 dark:text-gray-400 text-base" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] rounded-full bg-rose-500 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Pending Notifications
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount > 0
                    ? `You have ${unreadCount} pending ${unreadCount === 1 ? "notification" : "notifications"}`
                    : "No pending notifications"}
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {unreadCount === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No pending notifications
                  </div>
                )}
                {pendingNotifications.map((notification) => {
                  const dataPayload =
                    notification.data && typeof notification.data === "object"
                      ? (notification.data as Record<string, unknown>)
                      : null;
                  const title =
                    notification.title ||
                    (dataPayload && typeof dataPayload["title"] === "string"
                      ? (dataPayload["title"] as string)
                      : "Account Update");
                  const message =
                    notification.message ||
                    (dataPayload && typeof dataPayload["message"] === "string"
                      ? (dataPayload["message"] as string)
                      : "");

                  return (
                    <div
                      key={notification.id}
                      className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300"
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {title}
                      </p>
                      {message && (
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ModeToggle />
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 sm:gap-3 pl-3 ml-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl pr-3 py-2 transition-colors group border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="text-right hidden lg:block">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {user ? `${user.first_name} ${user.last_name}` : 'User'}
              </p>
              <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                {getUserInitials(user?.first_name, user?.last_name)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>
            <MdKeyboardArrowDown className="text-gray-400 text-sm hidden sm:block" />
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-200/70 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={handleProfileNavigate}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 disabled:cursor-not-allowed"
              >
                Logout
                {isLoggingOut && (
                  <span className="text-[10px] uppercase tracking-wide text-rose-400">
                    ...
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
