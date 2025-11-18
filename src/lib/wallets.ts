import type { CurrencyAsset, UserResource } from "@/lib/types/api";
import { formatUserCurrency } from "@/lib/currency";

export function findUserAssetByWalletId(
  user: UserResource | null | undefined,
  walletId?: string | null
): CurrencyAsset | undefined {
  if (!user || !walletId) return undefined;
  const assets = Array.isArray(user.assets) ? user.assets : [];
  const normalizedWalletId = walletId.toString();

  return assets.find((asset) => {
    return (
      asset.user_wallet_id === normalizedWalletId || asset.id === normalizedWalletId
    );
  });
}

export function findUserCurrencyById(
  user: UserResource | null | undefined,
  walletId?: string | null
): CurrencyAsset | undefined {
  if (!user || !walletId) return undefined;
  const currencies = Array.isArray(user.currencies) ? user.currencies : [];
  const normalizedWalletId = walletId.toString();

  return currencies.find((currency) => {
    return (
      currency.id === normalizedWalletId || currency.user_wallet_id === normalizedWalletId
    );
  });
}

const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const safeParseNumber = (value?: string | number | null): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const normalizeRange = (min: number, max: number): [number, number] => {
  if (min > max) {
    return [max, min];
  }
  return [min, max];
};

export function formatConversionRateRange(
  asset: CurrencyAsset | undefined,
  amount?: number,
  user?: UserResource | null
): {
  percentageLabel: string;
  amountLabel: string;
} {
  const minPercent = safeParseNumber(asset?.conversion_rate?.min);
  const maxPercent = safeParseNumber(asset?.conversion_rate?.max);
  const [resolvedMin, resolvedMax] = normalizeRange(minPercent, maxPercent);

  const percentageLabel = `${formatPercent(resolvedMin)} - ${formatPercent(resolvedMax)}`;

  if (typeof amount !== "number" || Number.isNaN(amount)) {
    const zeroFormatted = formatUserCurrency(0, user).displayValue;
    return {
      percentageLabel,
      amountLabel: `${zeroFormatted} - ${zeroFormatted}`,
    };
  }

  const minValue = (amount * resolvedMin) / 100;
  const maxValue = (amount * resolvedMax) / 100;

  return {
    percentageLabel,
    amountLabel: `${formatUserCurrency(minValue, user).displayValue} - ${formatUserCurrency(maxValue, user).displayValue}`,
  };
}

export function formatUsdAmount(value?: number | string | null, user?: UserResource | null) {
  // Deprecated: Use formatUserCurrency instead
  return formatUserCurrency(safeParseNumber(value), user).displayValue;
}
