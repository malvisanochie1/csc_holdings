import type { CurrencyAsset } from "@/lib/types/api";
import type { AssetWallet } from "@/lib/store/assets";

const normalizeSymbol = (value?: string | null) =>
  value?.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() ?? "";

const parseNumber = (value?: number | string | null): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return undefined;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
};

const resolveWalletForAsset = (asset: CurrencyAsset, wallets: AssetWallet[]) => {
  const normalizedSymbol = normalizeSymbol(
    (asset as { sym?: string })?.sym ||
      (asset as { symbol?: string })?.symbol ||
      (asset as { name?: string })?.name,
  );
  const normalizedName = normalizeSymbol((asset as { name?: string })?.name);

  return wallets.find((wallet) => {
    if (wallet.normalizedSymbol && normalizedSymbol) {
      return wallet.normalizedSymbol === normalizedSymbol;
    }
    if (wallet.normalizedName && normalizedName) {
      return wallet.normalizedName === normalizedName;
    }
    return false;
  });
};

export interface AssetRealtimeMetrics {
  baseValue: number;
  realtimeValue: number;
  pnl: number;
  wallet?: AssetWallet;
}

export const computeAssetRealtimeMetrics = (
  asset: CurrencyAsset,
  wallets: AssetWallet[],
): AssetRealtimeMetrics => {
  const wallet = resolveWalletForAsset(asset, wallets);
  const balance = parseNumber((asset as { balance?: number | string })?.balance) ?? 0;
  const baseRate = parseNumber((asset as { rate?: number | string })?.rate);

  const walletRate =
    typeof wallet?.realtimeRate === "number" && wallet.realtimeRate > 0
      ? wallet.realtimeRate
      : parseNumber(wallet?.rate);

  let realtimeValue = balance;
  if (
    balance > 0 &&
    baseRate &&
    walletRate &&
    baseRate > 0 &&
    Number.isFinite(baseRate) &&
    Number.isFinite(walletRate)
  ) {
    const units = balance / baseRate;
    if (Number.isFinite(units) && units > 0) {
      realtimeValue = units * walletRate;
    }
  }

  const pnl = realtimeValue - balance;

  return {
    baseValue: balance,
    realtimeValue,
    pnl,
    wallet,
  };
};

export interface AggregateAssetRealtimeMetrics {
  baseTotal: number;
  realtimeTotal: number;
  totalPnl: number;
}

export const aggregateAssetRealtimeMetrics = (
  assets: CurrencyAsset[] | undefined | null,
  wallets: AssetWallet[],
): AggregateAssetRealtimeMetrics => {
  if (!Array.isArray(assets) || !assets.length) {
    return {
      baseTotal: 0,
      realtimeTotal: 0,
      totalPnl: 0,
    };
  }

  return assets.reduce<AggregateAssetRealtimeMetrics>(
    (acc, asset) => {
      const metrics = computeAssetRealtimeMetrics(asset, wallets);
      acc.baseTotal += metrics.baseValue;
      acc.realtimeTotal += metrics.realtimeValue;
      acc.totalPnl += metrics.pnl;
      return acc;
    },
    { baseTotal: 0, realtimeTotal: 0, totalPnl: 0 },
  );
};
