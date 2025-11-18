# Realtime User & Notification Sync Implementation

## Date
2025-11-17

## Summary
Ported the realtime behaviour from the CFDS platform so authenticated users keep their profile, balances, and concierge alerts in sync without refreshing. The build now includes richer websocket lifecycle handling, polling fallbacks, audible alerts, and floating callouts for both account notifications and new chat replies.

## Key Details
- **API Layer**: Added `lib/api/notifications.ts` and `lib/api/chat.ts` plus the `UserNotification` type so the app can mark notifications as read and fetch chat unread counts. A lightweight `useNotificationSound` hook centralizes the shared audio player.
- **Pusher Infrastructure**: Updated `pusher-service.ts` to track true connection states, emit listener callbacks on every transition, and normalize unsubscribe calls, so UI components can start polling whenever Echo disconnects.
- **Realtime UI**:
  - `NotificationListener` mirrors the Vite implementation: subscribes to `notification.{id}` and `user.{id}`, plays the shared chime, refreshes the user store (with retries + 30 s polling fallback), and renders a floating alert that lets users mark the first unread notification as read.
  - `ChatNotificationListener` keeps `/chat/unread-count` synced, listens to `chat.customer.{id}` events, plays the chime for concierge replies, and surfaces a floating CTA that deep-links to `/livechat`.
- **Initializer**: `WebSocketInitializer` lives in `app/layout.tsx` beside the chat widget. It reacts to connection changes with contextual toasts and mounts both listeners only after the auth store hydrates with a token.

## Testing
- `yarn build`
