"use client";

import { useState } from "react";
import { Globe, Moon, DollarSign, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/modetoggle";

import * as React from "react";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("language", language);
    localStorage.setItem("theme", theme);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancel = () => {
    setCurrency(localStorage.getItem("currency") || "USD");
    setLanguage(localStorage.getItem("language") || "en");
    setTheme(localStorage.getItem("theme") || "light");
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <Card className="p-6 border border-border hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Currency
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred currency for transactions
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 ml-16">
              <Label
                htmlFor="currency"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Select Currency
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger
                  id="currency"
                  className="w-full md:w-64 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Language
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language for the interface
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 ml-16">
              <Label
                htmlFor="language"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Select Language
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger
                  id="language"
                  className="w-full md:w-64 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg flex-shrink-0">
                  <Moon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Theme
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 ml-16">
              <Label
                htmlFor="theme"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Select Theme
              </Label>
              {/* <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger
                  id="theme"
                  className="w-full md:w-64 border-border"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>{" "}
            </div>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="flex-1 md:flex-none border-border text-foreground hover:bg-muted bg-background px-6 rounded-lg flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
        </div>

        {/* {isSaved && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <p className="text-sm text-emerald-900 dark:text-emerald-100">
              ✓ <span className="font-semibold">Success!</span> Your settings
              have been saved successfully.
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
