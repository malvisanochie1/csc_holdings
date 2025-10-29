import React from "react";
import AccountOverview from "@/components/sections/dashboard/accountOverview";
import FinancialAssets from "@/components/sections/dashboard/financialAssets";
import RecoveryandTransactionStatus from "@/components/sections/dashboard/recoveryandTransactionStatus";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import PaymentSuccessful from "@/components/modals/withdrawal/paymentSuccessful";
import DashboardHeader from "@/components/sections/dashboard/dashboardHeader";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="flex home-bg h-screen overflow-hidden">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar />
        </div>
        <div className="w-full flex flex-col overflow-hidden">
          <div className="sticky top-0 z-40 bg-[#CFD5DC] dark:bg-slate-900 px-3 sm:px-5 pt-3 sm:pt-5 flex-shrink-0">
            <DashboardHeader />
          </div>
          <div className="flex-1 px-3 sm:px-5 pb-24 sm:pb-5 overflow-y-auto">
            <PaymentSuccessful />
            <AccountOverview />
            <FinancialAssets />
            <RecoveryandTransactionStatus />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
