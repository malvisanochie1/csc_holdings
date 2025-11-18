"use client";
import React from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import AssetCard from "./assetCard";
import type { DashboardAssetCard } from "./financialAssets";

interface CurrencySummary {
  id?: string;
  image?: string;
  name?: string;
  balance?: number | string;
  symbol?: string;
  user_wallet_id?: string;
}

interface FinancialAssetsMobileProps {
  assets: DashboardAssetCard[];
  currencies: CurrencySummary[];
}

const FinancialAssetsMobile = ({
  assets,
  currencies,
}: FinancialAssetsMobileProps) => {
  return (
    <div className="sm:hidden flex flex-col">
      <div className="mt-6 grid grid-cols-2 gap-3">
        {assets.map((asset, index) => {
          const isLast = index === assets.length - 1;
          const shouldSpan = assets.length % 2 === 1 && isLast;
          return (
          <AssetCard
            key={asset.id}
            img={asset.img}
            currency={asset.currency}
            amount={asset.amount}
            option={asset.option}
            actionType="convert"
            walletId={asset.id}
            userWalletId={asset.userWalletId}
            percentageChange={asset.changePercent}
            showPercentage={typeof asset.changePercent === "number"}
            className={shouldSpan ? "col-span-2" : ""}
          />
        );
        })}
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
        {currencies.map((currency, index) => {
          const image = currency.image ?? "/dashboard/asset.gif";
          const label = currency.name ?? currency.symbol ?? "Wallet";
          const symbol = currency.symbol ?? "";
          const amount =
            typeof currency.balance === "number"
              ? currency.balance
              : currency.balance ?? 0;
          const isLast = index === currencies.length - 1;
          const shouldSpan = currencies.length % 2 === 1 && isLast;

          return (
            <AssetCard
              key={currency.id}
              img={image}
              currency={label}
              amount={amount}
              option={symbol}
              actionType="withdraw"
              walletId={currency.id}
              userWalletId={currency.user_wallet_id}
              showPercentage={false}
              className={shouldSpan ? "col-span-2" : ""}
            />
          );
        })}
      </div>
    </div>
  );
};

export default FinancialAssetsMobile;
