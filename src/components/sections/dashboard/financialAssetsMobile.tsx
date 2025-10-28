import React from "react";
import { ChevronDown } from "lucide-react";

const financialAssetsMobile = () => {
  return (
    <div>
      <div className="sm:hidden w-full card rounded-lg border border-border p-8 mt-4 sm:mt-">
        <div className="grid grid-cols-3 justify-items-center">
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Gold
          </div>
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Solana
          </div>
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            XRP
          </div>
          <div />
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Etherum
          </div>
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Bitcoin
          </div>
        </div>

        {/* Convert Button */}
        <div className="flex justify-center my-8">
          <div className="border-2 dark:border-gray-500 border-gray-200 px-6 py-2 rounded flex items-center gap-3">
            <ChevronDown className="w-5 h-5 dark:text-gray-300 text-gray-400" />
            <span className="font-bold dark:text-gray-300 text-gray-400 tracking-wider">
              CONVERT
            </span>
            <ChevronDown className="w-5 h-5 dark:text-gray-300 text-gray-400" />
          </div>
        </div>

        {/* Fiat Section */}
        <div className="grid grid-cols-3 justify-items-center">
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            USD
          </div>
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Euro
          </div>
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Pounds
          </div>
          <div />
        </div>
        <div className="grid grid-cols-3 justify-items-center">
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600">
            Yen
          </div>
          <div />
          <div className="w-20 h-20 rounded-full border-2 dark:border-gray-500 border-gray-200 flex items-center justify-center text-sm font-medium dark:text-gray-300 text-gray-600 text-center">
            Bahraini Dinar
          </div>
        </div>
      </div>
    </div>
  );
};

export default financialAssetsMobile;
