# Hackathon Backend Services & Business Rules

This document specifies the backend domain logic, API design, and operational workflows required to support friend networking, hackathon management, submissions, and rewards. It assumes a Next.js app with server routes under `/app/api` and Prisma-managed persistence.

## Service Layers

### FriendshipService
- **Responsibilities**: create friend requests, accept/decline, cancel, block/unblock, fetch friend list, enforce limits.
- **Key Rules**:
  - Prevent duplicate pending requests (`Friendship` unique index).
  - Auto-accept reciprocal request if both users requested each other.
  - Rate limit per user (e.g., max 20 requests/day).
  - Disallow friendship with blocked users; provide separate `Blocklist` logic if needed.
  - Soft-delete or mark declined requests; keep history for audit.
- **API Endpoints**:
  - `POST /api/friends/request` { targetUserId }
  - `POST /api/friends/respond` { friendshipId, action: accept|decline|cancel|remove }
  - `GET /api/friends` (returns incoming/outgoing/accepted rows)
- **Notifications**:
  - On request -> push/email.
  - On acceptance -> notify requester.

### HackathonService
- **Responsibilities**: CRUD for hackathons, status evaluation, timeline enforcement.
- **Business Logic**:
  - Validation of timeline ordering.
  - Determine derived state (`upcoming`, `open_for_applications`, `application_closed`, `submission_open`, `judging`, `completed`).
  - Enforce capacity: if `maxParticipants` reached, auto waitlist.
  - Allow organizer-only access for private events.
- **API Endpoints**:
  - `GET /api/hackathons` with filters (status, tags, search).
  - `GET /api/hackathons/[id]`.
  - `POST /api/hackathons` (organizers only).
  - `PATCH /api/hackathons/[id]`.
  - `POST /api/hackathons/[id]/archive`.
  - `POST /api/hackathons/maintenance/reconcile` (admin only, phase sync helper).

### ApplicationService
- **Responsibilities**: handle user applications, team formation, approvals.
- **Workflow**:
  1. Validate user profile completeness (skills, GitHub link).
  2. Check application window open.
  3. Enforce per-user limit (one application per hackathon).
  4. Manage team invites: `teamId` assigned when joining.
  5. Organizer can approve/reject or move to waitlist.
- **API Endpoints**:
  - `POST /api/hackathons/[id]/applications` { team.mode, motivation, skills, team metadata }
  - `GET /api/hackathons/[id]/applications` (current participant view)
  - `POST /api/hackathons/[id]/applications/[applicationId]/status` (organizer).
  - `POST /api/hackathons/[id]/teams` create team.
  - `POST /api/hackathons/[id]/teams/join` { inviteCode }.
  - `DELETE /api/hackathons/[id]/applications/[applicationId]` withdraw.
  - `POST /api/hackathons/[id]/teams/[teamId]/invite` invite friend (friendship check).
  - `POST /api/hackathons/[id]/teams/invite` { inviteId, action } accept/decline invites.
- **Notifications**:
  - Application received.
  - Status change (approved/waitlisted/rejected).
  - Team invite and join confirmations.

### SubmissionService
- **Responsibilities**: manage GitHub-linked submissions, validation, and judging state.
- **Business Rules**:
  - Allow submission only within `submissionOpensAt`–`submissionClosesAt`.
  - Validate repository accessibility via GitHub OAuth token stored per user.
  - Ensure `repoUrl` matches allowed hosts (GitHub, GitLab if expanded).
  - Track commit SHA via GitHub API; optionally tag release.
  - Handle re-submissions: replace existing entry if before deadline; after deadline flag as `late`.
  - Provide webhook endpoint to re-validate when repository updates.
- **API Endpoints**:
  - `POST /api/hackathons/[id]/submissions` { repoUrl, branch, commitSha?, title?, summary?, presentationUrl?, demoUrl? }
  - `GET /api/hackathons/[id]/submissions` (current team/user view).
  - `POST /api/hackathons/[id]/submission/validate` (manual re-check).
  - `POST /api/hackathons/[id]/submission/judge` (organizer/judge, assign scores/status).
- **Validation Tasks** (background):
  - Check required files (e.g., `README`, `demo.md`).
  - Lint README for completeness.
  - Optional CI integration (GitHub Actions triggered via dispatch).

### RewardService
- **Responsibilities**: manage badge & reward logic, redemption flows.
- **Badge Issuance**:
  - Input: `BadgeRule` + event triggers (e.g., submission on time).
  - Evaluate under background worker to avoid synchronous delays.
  - Record `BadgeAward` and notify recipient.
  - Support manual overrides by organizers.
