import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { withdrawalMethodTabs, type WithdrawalMethodKey } from "@/components/text/withdrawal";
import type { CurrencyAsset } from "@/lib/types/api";

interface WithdrawalMethodSelectionModalProps {
  wallet?: CurrencyAsset;
  availableBalanceLabel: string;
  onSelectMethod: (method: WithdrawalMethodKey) => void;
  onNext: () => void; // Callback to proceed to the next stage
}

const WithdrawalMethodSelectionModal: React.FC<WithdrawalMethodSelectionModalProps> = ({
  wallet,
  availableBalanceLabel,
  onSelectMethod,
  onNext,
}) => {
  const [selectedMethod, setSelectedMethod] = React.useState<WithdrawalMethodKey | undefined>(undefined);

  return (
    <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
      <div className="space-y-3">
        {withdrawalMethodTabs.map((item) => {
          const isActive = selectedMethod === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={cn(
                "w-full rounded-xl border px-4 py-3 text-left transition cursor-pointer",
                isActive
                  ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-500/10"
                  : "border-gray-100 bg-white hover:border-gray-200 dark:border-white/10 dark:bg-gray-900"
              )}
              onClick={() => setSelectedMethod(item.key)}
            >
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        {wallet && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-white/10 dark:bg-gray-900">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Available balance</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
              {wallet.symbol ?? "$"} {availableBalanceLabel}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{wallet.name}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            className="cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500"
            onClick={() => {
              if (selectedMethod) {
                onSelectMethod(selectedMethod);
                onNext();
              }
            }}
            disabled={!selectedMethod}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalMethodSelectionModal;
