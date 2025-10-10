import React from "react";
import AccountOverview from "@/components/sections/dashboard/accountOverview";
import FinancialAssets from "@/components/sections/dashboard/financialAssets";
import RecoveryandTransactionStatus from "@/components/sections/dashboard/recoveryandTransactionStatus";

const page = () => {
  return (

        <div className="flex-1 p-3 sm:p-5 h-full overflow-y-auto">
          <AccountOverview />
          <FinancialAssets />
          <RecoveryandTransactionStatus />
        </div>
  );
};

export default page;
