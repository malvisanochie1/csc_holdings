# Currency Formatter Utility Implementation

## Date
2025-11-15

## Summary
Introduced currency helpers in `src/lib/currency.ts` that apply a user's currency rate before formatting amounts, returning both raw and display-ready values alongside the resolved symbol. Extended `UserResource` typing with a `UserCurrency` shape so the utilities can consume the stored symbol, rate, and locale information.
