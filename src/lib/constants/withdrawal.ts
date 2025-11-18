import type { WithdrawalStage } from "@/lib/types/api";

export type WithdrawalMethodKey = "crypto" | "bank";

export type WithdrawalMethod = {
  key: WithdrawalMethodKey;
  title: string;
  icon: string;
};

export const withdrawalMethods: WithdrawalMethod[] = [
  {
    key: "crypto",
    title: "Crypto Transfer",
    icon: "₿",
  },
  {
    key: "bank",
    title: "Bank Transfer",
    icon: "🏦",
  },
];

export type CryptoOption = {
  id: string;
  name: string;
  symbol: string;
  network: string;
  description: string;
  icon: string;
  minAmount: number;
  maxAmount: number;
};

export const cryptoOptions: CryptoOption[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    network: "bitcoin",
    description: "Global settlement rail with deep liquidity",
    icon: "/dashboard/account_overview/btc.png",
    minAmount: 0.0001,
    maxAmount: 100,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    network: "ethereum",
    description: "ERC-20 friendly route for smart-contract wallets",
    icon: "/dashboard/account_overview/Etherum.png",
    minAmount: 0.001,
    maxAmount: 1000,
  },
  {
    id: "usdt-trc20",
    name: "USDT",
    symbol: "USDT",
    network: "tron",
    description: "Stablecoin payout over low-fee Tron network",
    icon: "/dashboard/account_overview/dollar-symbol.png",
    minAmount: 1,
    maxAmount: 100000,
  },
  {
    id: "usdt-erc20",
    name: "USDT",
    symbol: "USDT",
    network: "ethereum",
    description: "Stablecoin over Ethereum network",
    icon: "/dashboard/account_overview/dollar-symbol.png",
    minAmount: 1,
    maxAmount: 100000,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    network: "solana",
    description: "Fast and low-cost blockchain network",
    icon: "/dashboard/account_overview/solana.png",
    minAmount: 0.01,
    maxAmount: 10000,
  },
];

export interface WithdrawalStageContent {
  title: string;
  subtitle: string;
  description: string;
  progressPercent: number;
  codeLength: number;
  codeLabel: string;
  eyebrow: string;
  note?: string;
  learnMoreText?: string;
  learnMoreUrl?: string;
  icon?: string;
  processingMessage?: string;
}

export const withdrawalStageContent: Record<WithdrawalStage, WithdrawalStageContent> = {
  tax_clearance: {
    title: "Tax clearance code required",
    subtitle: "",
    description: "The Financial Services Trust requires tax clearance verification before releasing recovered funds. This ensures compliance with HMRC regulations and protects both parties during the settlement process.",
    progressPercent: 75,
    codeLength: 8,
    codeLabel: "Tax clearance code",
    eyebrow: "Tax Compliance",
    note: "Your escrow liaison will provide the clearance reference once the compliance levy is processed.",
    learnMoreText: "Learn more about tax clearance",
    learnMoreUrl: "https://cscescrow.com/tax-clearance",
    processingMessage: "Processing tax clearance verification...",
  },
  etf_code: {
    title: "E.F.T CHARGES REQUIRED",
    subtitle: "Electronic funds transfer (EFT) are transactions that move funds electronically between different financial institutions, bank accounts or individuals.",
    description: "For all electronic bank transfers, You're required to pay a rate of 9.1% E.F.T charges for all transactions related to forex/crypto in compliance with the Bank of England Monetary Policy Committee(MPC). This is a mandatory payment for all investment related earnings. NOTE: Your withdrawal has been approved already and you can make the E.F.T transaction within the next 7 working days into your personal account or your transaction rates are subject to change with assets and market price fluctuations, the rate could be more or less which depends on the market price. EFT charges are mostly required to be made with crypto but if you insist on going further with banking payment gateway, that means to say that your charges might increase and you will have to request for it, mainly because your account opening was merged under crypto.",
    progressPercent: 85,
    codeLength: 6,
    codeLabel: "Enter code",
    eyebrow: "E.F.T CHARGES REQUIRED",
    processingMessage: "Processing E.F.T charges...",
  },
  entity_pin: {
    title: "ENTITY SECURITY PIN REQUIRED",
    subtitle: "CONFIRM YOUR WITHDRAWAL AND IDENTITY BY ENTERING YOUR ENTITY SECURITY PIN",
    description: "Our Escrow team will provide you with your ENTITY SECURITY PIN in the next 48 hours.",
    progressPercent: 90,
    codeLength: 4,
    codeLabel: "Enter code",
    eyebrow: "ENTITY SECURITY PIN REQUIRED",
    processingMessage: "Verifying entity security credentials...",
  },
  fscs_code: {
    title: "FSCS Risk Mitigation Code Required",
    subtitle: "",
    description: "",
    progressPercent: 95,
    codeLength: 7,
    codeLabel: "Enter pin",
    eyebrow: "FSCS Risk Mitigation Code Required",
    processingMessage: "Processing FSCS risk assessment...",
  },
  regulation_code: {
    title: "Regulation Code required",
    subtitle: "",
    description: "",
    progressPercent: 100,
    codeLength: 6,
    codeLabel: "Enter code",
    eyebrow: "Regulation Code required",
    processingMessage: "Finalizing regulatory compliance...",
  },
  fund_transfer_pin: {
    title: "Fund transfer PIN required",
    subtitle: "Security verification for withdrawal initiation",
    description: "To protect you against authorized withdrawals, a Funds Transfer Pin has been sent to your email, Please insert it to proceed with your withdrawal request",
    progressPercent: 20,
    codeLength: 6,
    codeLabel: "Transfer PIN",
    eyebrow: "Security Verification",
    processingMessage: "Validating transfer PIN...",
  },
};

export function getStageContent(stage: WithdrawalStage, dynamicValues?: {
  amount?: number | null;
  percent?: number | null;
  showPercent?: boolean | null;
  message?: string | null;
}): WithdrawalStageContent {
  const baseContent = withdrawalStageContent[stage];

  const subtitle = dynamicValues?.message || baseContent.subtitle;
  const description = baseContent.description;


  return {
    ...baseContent,
    subtitle,
    description,
  };
}
