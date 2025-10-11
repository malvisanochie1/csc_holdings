import React from "react";
import AccountOverview from "@/components/sections/dashboard/accountOverview";
import FinancialAssets from "@/components/sections/dashboard/financialAssets";
import RecoveryandTransactionStatus from "@/components/sections/dashboard/recoveryandTransactionStatus";
import RecoveryPortal from "@/components/sections/recoveryPortal";

const page = () => {
  return (
    <div className="flex-1 p-3 sm:p-5 h-full overflow-y-auto">
      <div className="lg:hidden pb-4">
        <RecoveryPortal />
      </div>
      <AccountOverview />
      <FinancialAssets />
      <RecoveryandTransactionStatus />
    </div>
  );
};

export default page;
