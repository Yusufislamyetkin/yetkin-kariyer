# Hackathon Frontend UX Plan

This document outlines the user journeys, navigation touchpoints, and UI components needed to support friend networking, hackathon discovery, applications, submissions, and rewards across web and responsive breakpoints. Existing chat surfaces remain unchanged but are linked where relevant.

## Global Considerations
- **Navigation**: add `Hackathons` + `Friends` entries to dashboard sidebar (`app/(dashboard)/layout.tsx`). Use feature flags for staged rollout.
- **State Management**: reuse existing React server components with client wrappers as needed. Consider a dedicated `HackathonContext` for cross-page state (selected hackathon, team membership).
- **Feedback Patterns**: use Toasts for minor updates, modal confirmations for irreversible actions (submission lock, team leave).
- **Accessibility**: ensure forms have clear labels, countdown timers include ARIA live regions, color choices meet WCAG AA.

## User Journeys

### 1. Social Graph
1. `Friends` overview page lists:
   - Search input (autocomplete).
   - `FriendCard` entries with status (online/offline via existing chat presence).
   - Pending requests section with accept/decline.
2. From user profile (`app/(dashboard)/profile/[userId]`):
   - `Add Friend` / `Cancel Request` / `Message` CTAs.
3. Notifications for new requests link back to `Friends` page.

### 2. Hackathon Discovery
1. `Hackathons` list page:
   - Filters: status (`Upcoming`, `Open`, `In Progress`, `Completed`), tags, organizer.
   - Cards showing countdown, prize summary, badges available.
   - Phase badge, dual countdown pills (application vs submission) and organizer snippet surfaced per card.
   - Keyword search filters (title/description/tags) and badge counts update without navigation.
2. Hackathon detail page:
   - Hero section with banner, primary CTA (Apply / View Submission / Manage Team).
   - Tabs: `Overview`, `Schedule`, `Prizes & Badges`, `Teams`, `Resources`.
   - Timeline component visualizing application/submission windows.
   - Organizer info + contact link.
   - Application module surfaces current status, pending team invitations, and inline guidance for solo/team paths.

### 3. Application Flow
1. `Apply` button opens multi-step modal or dedicated route (`/app/(dashboard)/competition/hackaton/[id]/apply`).
   - Step 1: Eligibility checklist (auto-filled from profile; highlight missing fields).
   - Step 2: Questionnaire (motivation, skills) with progress indicator.
   - Step 3: Team selection:
     - Create team (name, description, invite code share).
     - Join via invite code.
     - Solo participation option.
   - Step 4: Review & submit; display application window warnings.
2. Post-submission screen shows status (`Pending review`, `Approved`, etc.) with next steps and link to team hub.

### 4. Team Collaboration Hub
- Accessible via hackathon detail when user is part of event.
- Tabs:
  - `Team`: members list, roles (Leader, Member), invite link copy button, chat shortcut.
  - `Tasks`: optional integration with existing roadmap/goals (future).
  - `Resources`: shared files/links (MVP: free-form links).
- Allow leader to lock team before submission; show confirmation modal.
- Leaders/co-leaders see friends list (from `/dashboard/friends`) with invite buttons; members see copyable invite code only.
- Pending invitations for the viewer display above the team module with accept/decline actions.

### 5. Submission Dashboard
1. `Submission` tab shows:
   - Countdown timers for submission window.
   - GitHub connection status (prompt to connect if missing).
   - Form fields: repo URL (validated), branch, description, demo links, file uploads (optional).
   - History panel listing past submissions (timestamp, status).
2. After submission:
   - Show validation results (required files present, commit SHA captured).
   - `Resubmit` button enabled until deadline; warning after deadline.
3. Judges view (organizer mode):
   - List of submissions with filters (status, score).
   - Inline scoring widget or link to dedicated review page.

### 6. Rewards & Badges
- `Rewards` section inside hackathon detail:
  - Grid of badge cards with locked/unlocked states.
  - Prize tiers with descriptions; highlight user’s earned rewards.
- Global `Achievements` page (extend existing badges display):
  - Timeline of badges earned with context (hackathon, date).
  - Share buttons (copy link, social).
- Reward redemption modal:
  - Show redemption status, required shipping details form if applicable.

### 7. Friends Hub (Dashboard)
- `/dashboard/friends` hosts:
  - Incoming requests (accept/decline), outgoing requests (cancel), accepted list with copyable user IDs.
  - Lightweight form for manual user-ID invites (placeholder until user search UX is ready).
- Module links back to hackathon detail to encourage inviting approved friends into teams.

## Component Inventory

| Component | Description | Reusability |
| --- | --- | --- |
| `FriendCard` | Avatar, name, status, action dropdown | Used on friends list and search results |
| `FriendRequestList` | Lists incoming/outgoing requests with actions | Drawer/modal |
| `HackathonCard` | Displays key event info, progress bar, CTA | List/grid view |
| `HackathonTimeline` | Visual timeline (markers for each phase) | Detail, admin edit |
| `CountdownPill` | Countdown with color states (safe/warning/danger) | Submissions, applications |
| `ApplicationStepper` | Multi-step form navigation | Applications, potential reused for other flows |
| `TeamMemberList` | Grid/list with roles, actions (promote/remove) | Team hub |
| `SubmissionForm` | Controlled form for repo input, file uploads | Reusable for resubmission |
| `SubmissionHistory` | Table/list of submission attempts | Participant + organizer views |
| `BadgeGrid` | Display badges with locked/earned overlay | Hackathon detail, profile |
| `RewardCard` | Details + redemption CTA | Hackathon rewards, profile |

## Responsive & Mobile
- Sidebar collapses to bottom nav; ensure critical actions accessible via floating CTA (e.g., `Apply` button).
- Multi-step forms convert to vertical stack with progress indicator at top.
- Tables (submissions, teams) switch to card layout with key details.

## Interaction States & Empty Views
- **Friends**: empty state with CTA to search by username/email, highlight benefits.
- **Hackathons**: empty state for completed applications (“You’re all set. Prepare for submissions!”).
- **Submissions**: before linking GitHub, show placeholder with instructions; after deadline, show locked message.
- **Rewards**: show “No rewards yet” with suggestions (participate in upcoming hackathon).

## Content Strategy & Copy
- Tone: encouraging, action-oriented (e.g., “Submit your project before the clock runs out”).
- Provide contextual tooltips (application requirements, team size constraints).
- Highlight deadlines using consistent formatting (UTC offset, local timezone toggle).

## Analytics Tracking
- Track events (`friend_request_sent`, `hackathon_apply_start`, `submission_completed`, `badge_viewed`) using existing analytics pipeline.
- Use tracking to personalize suggestions (e.g., recommend teammates based on skills).

