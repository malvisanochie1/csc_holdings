"use client";
import React from "react";
import AccountOverview from "@/components/sections/dashboard/accountOverview";
import FinancialAssets from "@/components/sections/dashboard/financialAssets";
import RecoveryandTransactionStatus from "@/components/sections/dashboard/recoveryandTransactionStatus";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import { ConversionRequestWatcher } from "@/components/modals/convert/conversionRequestWatcher";
import { WithdrawalStageWatcher } from "@/components/modals/withdrawal/withdrawalStageWatcher";
import DashboardHeader from "@/components/sections/dashboard/dashboardHeader";
import { useAuthStore } from "@/lib/store/auth";

const DashboardPage = () => {
  const { _hasHydrated } = useAuthStore();

  // Show minimal loading state while Zustand hydrates
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen home-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex home-bg h-screen overflow-hidden">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
          <div className="sticky top-0 z-40 home-bg px-3 sm:px-5 pt-3 sm:pt-5 flex-shrink-0">
            <DashboardHeader />
          </div>
          <div className="flex-1 px-3 sm:px-5 pb-24 sm:pb-5 overflow-y-auto">
            <ConversionRequestWatcher />
            <WithdrawalStageWatcher />
            <AccountOverview />
            <FinancialAssets />
            <RecoveryandTransactionStatus />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
