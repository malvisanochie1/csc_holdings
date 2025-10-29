"use client";
import React from "react";
import { account_assets, account_currency } from "@/components/text/csc";
import { FaArrowDownLong } from "react-icons/fa6";
import FinancialAssetsMobile from "./financialAssetsMobile";
import AssetCard from "./assetCard";

const financialAssets = () => {
  return (
    <>
      <div className="sm:flex flex-col hidden">
        {/* Crypto Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {account_assets.map((item, idx) => (
            <AssetCard
              key={idx}
              img={item.img}
              currency={item.currency}
              amount={item.amount}
              option={item.option}
              percentageChange={item.percentageChange}
              showPercentage={true}
              className={item.className}
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
          {account_currency.map((item, idx) => (
            <AssetCard
              key={idx}
              img={item.img}
              currency={item.currency}
              amount={item.amount}
              option={item.option}
              showPercentage={false}
              className={item.className}
            />
          ))}
        </div>
      </div>
      <FinancialAssetsMobile />
    </>
  );
};

export default financialAssets;
