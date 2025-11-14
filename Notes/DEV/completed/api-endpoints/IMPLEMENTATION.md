# API Endpoints Integration Implementation

## Date
2025-11-07

## Summary
Implemented a typed REST client layer (axios instance with interceptors plus reusable get/post helpers), a persisted auth store via Zustand, and React Query provisioning in the app layout. Added strongly typed API modules covering auth, settings, deposits, withdrawals, and legacy site data per Notes/Frontend-API-Documentation.md, alongside helper hooks for queries and mutations. Wired the login and registration pages to the new hooks with form validation, status messaging, and automatic routing, ensuring auth responses hydrate the global store. Documented usage in AGENTS.md, executed yarn install/build, and prepared task documentation per CLAUDE.md.
