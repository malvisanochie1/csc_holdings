"use client";
import React from "react";
import { FaArrowDownLong } from "react-icons/fa6";
import FinancialAssetsMobile from "./financialAssetsMobile";
import AssetCard from "./assetCard";
import { useAuthStore } from "@/lib/store/auth";
import { useAssetStore } from "@/lib/store/assets";
import { useAssetWebsocket } from "@/hooks/use-asset-websocket";
import { computeAssetRealtimeMetrics } from "@/lib/assets";

export type DashboardAssetCard = {
  id?: string;
  img: string;
  currency: string;
  option: string;
  amount: number;
  walletId?: string;
  userWalletId?: string;
  changePercent?: number;
};

const FinancialAssets = () => {
  const { user } = useAuthStore();
  const wallets = useAssetStore((state) => state.wallets);
  useAssetWebsocket();

  // Get user's assets (crypto/precious metals) and currencies (fiat)
  const userAssets = React.useMemo(() => user?.assets ?? [], [user?.assets]);
  const userCurrencies = React.useMemo(
    () => user?.currencies ?? [],
    [user?.currencies]
  );

  const assetCards: DashboardAssetCard[] = React.useMemo(() => {
    const defaultImage = "/dashboard/asset.gif";
    return userAssets.map((asset) => {
      const metrics = computeAssetRealtimeMetrics(asset, wallets);
      const changePercent =
        typeof metrics.wallet?.changePercent24h === "number"
          ? metrics.wallet.changePercent24h
          : undefined;

      const assetId = (asset as { id?: string })?.id;
      const assetImage: string =
        (asset as { image?: string })?.image ?? defaultImage;
      const assetName: string =
        (asset as { name?: string })?.name ||
        (asset as { symbol?: string })?.symbol ||
        "Asset";
      const assetOption: string =
        (asset as { sym?: string })?.sym ||
        (asset as { symbol?: string })?.symbol ||
        assetName;

      return {
        id: assetId ?? assetName,
        img: assetImage,
        currency: assetName,
        option: assetOption,
        walletId: (asset as { id?: string })?.id,
        userWalletId: (asset as { user_wallet_id?: string })?.user_wallet_id,
        amount: metrics.realtimeValue,
        changePercent,
      };
    });
  }, [userAssets, wallets]);

  return (
    <>
      <div className="sm:flex flex-col hidden">
        {/* Crypto Assets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {assetCards.map((asset) => (
            <AssetCard
              key={asset.id}
              img={asset.img}
              currency={asset.currency}
              amount={asset.amount}
              option={asset.option}
              actionType="convert"
              walletId={asset.walletId}
              userWalletId={asset.userWalletId}
              percentageChange={asset.changePercent}
              showPercentage={typeof asset.changePercent === "number"}
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
      <FinancialAssetsMobile assets={assetCards} currencies={userCurrencies} />
    </>
  );
};

export default FinancialAssets;
