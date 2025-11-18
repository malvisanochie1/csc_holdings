# Realtime User & Notification Sync

## Tasks
- [x] Create realtime task scaffolding and review existing auth/user flow
- [x] Port websocket infrastructure (Pusher service + hook) with environment support
- [x] Implement user + notification listeners with polling fallback and sound
- [x] Integrate chat unread alert listener mirroring reference behaviour
- [x] Document implementation details and ensure build passes

## Description
Bring the realtime parity from the CFDS platform into this Next.js project so authenticated users receive notifications, balance updates, and chat unread alerts instantly. Follow the reuse notes document closely, including connection lifecycle, polling fallback, and audio cues.
