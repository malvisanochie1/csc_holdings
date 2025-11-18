# UX Polish per Notes/INS Implementation

## Date
2025-11-18

## Summary
Refined the dashboard experience so light mode backgrounds blend with the card system, refreshed the floating concierge to respect theme changes (with a full-screen mobile sheet), retargeted the incoming funds deep link to `/dashboard/transaction/view` while rebuilding that page per the provided spec, cleaned up the verification layout by removing the legacy hero and locking the sidebar, and padded the global layout to keep the mobile nav from overlapping content; the full Next.js build now passes without warnings.

## Highlights
- Updated `home-bg` + `.card` styles for brighter light mode and consistent elevation.
- Rebuilt `ChatWidget` with theme-aware surfaces and a mobile side sheet interaction.
- Moved the wallet detail route to `/dashboard/transaction/view` and redesigned it with a text-first summary, stat tiles, and a structured table.
- Prevented the verification sidebar from scrolling with the page and removed the "Secure your account" panel in favor of leaner content.
- Added small-screen body padding so the fixed bottom nav no longer covers page content.
- Ran `yarn build` to ensure the new layout ships cleanly.
