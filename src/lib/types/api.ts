export type ApiErrors = Record<string, string[]> | undefined;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: ApiErrors;
}

export interface AuthPayloadLogin {
  email: string;
  password: string;
}

export interface AuthPayloadRegister {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  country: string;
  country_code?: string;
}

export interface CurrencyAsset {
  id: string;
  user_wallet_id: string;
  name: string;
  symbol: string;
  image: string;
  balance: number;
  balance_val: string;
  is_fiat: number;
  conversion_rate: {
    min: string;
    max: string;
  };
  status: string;
}

export interface ConversionRequest {
  id: string;
  user_id: string;
  from_wallet_id: string;
  to_wallet_id: string;
  status: string;
  step: number;
  amount: number;
  converted_amount: number;
  percent: number;
  paid_amount?: number;
  transfer_method?: string;
  paid: boolean;
  confirmed_payment?: boolean;
  message?: string | null;
  data: unknown[];
}

export interface ConversionRequestResponse {
  conversion_request: ConversionRequest;
}

export type WithdrawalStage =
  | "tax_clearance"
  | "etf_code"
  | "entity_pin"
  | "fscs_code"
  | "regulation_code"
  | "fund_transfer_pin";

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  from_wallet_id?: string | null;
  wallet_id?: string | null;
  user_wallet_id?: string | null;
  currency_id?: string | null;
  status: string;
  stage: WithdrawalStage;
  amount: number;
  percent?: number | null;
  show_percent?: boolean | null;
  withdrawal_method?: string | null;
  code_length?: number | null;
  message?: string | null;
  progress?: number | null;
  data?: Record<string, unknown>;
}

export interface WithdrawalRequestResponse {
  withdrawal_request: WithdrawalRequest;
}

export interface PaymentWallet {
  name?: string;
  wallet?: string;
  image?: string;
  message?: string;
}

export interface UserResource {
  id: string;
  account_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country?: string;
  username?: string | null;
  address?: string | null;
  avatar?: string;
  status?: string;
  birth_date?: string | null;
  total_deposit?: number;
  autotrader?: boolean;
  autotrader_status?: string | null;
  can_open_trade?: boolean;
  can_close_trade?: boolean;
  verification_status?: string;
  notification_msg?: string;
  notifications?: unknown[];
  currencies?: CurrencyAsset[];
  assets?: CurrencyAsset[];
  total_fiat?: number;
  total_fiat_val?: number;
  total_asset?: number;
  total_asset_val?: number;
  on_going_conversion_requests?: ConversionRequest[];
  conversion_period?: number | string;
  payment_wallet?: PaymentWallet | null;
  on_going_withdrawal_request?: WithdrawalRequest | null;
  [key: string]: unknown;
}

export interface AuthResponseData {
  user: UserResource;
  token: string;
}

export interface SettingsData {
  status: string;
  name: string;
  has_ecn: boolean;
  must_verify_account: boolean;
  contactEmail?: string;
  website_url?: string;
  favicon?: string;
  logo?: string;
  wallets?: unknown[];
  [key: string]: unknown;
}

export interface SiteData {
  currencies?: unknown[];
  wallets?: unknown[];
  plans?: unknown[];
  withdrawal_methods?: unknown[];
  wire_transfer?: unknown;
  [key: string]: unknown;
}

export interface Paginated<T> {
  data: T[];
  [key: string]: unknown;
}

export interface DepositItem {
  id: number | string;
  amount: string | number;
  date?: string;
  type?: string;
  account?: string;
  status?: string;
  details?: string;
}

export interface SubmitDepositPayload {
  method: string;
  wallet_id: number | string;
  amount: number;
  transaction_id: string;
}

export interface SubmitWithdrawalPayload {
  amount: number;
  method: string;
  network?: string;
  wallet_address?: string;
  wallet_id?: string;
  currency_id?: string;
  currency_name?: string;
  crypto_type?: string;
  bank_account_name?: string;
  bank_account_number?: string;
  bank_iban?: string;
  bank_name?: string;
  bank_swift_code?: string;
  bank_additional_info?: string;
}

export interface WithdrawalItem {
  id: number | string;
  amount: string | number;
  method?: string;
  network?: string;
  status?: string;
  date?: string;
  wallet_address?: string;
  [key: string]: unknown;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  address?: string;
  avatar?: string | File;
}

export interface WalletTransactionWallet {
  id: string;
  name: string;
  symbol: string;
  image: string;
  is_fiat: boolean;
}

export interface WalletTransactionItem {
  id: string;
  wallet_id: string;
  wallet: WalletTransactionWallet;
  amount: number;
  status: string;
  color: string;
  type: string;
  description: string | null;
  company: string | null;
  created_at: string;
}

export interface WalletTransactionGroup {
  count: number;
  wallet_ids: string[];
  total: number;
  transactions: WalletTransactionItem[];
}

export interface WalletTransactionsGraphPoint {
  date: string;
  success: number;
  pending: number;
  failed: number;
}

export interface WalletTransactionsResponse {
  total_amount: number;
  groups: {
    success: WalletTransactionGroup;
    pending: WalletTransactionGroup;
    failed: WalletTransactionGroup;
    [key: string]: WalletTransactionGroup;
  };
  graph: WalletTransactionsGraphPoint[];
}
