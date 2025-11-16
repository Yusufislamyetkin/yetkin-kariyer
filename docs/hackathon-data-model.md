# Hackathon Module Data Model

This document defines the data structures required to enable friend networking, hackathon lifecycle management, project submissions, and reward distribution. It assumes a PostgreSQL + Prisma stack (per existing `prisma/schema.prisma`) and aligns with current user/chat infrastructure.

## Entity Overview

| Entity | Purpose | Key Relationships |
| --- | --- | --- |
| `User` | Existing account. Extend profile fields for hackathon participation. | Owns `Friendship` edges, `HackathonApplication`s, `ProjectSubmission`s, `BadgeAward`s, `Notification`s. |
| `Friendship` | Undirected friendship link with status tracking. | Links two `User`s; generates `Notification`s. |
| `Hackathon` | Core event definition (timeline, prizes, capacities). | Has many `HackathonApplication`s, `HackathonTeam`s, `ProjectSubmission`s, `BadgeRule`s, `Reward`s. |
| `HackathonApplication` | Individual application entry, optionally linked to a team. | Belongs to `Hackathon`, `User`, optional `HackathonTeam`. |
| `HackathonTeam` | Team container for multi-person submissions. | Has many `HackathonApplication`s, one `ProjectSubmission`. |
| `ProjectSubmission` | Hackathon submission metadata (GitHub repo, status). | Belongs to `Hackathon` and either `HackathonTeam` or `User`. |
| `Badge` | Catalog of attainable badges (global). | Joined via `BadgeRule`, awarded through `BadgeAward`. |
| `BadgeRule` | Criteria binding `Hackathon` events to specific badges. | Points to `Hackathon`, `Badge`. |
| `BadgeAward` | Issuance record for a badge to a participant/team. | Belongs to `User` (and optional `HackathonTeam`). |
| `Reward` | Physical or digital prize (hackathon-specific). | Belongs to `Hackathon`, redeemed by `RewardRedemption`. |
| `RewardRedemption` | Tracks fulfillment of rewards. | Links `Reward` to `User` or `HackathonTeam`. |
| `Notification` | Existing or extended channel for system events. | Linked to `User`, references source entity via polymorphic fields. |

## Schema Draft (Prisma-Oriented)

```text
model Friendship {
  id             String   @id @default(cuid())
  requesterId    String
  addresseeId    String
  status         FriendshipStatus
  requestedAt    DateTime @default(now())
  respondedAt    DateTime?
  blockedById    String?

  requester      User     @relation("FriendshipRequester", fields: [requesterId], references: [id])
  addressee      User     @relation("FriendshipAddressee", fields: [addresseeId], references: [id])
  blockedBy      User?    @relation("FriendshipBlocker", fields: [blockedById], references: [id])

  @@unique([requesterId, addresseeId])
  @@index([addresseeId, status])
  @@index([requesterId, status])
}

enum FriendshipStatus {
  pending
  accepted
  declined
  blocked
}

model Hackathon {
  id                  String      @id @default(cuid())
  slug                String      @unique
  title               String
  description         String
  organizerId         String
  applicationOpensAt  DateTime
  applicationClosesAt DateTime
  submissionOpensAt   DateTime
  submissionClosesAt  DateTime
  timezone            String      @default("UTC")
  visibility          HackathonVisibility @default(public)
  maxParticipants     Int?
  maxTeamSize         Int?        @default(1)
  minTeamSize         Int?        @default(1)
  tags                String[]
  requirements        Json?
  prizesSummary       String?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
  archivedAt          DateTime?

  organizer           User        @relation("OrganizedHackathons", fields: [organizerId], references: [id])
  applications        HackathonApplication[]
  teams               HackathonTeam[]
  submissions         ProjectSubmission[]
  rewards             Reward[]
  badgeRules          BadgeRule[]
}

enum HackathonVisibility {
  public
  invite_only
  private
}

model HackathonApplication {
  id             String    @id @default(cuid())
  hackathonId    String
  userId         String
  teamId         String?
  status         ApplicationStatus @default(pending_review)
  appliedAt      DateTime  @default(now())
  reviewedAt     DateTime?
  reviewerId     String?
  motivation     String?
  skills         String[]
  githubProfile  String?
  portfolioUrl   String?
  waitlistRank   Int?

  hackathon      Hackathon @relation(fields: [hackathonId], references: [id])
  user           User      @relation(fields: [userId], references: [id])
  team           HackathonTeam? @relation(fields: [teamId], references: [id])
  reviewer       User?     @relation("ApplicationReviewer", fields: [reviewerId], references: [id])

  @@unique([hackathonId, userId])
  @@index([hackathonId, status])
  @@index([teamId])
}

enum ApplicationStatus {
  pending_review
  auto_accepted
  approved
  waitlisted
  rejected
  withdrawn
}

model HackathonTeam {
  id            String   @id @default(cuid())
  hackathonId   String
  name          String
  slug          String   @unique
  creatorId     String
  inviteCode    String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lockedAt      DateTime?

  hackathon     Hackathon @relation(fields: [hackathonId], references: [id])
  creator       User      @relation(fields: [creatorId], references: [id])
  applications  HackathonApplication[]
  submission    ProjectSubmission?
}

model ProjectSubmission {
  id                String   @id @default(cuid())
  hackathonId       String
  userId            String?
  teamId            String?
  repoUrl           String
  branch            String   @default("main")
  commitSha         String?
  submittedAt       DateTime @default(now())
  lastValidatedAt   DateTime?
  status            SubmissionStatus @default(pending_validation)
  score             Float?
  judgingNotes      Json?
  presentationUrl   String?
  shortDescription  String?

  hackathon        Hackathon       @relation(fields: [hackathonId], references: [id])
  user             User?           @relation(fields: [userId], references: [id])
  team             HackathonTeam?  @relation(fields: [teamId], references: [id])

  @@check(teamId != null OR userId != null)
  @@unique([hackathonId, teamId])
  @@unique([hackathonId, userId])
  @@index([status])
}

enum SubmissionStatus {
  pending_validation
  valid
  late
  disqualified
  under_review
  finalist
  winner
}

model Badge {
  id           String    @id @default(cuid())
  slug         String    @unique
  name         String
  description  String
  category     String
  iconUrl      String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  rules        BadgeRule[]
  awards       BadgeAward[]
}

model BadgeRule {
  id            String   @id @default(cuid())
  hackathonId   String?
  badgeId       String
  trigger       BadgeTrigger
  triggerConfig Json?

  hackathon     Hackathon? @relation(fields: [hackathonId], references: [id])
  badge         Badge      @relation(fields: [badgeId], references: [id])
}

enum BadgeTrigger {
  application_submitted
  submission_on_time
  jury_selection
  winner
  organizer_custom
  community_vote
}

model BadgeAward {
  id            String   @id @default(cuid())
  badgeId       String
  userId        String
  teamId        String?
  hackathonId   String?
  awardedAt     DateTime @default(now())
  reason        String?
  metadata      Json?

  badge         Badge     @relation(fields: [badgeId], references: [id])
  user          User      @relation(fields: [userId], references: [id])
  team          HackathonTeam? @relation(fields: [teamId], references: [id])
  hackathon     Hackathon? @relation(fields: [hackathonId], references: [id])

  @@index([userId, badgeId])
  @@index([hackathonId])
}

model Reward {
  id             String   @id @default(cuid())
  hackathonId    String
  name           String
  description    String?
  type           RewardType
  inventory      Int?
  claimRequires  RewardClaimRequirement @default(automatic)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  hackathon      Hackathon @relation(fields: [hackathonId], references: [id])
  redemptions    RewardRedemption[]
}

enum RewardType {
  swag
  cash
  coupon
  mentorship
  credential
  other
}

enum RewardClaimRequirement {
  automatic
  manual_verification
  shipping_details
  external_link
}

model RewardRedemption {
  id             String   @id @default(cuid())
  rewardId       String
  userId         String?
  teamId         String?
  hackathonId    String
  status         RedemptionStatus @default(pending)
  requestedAt    DateTime @default(now())
  fulfilledAt    DateTime?
  notes          String?

  reward         Reward        @relation(fields: [rewardId], references: [id])
  user           User?         @relation(fields: [userId], references: [id])
  team           HackathonTeam? @relation(fields: [teamId], references: [id])
  hackathon      Hackathon     @relation(fields: [hackathonId], references: [id])

  @@check(teamId != null OR userId != null)
  @@index([status])
}

enum RedemptionStatus {
  pending
  approved
  shipped
  delivered
  cancelled
}
```

