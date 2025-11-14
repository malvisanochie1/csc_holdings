"use client";
import React from "react";
import { ModeToggle } from "@/components/ui/modetoggle";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuthStore } from "@/lib/store/auth";

const DashboardHeader = () => {
  const { user } = useAuthStore();

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName) return 'U';
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase();
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
        <button className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/50 dark:border-slate-700/50">
          <FaBell className="text-gray-600 dark:text-gray-400 text-base" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ModeToggle />
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 sm:gap-3 pl-3 ml-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl pr-3 py-2 transition-colors group border border-slate-200/50 dark:border-slate-700/50">
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
      </div>
    </div>
  );
};

export default DashboardHeader;
