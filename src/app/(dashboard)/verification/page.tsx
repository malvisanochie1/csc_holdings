import React from "react";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";
import KycVerificationCenter from "@/components/sections/verification/kyc-center";

const VerificationPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex home-bg min-h-screen lg:h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="w-full home-bg p-3 sm:px-5 md:px-7 lg:px-10">
            <div className="col-span-2 p-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Verification Center</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete your identity verification to unlock all platform features.
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-10">
              <KycVerificationCenter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationPage;
