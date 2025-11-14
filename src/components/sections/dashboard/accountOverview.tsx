"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert, MdDiamond } from "react-icons/md";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { Withdraw } from "../withdraw/withdraw";
import { useAuthStore } from "@/lib/store/auth";

const AccountOverview = () => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Format numbers for display
  const formatCurrency = (value: number | undefined) => {
    if (typeof value === 'undefined' || value === null) return '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
        {/* Total Asset Value */}
        <div className="card p-5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <Image
              src="/dashboard/asset.png"
              alt="Total Asset"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Total Asset Value</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Current Re-Claimed Funds</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">$ {formatCurrency(user?.total_asset_val)}</h2>
        </div>

        {/* Available Balance FIAT */}
        <div className="card p-5 flex flex-col items-center text-center relative">
          <DropdownMenu>
            <DropdownMenuTrigger className="absolute top-4 right-4 focus:ring-0 focus:outline-none cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <MdMoreVert size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div onClick={(e) => e.stopPropagation()}>
                  <Withdraw />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 shadow-sm border border-blue-100 dark:border-blue-800/30">
            <Image
              src="/dashboard/fiat.png"
              alt="Available Balance"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Av. BAL FIAT</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">FIAT</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">$ {formatCurrency(user?.total_fiat_val)}</h2>
        </div>

        {/* Award Winning Escrow Services - Toggleable */}
        <div
          className="card relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-blue-600 dark:from-teal-600 dark:to-blue-800"></div>

          <div className="relative p-5 text-white">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <MdDiamond className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white">Award Winning Escrow Services</h3>
              </div>
              <button className="text-white/80 hover:text-white transition-colors">
                {isExpanded ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
              </button>
            </div>

            {isExpanded && (
              <div className="mt-3 pt-3 border-t border-white/20 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-white/90 leading-relaxed">
                  Your funds re-claim and recovery journey is very important to us.
                  Trust us to put your priorities first in getting back your money.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountOverview;
