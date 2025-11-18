"use client";

import React from "react";
import Select, { SingleValue, MultiValue, components, StylesConfig, OptionProps, SingleValueProps, DropdownIndicatorProps } from "react-select";
import { Language, LANGUAGES } from "@/lib/constants/languages";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";

interface LanguageOption {
  value: string;
  label: string;
  language: Language;
}

interface LanguageSelectProps {
  value?: string;
  onValueChange: (languageCode: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomOption = (props: OptionProps<LanguageOption>) => {
  const { data } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{data.language.flag}</span>
        <div className="flex flex-col">
          <span className="font-medium text-sm">{data.language.name}</span>
          <span className="text-xs text-muted-foreground">
            {data.language.nativeName}
          </span>
        </div>
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props: SingleValueProps<LanguageOption>) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{data.language.flag}</span>
        <span className="font-medium">{data.language.name}</span>
        <span className="text-muted-foreground text-sm">
          {data.language.nativeName}
        </span>
      </div>
    </components.SingleValue>
  );
};

const DropdownIndicator = (props: DropdownIndicatorProps<LanguageOption>) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown className="w-4 h-4 text-muted-foreground" />
  </components.DropdownIndicator>
);

export function LanguageSelect({
  value,
  onValueChange,
  placeholder = "Select language",
  disabled = false,
}: LanguageSelectProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const options: LanguageOption[] = LANGUAGES.map((language) => ({
    value: language.code,
    label: language.name,
    language,
  }));

  const selectedOption = options.find((option) => option.value === value);

  const handleChange = (
    newValue: SingleValue<LanguageOption> | MultiValue<LanguageOption>
  ) => {
    const selectedOption = newValue as SingleValue<LanguageOption>;
    if (selectedOption) {
      onValueChange(selectedOption.value);
    }
  };

  const customStyles: StylesConfig<LanguageOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "40px",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.375rem",
      backgroundColor: "hsl(var(--background))",
      "&:hover": {
        borderColor: "hsl(var(--border))",
      },
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring))" : "none",
      "&:focus-within": {
        borderColor: "hsl(var(--ring))",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "white",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.5rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      zIndex: 50,
      overflow: "hidden",
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: isDark ? "#1f2937" : "white",
      padding: "4px",
      maxHeight: "200px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: isDark
        ? state.isSelected
          ? "#374151"
          : state.isFocused
          ? "#4b5563"
          : "#1f2937"
        : state.isSelected
        ? "#e5e7eb"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: isDark
        ? "#f9fafb"
        : "#374151",
      "&:hover": {
        backgroundColor: isDark ? "#4b5563" : "#f3f4f6",
        color: isDark ? "#f9fafb" : "#374151",
      },
      padding: "8px 12px",
      borderRadius: "0.375rem",
      margin: "2px 0",
      cursor: "pointer",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
    input: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "hsl(var(--muted-foreground))",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "hsl(var(--foreground))",
    }),
  };

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={disabled}
      isSearchable
      isClearable={false}
      components={{
        Option: CustomOption,
        SingleValue: CustomSingleValue,
        DropdownIndicator,
      }}
      styles={customStyles}
      className="react-select-container"
      classNamePrefix="react-select"
      filterOption={(option, inputValue) => {
        const { language } = option.data;
        const searchValue = inputValue.toLowerCase();
        return (
          language.name.toLowerCase().includes(searchValue) ||
          language.nativeName.toLowerCase().includes(searchValue) ||
          language.code.toLowerCase().includes(searchValue)
        );
      }}
    />
  );
}
