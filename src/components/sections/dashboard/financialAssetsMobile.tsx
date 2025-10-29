"use client";
import React from "react";
import { account_assets, account_currency } from "@/components/text/csc";
import { FaArrowDownLong } from "react-icons/fa6";
import AssetCard from "./assetCard";

const FinancialAssetsMobile = () => {
  // Crypto assets: Gold, Solana, XRP, Ethereum, Bitcoin
  const gold = account_assets.find(a => a.currency === "Gold");
  const bitcoin = account_assets.find(a => a.currency === "Bitcoin");
  const ethereum = account_assets.find(a => a.currency === "Ethereum");
  const xrp = account_assets.find(a => a.currency === "XRP");
  const solana = account_assets.find(a => a.currency === "Solana");

  // Fiat currencies: USD, Euro, Pounds, Yen, Bahraini Dinar
  const usd = account_currency.find(c => c.currency === "USD");
  const euro = account_currency.find(c => c.currency === "Euro");
  const pounds = account_currency.find(c => c.currency === "Pounds");
  const yen = account_currency.find(c => c.currency === "Yen");
  const dirham = account_currency.find(c => c.currency === "Bahraini Dinar");

  return (
    <>
      <div className="sm:hidden flex flex-col">
        {/* Crypto Assets Section */}
        <div className="mt-6 space-y-3">
          {/* Gold - Full Width */}
          {gold && (
            <AssetCard
              img={gold.img}
              currency={gold.currency}
              amount={gold.amount}
              option={gold.option}
              percentageChange={gold.percentageChange}
            />
          )}

          {/* Bitcoin and Ethereum - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {bitcoin && (
              <AssetCard
                img={bitcoin.img}
                currency={bitcoin.currency}
                amount={bitcoin.amount}
                option={bitcoin.option}
                percentageChange={bitcoin.percentageChange}
              />
            )}
            {ethereum && (
              <AssetCard
                img={ethereum.img}
                currency={ethereum.currency}
                amount={ethereum.amount}
                option={ethereum.option}
                percentageChange={ethereum.percentageChange}
              />
            )}
          </div>

          {/* XRP and Solana - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {xrp && (
              <AssetCard
                img={xrp.img}
                currency={xrp.currency}
                amount={xrp.amount}
                option={xrp.option}
                percentageChange={xrp.percentageChange}
              />
            )}
            {solana && (
              <AssetCard
                img={solana.img}
                currency={solana.currency}
                amount={solana.amount}
                option={solana.option}
                percentageChange={solana.percentageChange}
              />
            )}
          </div>
        </div>

        {/* Convert Button - Classy like desktop */}
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

        {/* Fiat Currencies Section */}
        <div className="space-y-3">
          {/* USD - Full Width */}
          {usd && (
            <AssetCard
              img={usd.img}
              currency={usd.currency}
              amount={usd.amount}
              option={usd.option}
              showPercentage={false}
            />
          )}

          {/* Euro and Pound - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {euro && (
              <AssetCard
                img={euro.img}
                currency={euro.currency}
                amount={euro.amount}
                option={euro.option}
                showPercentage={false}
              />
            )}
            {pounds && (
              <AssetCard
                img={pounds.img}
                currency={pounds.currency}
                amount={pounds.amount}
                option={pounds.option}
                showPercentage={false}
              />
            )}
          </div>

          {/* Yen and Dirham - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {yen && (
              <AssetCard
                img={yen.img}
                currency={yen.currency}
                amount={yen.amount}
                option={yen.option}
                showPercentage={false}
              />
            )}
            {dirham && (
              <AssetCard
                img={dirham.img}
                currency={dirham.currency}
                amount={dirham.amount}
                option={dirham.option}
                showPercentage={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialAssetsMobile;
