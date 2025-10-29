"use client";
import React from "react";
import { ModeToggle } from "@/components/ui/modetoggle";
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
      {/* Welcome Section */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
          Good morning, <span className="text-gray-900 dark:text-white font-bold">John</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right Section - Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <FaBell className="text-gray-600 dark:text-gray-400 text-base" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>

        {/* Theme Toggle */}
        <div className="hidden sm:block">
          <ModeToggle />
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 ml-2 sm:ml-3 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg pr-2 py-1.5 transition-colors group">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-semibold text-gray-900 dark:text-white">John Doe</p>
            <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">ACMCT3IRDL1</p>
          </div>
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              JD
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