## Relationship Notes

- **User ↔ Friendship**: Represent as directed edges with unique composite key to avoid duplicates; treat accepted friendships as mutual.
- **Hackathon Windows**: Use four timestamps to enforce application/submission phases. Validate `applicationOpensAt < applicationClosesAt ≤ submissionOpensAt ≤ submissionClosesAt`.
- **Team Participation**: `HackathonTeam` optional—solo participants can skip team creation. Add constraints to ensure `teamId` is non-null when team size > 1.
- **Submissions**: Unique composite indexes guarantee one active submission per participant/team per hackathon.
- **Badge Rules**: `triggerConfig` schema validated at runtime (e.g., JSON schema) to capture criteria fields (thresholds, placements).
- **Rewards**: `inventory` decremented via transactions to prevent over-allocation.

## Migration Considerations

- Incrementally alter `prisma/schema.prisma`. Use new migration for each milestone (friendships, hackathons, submissions, rewards).
- Backfill existing `User` records with default hackathon profile fields if added (e.g., `displayName`, `githubUsername`).
- Use partial indexes or filtered unique constraints if the underlying database supports to enforce mutual exclusivity between `userId` and `teamId` in `ProjectSubmission`/`RewardRedemption`.
- Create background jobs to recalculate badge awards when rules change—track via `migrations/` or seed scripts.
- Seed base data:
  - Sample hackathon with realistic timeline.
  - Core badges (e.g., “First Submission”, “Winner”).
  - Reward catalog entries for test coverage.

## Data Integrity & Performance

- Add DB-level triggers or Prisma middleware to prevent submissions outside submission window.
- Implement cascading deletes carefully: prefer soft-deletion (`archivedAt`) to retain audit history.
- Index heavy query paths: upcoming deadlines (`submissionClosesAt`), pending applications, pending redemptions.
- Log audit trails (`AuditLog` table) for sensitive actions (friendship block, submission override) if compliance requires.

## Storage & Assets

- Store badge icons and hackathon banners in existing media storage (reuse `/api/upload`). Reference via URLs.
- For GitHub submissions, store `repoUrl`, `branch`, `commitSha`; avoid cloning content to keep storage minimal.
- Optionally maintain `ProjectArtifact` table if binary deliverables are needed later.

