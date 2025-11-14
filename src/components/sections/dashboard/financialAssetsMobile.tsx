"use client";
import React from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import AssetCard from "./assetCard";
import { useAuthStore } from "@/lib/store/auth";

const FinancialAssetsMobile = () => {
  const { user } = useAuthStore();
  const assets = React.useMemo(() => user?.assets ?? [], [user?.assets]);
  const currencies = React.useMemo(() => user?.currencies ?? [], [user?.currencies]);

  return (
    <div className="sm:hidden flex flex-col">
      <div className="mt-6 grid grid-cols-2 gap-3">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            img={asset.image}
            currency={asset.name}
            amount={asset.balance}
            option={asset.symbol}
            actionType="convert"
            walletId={asset.id}
            userWalletId={asset.user_wallet_id}
            percentageChange={0}
          />
        ))}
      </div>

      <div className="flex justify-center w-full my-4">
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
          <button className="px-6 py-1.5 rounded-md card text-gray-700 dark:text-gray-200 font-medium text-xs flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm">
            <FaArrowDownLong size={12} className="text-teal-500" />
            <span>CONVERT</span>
            <FaArrowDownLong size={12} className="text-teal-500" />
          </button>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {currencies.map((currency) => (
          <AssetCard
            key={currency.id}
            img={currency.image}
            currency={currency.name}
            amount={currency.balance}
            option={currency.symbol}
            actionType="withdraw"
            walletId={currency.id}
            userWalletId={currency.user_wallet_id}
            showPercentage={false}
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialAssetsMobile;
