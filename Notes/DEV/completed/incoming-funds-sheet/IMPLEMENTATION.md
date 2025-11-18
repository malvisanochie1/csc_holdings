# Incoming Funds Sheet Implementation

## Date
2025-11-15

## Summary
Implemented a left-anchored wallet insight sheet for the Incoming Funds Reclaims list, backed by the new `/wallet-transactions/{wallet_id}` hook and types. The sheet mirrors the provided design with a hero overview, tabbed wallet + chart experience, stat tiles, styled transaction cards, and a multi-series recovery chart that pulls live wallet graph data while gracefully handling loading, refresh, and error states.
