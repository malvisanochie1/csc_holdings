export interface CurrencyFlag {
  code: string;
  countryCode: string;
  flag: string;
}

export const CURRENCY_FLAGS: Record<string, CurrencyFlag> = {
  USD: { code: "USD", countryCode: "US", flag: "🇺🇸" },
  EUR: { code: "EUR", countryCode: "EU", flag: "🇪🇺" },
  GBP: { code: "GBP", countryCode: "GB", flag: "🇬🇧" },
  JPY: { code: "JPY", countryCode: "JP", flag: "🇯🇵" },
  AUD: { code: "AUD", countryCode: "AU", flag: "🇦🇺" },
  CAD: { code: "CAD", countryCode: "CA", flag: "🇨🇦" },
  CHF: { code: "CHF", countryCode: "CH", flag: "🇨🇭" },
  CNY: { code: "CNY", countryCode: "CN", flag: "🇨🇳" },
  SEK: { code: "SEK", countryCode: "SE", flag: "🇸🇪" },
  NOK: { code: "NOK", countryCode: "NO", flag: "🇳🇴" },
  DKK: { code: "DKK", countryCode: "DK", flag: "🇩🇰" },
  PLN: { code: "PLN", countryCode: "PL", flag: "🇵🇱" },
  CZK: { code: "CZK", countryCode: "CZ", flag: "🇨🇿" },
  HUF: { code: "HUF", countryCode: "HU", flag: "🇭🇺" },
  RON: { code: "RON", countryCode: "RO", flag: "🇷🇴" },
  BGN: { code: "BGN", countryCode: "BG", flag: "🇧🇬" },
  HRK: { code: "HRK", countryCode: "HR", flag: "🇭🇷" },
  TRY: { code: "TRY", countryCode: "TR", flag: "🇹🇷" },
  RUB: { code: "RUB", countryCode: "RU", flag: "🇷🇺" },
  KRW: { code: "KRW", countryCode: "KR", flag: "🇰🇷" },
  SGD: { code: "SGD", countryCode: "SG", flag: "🇸🇬" },
  HKD: { code: "HKD", countryCode: "HK", flag: "🇭🇰" },
  INR: { code: "INR", countryCode: "IN", flag: "🇮🇳" },
  BRL: { code: "BRL", countryCode: "BR", flag: "🇧🇷" },
  MXN: { code: "MXN", countryCode: "MX", flag: "🇲🇽" },
  ZAR: { code: "ZAR", countryCode: "ZA", flag: "🇿🇦" },
  NZD: { code: "NZD", countryCode: "NZ", flag: "🇳🇿" },
  AED: { code: "AED", countryCode: "AE", flag: "🇦🇪" },
  NGN: { code: "NGN", countryCode: "NG", flag: "🇳🇬" },
};

export function getCurrencyFlag(currencyCode: string): string {
  const currency = CURRENCY_FLAGS[currencyCode.toUpperCase()];
  return currency?.flag || "💰";
}

export function getCurrencyCountryCode(currencyCode: string): string {
  const currency = CURRENCY_FLAGS[currencyCode.toUpperCase()];
  return currency?.countryCode || "";
}