"use client";

import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Bitcoin, Building2, ChevronDown } from "lucide-react";
import { withdrawalMethods, cryptoOptions, type WithdrawalMethodKey, type CryptoOption } from "@/lib/constants/withdrawal";
import { cn } from "@/lib/utils";

interface WithdrawalRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: WithdrawalFormData) => void;
  trigger?: React.ReactNode;
}

export interface WithdrawalFormData {
  amount: number;
  method: WithdrawalMethodKey;
  network?: string;
  walletAddress?: string;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
}

const WithdrawalRequestModal = ({ open, onOpenChange, onSubmit, trigger }: WithdrawalRequestModalProps) => {
  const [selectedMethod, setSelectedMethod] = React.useState<WithdrawalMethodKey>("crypto");
  const [selectedCrypto, setSelectedCrypto] = React.useState<CryptoOption>(cryptoOptions[0]);
  const [amount, setAmount] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");
  const [showCryptoDropdown, setShowCryptoDropdown] = React.useState(false);
  const [bankDetails, setBankDetails] = React.useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: WithdrawalFormData = {
      amount: parseFloat(amount),
      method: selectedMethod,
    };

    if (selectedMethod === "crypto") {
      formData.network = selectedCrypto.network;
      formData.walletAddress = walletAddress;
    } else {
      formData.bankDetails = bankDetails;
    }

    onSubmit?.(formData);
  };

  const isValid = () => {
    if (!amount || parseFloat(amount) <= 0) return false;
    
    if (selectedMethod === "crypto") {
      return walletAddress.trim().length > 0;
    } else {
      return bankDetails.accountName && bankDetails.accountNumber && bankDetails.bankName;
    }
  };

  return (
    <>
      {trigger && (
        <div onClick={() => onOpenChange(true)}>
          {trigger}
        </div>
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Fund Withdrawal
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Method Selection Tabs */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2">
                  {withdrawalMethods.map((method) => (
                    <button
                      key={method.key}
                      type="button"
                      className={cn(
                        "flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold transition-colors",
                        selectedMethod === method.key
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => setSelectedMethod(method.key)}
                    >
                      {method.key === "crypto" ? (
                        <Bitcoin className="h-5 w-5" />
                      ) : (
                        <Building2 className="h-5 w-5" />
                      )}
                      {method.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction Amount (£)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="6777"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {/* Crypto or Bank specific fields */}
                {selectedMethod === "crypto" ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Cryptocurrency
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 text-left",
                          "bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600",
                          "rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        )}
                        onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                      >
                        <div className="flex items-center gap-2">
                          <Image src={selectedCrypto.icon} alt={selectedCrypto.name} width={20} height={20} className="w-5 h-5" />
                          <span className="text-sm font-medium">{selectedCrypto.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      
                      {showCryptoDropdown && (
                        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                          {cryptoOptions.map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => {
                                setSelectedCrypto(option);
                                setShowCryptoDropdown(false);
                              }}
                            >
                              <Image src={option.icon} alt={option.name} width={20} height={20} className="w-5 h-5" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{option.name}</div>
                                <div className="text-xs text-gray-500">{option.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Transfer Type
                    </Label>
                    <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium">Bank Transfer</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Method-specific form fields */}
              {selectedMethod === "crypto" ? (
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedCrypto.name} Address
                  </Label>
                  <Input
                    id="walletAddress"
                    placeholder="Enter your wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 font-mono text-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Make sure this address supports {selectedCrypto.name} on {selectedCrypto.network} network
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account Holder Name
                      </Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        value={bankDetails.accountName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountName: e.target.value }))}
                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        placeholder="12345678"
                        value={bankDetails.accountNumber}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        placeholder="HSBC Bank"
                        value={bankDetails.bankName}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sort Code / Routing
                      </Label>
                      <Input
                        id="routingNumber"
                        placeholder="12-34-56"
                        value={bankDetails.routingNumber}
                        onChange={(e) => setBankDetails(prev => ({ ...prev, routingNumber: e.target.value }))}
                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={!isValid()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WithdrawalRequestModal;