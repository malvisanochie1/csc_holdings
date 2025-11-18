import type { UserCurrency, UserResource } from "@/lib/types/api";

export type NumericLike = number | string | null | undefined;

export interface FormatCurrencyOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallbackSymbol?: string;
  fallbackRate?: number;
  includeSymbol?: boolean;
}

export interface FormattedCurrencyResult {
  /** Converted numeric amount after the rate is applied. */
  convertedValue: number;
  /** Rate that was applied to the incoming value. */
  rate: number;
  /** Symbol resolved from the currency object or fallback. */
  symbol: string;
  /** Formatted amount without any currency symbol. */
  formatted: string;
  /** Convenience string combining symbol (if requested) with the formatted amount. */
  displayValue: string;
}

const DEFAULT_SYMBOL = "$";
const DEFAULT_RATE = 1;
const DEFAULT_LOCALE = "en-US";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toNumberOrNull = (value: NumericLike): number | null => {
  if (isFiniteNumber(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const resolveRate = (
  currency: Pick<UserCurrency, "rate"> | null | undefined,
  fallbackRate: number,
): number => {
  const { rate } = currency ?? {};
  if (isFiniteNumber(rate)) return rate;
  if (typeof rate === "string") {
    const parsed = Number(rate);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallbackRate;
};

const resolveSymbol = (
  currency: Pick<UserCurrency, "symbol"> | null | undefined,
  fallbackSymbol: string,
): string => {
  const symbol = currency?.symbol;
  if (typeof symbol === "string" && symbol.trim() !== "") {
    return symbol.trim();
  }
  return fallbackSymbol;
};

const needsSymbolSpacing = (symbol: string): boolean =>
  symbol.length > 1 && /[\w)]$/.test(symbol);

const createFormatter = (locale: string, minimumFractionDigits: number, maximumFractionDigits: number) => {
  try {
    return new Intl.NumberFormat(locale, { minimumFractionDigits, maximumFractionDigits });
  } catch {
    return new Intl.NumberFormat(DEFAULT_LOCALE, { minimumFractionDigits, maximumFractionDigits });
  }
};

export const formatWithCurrency = (
  value: NumericLike,
  currency: UserCurrency | null | undefined,
  options: FormatCurrencyOptions = {},
): FormattedCurrencyResult => {
  const baseValue = toNumberOrNull(value) ?? 0;
  const rate = resolveRate(currency, options.fallbackRate ?? DEFAULT_RATE);
  const convertedValue = baseValue * rate;
  const locale = options.locale ?? currency?.locale ?? DEFAULT_LOCALE;
  const minimumFractionDigits = options.minimumFractionDigits ?? 2;
  const maximumFractionDigits = options.maximumFractionDigits ?? 2;

  const formatter = createFormatter(locale, minimumFractionDigits, maximumFractionDigits);
  const formatted = formatter.format(convertedValue);

  const symbol = resolveSymbol(currency, options.fallbackSymbol ?? DEFAULT_SYMBOL);
  const includeSymbol = options.includeSymbol ?? true;
  const displayValue = includeSymbol
    ? needsSymbolSpacing(symbol)
      ? `${symbol} ${formatted}`
      : `${symbol}${formatted}`
    : formatted;

  return {
    convertedValue,
    rate,
    symbol: includeSymbol ? symbol : "",
    formatted,
    displayValue,
  };
};

export const formatUserCurrency = (
  value: NumericLike,
  user: Pick<UserResource, "currency"> | null | undefined,
  options?: FormatCurrencyOptions,
): FormattedCurrencyResult => {
  return formatWithCurrency(value, user?.currency, options);
};
