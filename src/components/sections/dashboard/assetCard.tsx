"use client";
import React from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdMoreVert } from "react-icons/md";
import InsufficientBalance from "../../modals/withdrawal/insufficientBalance";

interface AssetCardProps {
  img: string;
  currency: string;
  amount: number;
  option: string;
  className?: string;
  percentageChange?: number;
  showPercentage?: boolean;
}

const AssetCard = ({
  img,
  currency,
  amount,
  option,
  className = "",
  percentageChange = 0,
  showPercentage = true,
}: AssetCardProps) => {
  const isNegative = percentageChange < 0;

  return (
    <div
      className={`card p-3 flex flex-col justify-between min-h-[100px] ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Image
            width={20}
            height={20}
            src={img}
            alt={currency}
            className="rounded-full w-5 h-5 object-cover"
          />
          <span className="text-gray-700 dark:text-white font-medium text-sm">
            {currency}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:ring-0 focus:border-0 focus:outline-none cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <MdMoreVert size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={(e: Event) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <InsufficientBalance triggerText={option === "convert" ? "Convert" : "Withdraw"} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-col">
        <div className="text-gray-800 dark:text-white text-lg font-bold mb-0.5">
          ${amount.toLocaleString()}
        </div>
        {showPercentage && percentageChange !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
            <span>{isNegative ? '▼' : '▲'}</span>
            <span>{Math.abs(percentageChange)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
