"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert, MdDiamond } from "react-icons/md";
import { BiWallet, BiLineChart } from "react-icons/bi";
import { Withdraw } from "../withdraw/withdraw";

const accountOverview = () => {
  return (
    <>
      {/* Main Stats Row - Desktop */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
        {/* Total Asset Value */}
        <div className="card p-4 flex flex-col items-center text-center">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3">
            <BiLineChart className="text-white text-xl" />
          </div>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2">Total Asset Value</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$10,000</h2>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Re-Claimed Funds</p>
        </div>

        {/* Available Balance */}
        <div className="card p-4 flex flex-col items-center text-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-3 right-3 focus:ring-0 focus:outline-none cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MdMoreVert size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div onClick={(e) => e.stopPropagation()}>
                  <Withdraw />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
            <BiWallet className="text-white text-xl" />
          </div>
          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2">Available Balance</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">$0</h2>
          <p className="text-[10px] text-blue-600 dark:text-blue-400">✓ Eligible for Withdrawal</p>
        </div>

        {/* Award Winning Escrow */}
        <div className="card p-4 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-xl"></div>

          <div className="relative flex flex-col items-center">
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20 mb-3">
              <MdDiamond className="text-white text-xl" />
            </div>
            <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-2">Award Winning</p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Escrow Services</h2>
            <p className="text-[10px] text-gray-600 dark:text-gray-300">Secure • Transparent</p>
          </div>
        </div>
      </div>

      {/* Main Stats Row - Mobile (Compact) */}
      <div className="sm:hidden grid grid-cols-2 gap-3 pb-4">
        {/* Total Asset Value */}
        <div className="card p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/20">
              <BiLineChart className="text-white text-sm" />
            </div>
            <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400">Total Assets</p>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">$10,000</h2>
          <p className="text-[9px] text-emerald-600 dark:text-emerald-400">Re-Claimed</p>
        </div>

        {/* Available Balance */}
        <div className="card p-3 relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-2 right-2 focus:ring-0 focus:outline-none cursor-pointer text-gray-400 dark:text-gray-500">
              <MdMoreVert size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div onClick={(e) => e.stopPropagation()}>
                  <Withdraw />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20">
              <BiWallet className="text-white text-sm" />
            </div>
            <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400">Available</p>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-0.5">$0</h2>
          <p className="text-[9px] text-blue-600 dark:text-blue-400">✓ Withdraw</p>
        </div>

        {/* Award Winning Escrow - Full Width on Mobile */}
        <div className="card p-3 col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-xl"></div>

          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-sm shadow-purple-500/20">
              <MdDiamond className="text-white text-sm" />
            </div>
            <div>
              <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400">Award Winning</p>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Escrow Services</h2>
            </div>
            <p className="text-[9px] text-gray-600 dark:text-gray-300 ml-auto">Secure • Transparent</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default accountOverview;
