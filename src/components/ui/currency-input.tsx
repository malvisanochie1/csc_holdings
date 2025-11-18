"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value?: string | number;
  onValueChange?: (numericValue: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export function CurrencyInput({
  value = "",
  onValueChange,
  placeholder = "0.00",
  className,
  disabled = false,
  readOnly = false,
}: CurrencyInputProps) {
  const { user } = useAuthStore();
  const [displayValue, setDisplayValue] = React.useState("");

  // Get currency code for display
  const currencyCode = user?.currency?.code || "USD";

  // Extract numeric value from formatted string
  const extractNumericValue = React.useCallback((formattedValue: string) => {
    // Remove all non-numeric characters except decimal point
    const cleaned = formattedValue.replace(/[^0-9.]/g, "");
    
    // Handle multiple decimal points - keep only the first one
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    
    return cleaned;
  }, []);

  // Update display value when prop value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(String(value));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || disabled) return;
    
    const inputValue = e.target.value;
    const numericValue = extractNumericValue(inputValue);
    
    // Update display with clean numeric value (user types in their currency)
    setDisplayValue(numericValue);
    
    // Call callback with numeric value for API
    onValueChange?.(numericValue);
  };

  return (
    <div className="relative">
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "pr-16", // Make room for currency code
          className
        )}
      />
      {/* Currency code overlay */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {currencyCode}
        </span>
      </div>
    </div>
  );
}