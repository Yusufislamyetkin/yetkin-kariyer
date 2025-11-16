## Plan

1. **Chat summary API**
   - Add `app/api/chat/summary/route.ts` to aggregate unread totals and presence target IDs for direct chats, user groups, and community groups.
   - Reuse Prisma queries from existing chat endpoints; return lightweight payload `{ direct, groups, community }` with `unreadCount` and `channelIds` arrays.

2. **Global chat context & presence**
   - Create a client hook/provider (e.g., `ChatSummaryProvider`) under `app/contexts` that fetches the summary, exposes counts, and periodically refreshes.
   - Within the provider, post presence heartbeats to all returned channel IDs via existing `/api/chat/direct/{id}/presence` and `/api/chat/groups/{id}/presence` routes (with beacon support on unload).

3. **Navigation badges**
   - Update `DashboardLayoutClient` to consume the new context and render red notification badges for `Sohbetler`, `Gruplar`, and `Yardımlaşma Toplulukları` showing respective unread totals.
   - Ensure badges update on summary refresh and add a method to manually refetch (for chat pages to trigger after reads).
