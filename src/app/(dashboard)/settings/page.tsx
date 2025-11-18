"use client";

import React from "react";
import { Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/modetoggle";
import { LanguageSelect } from "@/components/ui/language-select";
import { useToast } from "@/components/providers/toast-provider";
import { useSettings, useUpdateSettings } from "@/lib/api/settings";
import { useSettingsStore } from "@/lib/store/settings";
import { useAuthStore } from "@/lib/store/auth";
import { getCurrencyFlag } from "@/lib/constants/currencies";
import { getLanguageByCode } from "@/lib/constants/languages";
import { UserCurrency } from "@/lib/types/api";
import Navbar from "@/components/sections/navs/navbar";
import Sidebar from "@/components/sections/navs/sidebar";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const { currentLanguage, setLanguage } = useSettingsStore();
  
  const { data: settingsData, isLoading: settingsLoading } = useSettings();
  const { mutate: updateSettings, isPending: isUpdatingSettings } = useUpdateSettings();

  const [selectedCurrencyId, setSelectedCurrencyId] = React.useState<number | undefined>(
    user?.currency?.id
  );
  const [selectedLanguageCode, setSelectedLanguageCode] = React.useState<string>(
    currentLanguage.code
  );

  // Update local state when user data changes - fix recursion
  React.useEffect(() => {
    if (user?.currency?.id) {
      setSelectedCurrencyId(user.currency.id);
    }
  }, [user?.currency?.id]);

  React.useEffect(() => {
    setSelectedLanguageCode(currentLanguage.code);
  }, [currentLanguage.code]);

  const handleCurrencySelect = async (currency: UserCurrency) => {
    if (!currency.id || isUpdatingSettings) return;

    try {
      await updateSettings({ currency_id: currency.id });
      setSelectedCurrencyId(currency.id);
      showToast({
        type: "success",
        title: "Currency updated successfully",
      });
    } catch (error) {
      const apiError = error as Error & { message?: string };
      showToast({
        type: "error",
        title: "Failed to update currency",
        description: apiError?.message || "Please try again",
      });
    }
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (isUpdatingSettings || languageCode === selectedLanguageCode) return;

    try {
      await updateSettings({ language: languageCode });
      
      // Update language in store immediately
      const newLanguage = getLanguageByCode(languageCode);
      if (newLanguage) {
        setLanguage({
          code: newLanguage.code,
          name: newLanguage.name,
          flag: newLanguage.flag,
        });
      }
      
      setSelectedLanguageCode(languageCode);
      showToast({
        type: "success",
        title: "Language updated successfully",
      });
    } catch (error) {
      const apiError = error as Error & { message?: string };
      showToast({
        type: "error",
        title: "Failed to update language",
        description: apiError?.message || "Please try again",
      });
    }
  };

  if (settingsLoading) {
    return (
      <>
        <Navbar />
        <div className="flex home-bg lg:h-screen">
          <div className="max-w-[240px] w-full hidden xl:flex">
            <Sidebar />
          </div>
          <div className="w-full">
            <div className="w-full home-bg p-3 sm:px-5 md:px-7 lg:px-10">
              <div className="col-span-2 p-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading your dashboard preferences and account settings
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-10">
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <span className="text-muted-foreground">Loading settings...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex home-bg lg:h-screen">
        <div className="max-w-[240px] w-full hidden xl:flex">
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="w-full home-bg p-3 sm:px-5 md:px-7 lg:px-10">
            <div className="col-span-2 p-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your dashboard preferences and account settings
                </p>
              </div>
            </div>
            <div className="mt-5 sm:mt-10">
              <div className="space-y-6">
                {/* Currency Section */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Currency
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select your preferred currency for displaying amounts throughout the platform
                    </p>
                    
                    <div className="max-h-48 overflow-y-auto pr-2 -mr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {settingsData?.currencies?.map((currency) => (
                          <button
                            key={currency.id}
                            onClick={() => handleCurrencySelect(currency)}
                            disabled={isUpdatingSettings}
                            className={`
                              flex items-center gap-2 p-3 rounded-lg border transition-all duration-200
                              ${selectedCurrencyId === currency.id 
                                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-700 dark:text-emerald-300' 
                                : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:border-muted-foreground/20'
                              }
                              ${isUpdatingSettings ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                              relative
                            `}
                          >
                            <div className="text-lg">
                              {getCurrencyFlag(currency.code || '')}
                            </div>
                            <span className="font-medium text-sm">
                              {currency.code}
                            </span>
                            {selectedCurrencyId === currency.id && (
                              <div className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Language Section */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Language
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred language for the interface and content translation
                    </p>
                    
                    <div className="max-w-md">
                      <LanguageSelect
                        value={selectedLanguageCode}
                        onValueChange={handleLanguageSelect}
                        placeholder="Choose your language"
                        disabled={isUpdatingSettings}
                      />
                    </div>
                  </div>
                </Card>

                {/* Theme Section */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Theme
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode for your interface
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                          <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            Appearance
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Toggle between light and dark themes
                          </p>
                        </div>
                      </div>
                      <ModeToggle />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
