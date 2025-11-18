"use client";

import React from "react";
import { UserCurrency } from "@/lib/types/api";
import { getCurrencyFlag } from "@/lib/constants/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectProps {
  currencies: UserCurrency[];
  value?: number;
  onValueChange: (currencyId: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CurrencySelect({
  currencies,
  value,
  onValueChange,
  placeholder = "Select currency",
  disabled = false,
}: CurrencySelectProps) {
  const selectedCurrency = currencies.find((c) => c.id === value);

  return (
    <Select
      value={value?.toString() || ""}
      onValueChange={(val) => onValueChange(parseInt(val, 10))}
      disabled={disabled}
    >
      <SelectTrigger className="w-full border-border">
        <SelectValue placeholder={placeholder}>
          {selectedCurrency && (
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getCurrencyFlag(selectedCurrency.code || "")}
              </span>
              <span className="font-medium">{selectedCurrency.code}</span>
              <span className="text-muted-foreground">
                {selectedCurrency.name}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.id} value={currency.id?.toString() || ""}>
            <div className="flex items-center gap-2 w-full">
              <span className="text-lg">
                {getCurrencyFlag(currency.code || "")}
              </span>
              <span className="font-medium min-w-[50px]">{currency.code}</span>
              <span className="text-muted-foreground flex-1">
                {currency.name}
              </span>
              <span className="text-sm text-muted-foreground">
                {currency.symbol}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}