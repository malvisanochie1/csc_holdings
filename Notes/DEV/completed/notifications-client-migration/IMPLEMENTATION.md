# Notifications Client Migration Implementation

## Date
2025-11-18

## Summary
Replaced the temporary Next.js API routes with a purely client-side notification provider. The new mock helper reads `Notes/Data/notifications.json`, keeps a shared in-memory store for HMR, and exposes getter + mutator utilities so the React Query hooks can operate without any `/api` endpoints. `src/lib/api/notifications.ts` now short-circuits to those helpers whenever the mock flag is active, and the redundant `src/app/api/notifications` + `src/server/db/notifications.ts` files are removed so the project stays fully client-side.

## Testing
- `yarn build`