- **Reward Fulfillment**:
  - Map hackathon placements to `Reward`.
  - For limited inventory, reserve in transaction and notify operations team.
  - Provide admin UI to mark as shipped/delivered.
- **API Endpoints**:
  - `GET /api/hackathons/[id]/badges` (rules & earned state).
  - `POST /api/hackathons/[id]/badges/issue` (admin manual grant).
  - `GET /api/rewards` (user view).
  - `POST /api/rewards/[rewardId]/redeem` (if manual claim required).
  - `PATCH /api/rewards/redemptions/[id]` (admin update status).

### NotificationService
- **Integration**:
  - Hook into each domain event to create `Notification` records and trigger email/push via provider (e.g., Resend, Firebase).
  - Deduplicate repeated reminders (e.g., send one 24 hours before submission deadline).

## Authentication & Authorization

- Require session (NextAuth) for participants.
- Organizer role stored on `User` or via `UserRole` table; enforce on organizer endpoints.
- Judges assigned per hackathon using `HackathonJudge` (optional new table) with limited permissions (view submissions, update scores).
- Enforce team membership checks before allowing submission operations.
- Logging: record user IP/device for sensitive operations (block, award changes).

## API Contracts (Sample)

### Create Hackathon
`POST /api/hackathons`
```json
{
  "title": "AI for Good 2025",
  "slug": "ai-for-good-2025",
  "description": "...",
  "applicationOpensAt": "2025-02-01T09:00:00Z",
  "applicationClosesAt": "2025-02-15T23:59:00Z",
  "submissionOpensAt": "2025-02-16T09:00:00Z",
  "submissionClosesAt": "2025-03-01T17:00:00Z",
  "maxParticipants": 500,
  "maxTeamSize": 4,
  "minTeamSize": 1,
  "tags": ["ai", "social-impact"],
  "requirements": {
    "eligibility": ["18+", "student or professional"],
    "deliverables": ["GitHub repo", "2-min demo video"]
  },
  "prizesSummary": "Cash prizes, mentorship, swag"
}
```

### Apply to Hackathon
`POST /api/hackathons/{id}/apply`
```json
{
  "responses": {
    "motivation": "I want to tackle climate issues.",
    "skills": ["Python", "ML"]
  },
  "teamInviteCode": "TEAM1234"
}
```

### Submit Project
`POST /api/hackathons/{id}/submission`
```json
{
  "repoUrl": "https://github.com/org/ai-good",
  "branch": "main",
  "presentationUrl": "https://youtu.be/demo",
  "shortDescription": "Predicting energy efficiency for low-income housing."
}
```

### Award Badge (Admin)
`POST /api/hackathons/{id}/badges/issue`
```json
{
  "badgeId": "badge_winner",
  "userId": "user_123",
  "reason": "Team Alpha won first place"
}
```

## Background Jobs & Schedulers

- **Deadline Enforcement**:
  - Cron every hour/day to transition hackathon states; send reminders (24h, 6h, 1h before deadlines).
- **Badge Evaluation**:
  - Queue trigger per submission/application event; worker calculates eligible badges.
- **Reward Fulfillment**:
  - Scheduled job to detect pending redemptions > X days and alert ops.
- **Data Cleanup**:
  - Remove expired team invite codes.
  - Archive inactive friendships (>1 year without interaction) if required.

## Error Handling & Observability

- Standardize error codes (e.g., `HACKATHON_CLOSED`, `TEAM_LOCKED`, `SUBMISSION_WINDOW_NOT_OPEN`).
- Log structured events with context (userId, hackathonId, teamId).
- Track metrics:
  - Application conversion rates.
  - Submission on-time percentage.
  - Badge issuance counts.
- Capture audit events for regulator review (friend block, manual badge grants).

## Security & Compliance

- Validate GitHub repo ownership by checking collaborator access or verifying commit signature.
- Anti-spam: throttle friendship requests, require CAPTCHA after repeated declines.
- GDPR considerations: allow users to delete submissions post-event if policy permits; anonymize data for analytics.
- Ensure reward shipping details handled via secure forms with data retention policies.

## Testing & Operations

- Phase reconciliation: run `POST /api/hackathons/maintenance/reconcile` (admin) or schedule via cron/queue.
- Unit sanity: `npm run test:hackathon` executes `computeHackathonPhase` regression checks via `node:test`.

