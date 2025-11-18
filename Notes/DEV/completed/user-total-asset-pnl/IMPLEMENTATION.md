# Total Asset PnL Sync Implementation

## Date
2025-11-17

## Summary
Added a reusable realtime asset helper (`src/lib/assets.ts`) that normalizes wallet matches, recomputes each asset's live valuation, and exposes aggregate totals so we can keep the dashboard in sync with websocket rates. `financialAssets.tsx` now consumes the helper for card values, and `accountOverview.tsx` uses the aggregated totals to augment `user.total_asset` with summed PnL while animating the figure in green/red/white as it changes. `yarn build` was executed but still fails due to the pre-existing `/dashboard/transactions/[walletId]` static export configuration error.
