import React from "react";
import AccountOverview from "@/components/sections/dashboard/accountOverview";
import FinancialAssets from "@/components/sections/dashboard/financialAssets";
import RecoveryandTransactionStatus from "@/components/sections/dashboard/recoveryandTransactionStatus";
import RecoveryPortal from "@/components/sections/recoveryPortal";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import PaymentSuccessful from "@/components/modals/withdrawal/paymentSuccessful";

const page = () => {
  return (
    <>
      {/*<Navbar />*/}
      <div className="flex home-bg lg:h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="flex-1 p-3 sm:p-5 h-full overflow-y-auto">
            <div className="lg:hidden pb-4">
              <RecoveryPortal />
            </div>
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
