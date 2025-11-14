"use client";
import React from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import FinancialAssetsMobile from "./financialAssetsMobile";
import AssetCard from "./assetCard";
import { useAuthStore } from "@/lib/store/auth";

const FinancialAssets = () => {
  const { user } = useAuthStore();

  // Get user's assets (crypto/precious metals) and currencies (fiat)
  const userAssets = user?.assets || [];
  const userCurrencies = user?.currencies || [];

  return (
    <>
      <div className="sm:flex flex-col hidden">
        {/* Crypto Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {userAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              img={asset.image}
              currency={asset.name}
              amount={asset.balance}
              option={asset.symbol}
              actionType="convert"
              walletId={asset.id}
              userWalletId={asset.user_wallet_id}
              percentageChange={0} // API doesn't provide this, could be calculated
              showPercentage={true}
              className="" // Default styling
            />
          ))}
        </div>

        {/* Convert Section */}
        <div className="flex justify-center w-full my-4">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
            <button className="px-6 py-1.5 rounded-md card text-gray-700 dark:text-gray-200 font-medium text-xs flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaArrowDownLong size={12} className="text-teal-500" />
              <span>CONVERT</span>
              <FaArrowDownLong size={12} className="text-teal-500" />
            </button>
            <div className="h-[1px] w-20 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
          </div>
        </div>

        {/* Fiat Currencies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {userCurrencies.map((currency) => (
            <AssetCard
              key={currency.id}
              img={currency.image}
              currency={currency.name}
              amount={typeof currency.balance === "number" ? currency.balance : 0}
              option={currency.symbol}
              actionType="withdraw"
              walletId={currency.id}
              userWalletId={currency.user_wallet_id}
              showPercentage={false}
              className="" // Default styling
            />
          ))}
        </div>
      </div>
      <FinancialAssetsMobile />
    </>
  );
};

export default FinancialAssets;
