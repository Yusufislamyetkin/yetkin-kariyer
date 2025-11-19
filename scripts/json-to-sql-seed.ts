import fs from "fs";
import path from "path";

type SeedData = {
  meta: {
    generatedAt: string;
    users: number;
    sourcePhotosDir: string;
    notes?: string;
  };
  users?: Array<{
    id: string;
    email: string;
    password: string | null;
    name: string;
    role: string;
    profileImage: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  userBadges?: Array<{
    id: string;
    userId: string;
    badgeId: string;
    earnedAt: string;
    isDisplayed: boolean;
    featuredOrder?: number | null;
  }>;
  quizAttempts?: Array<{
    id: string;
    userId: string;
    quizId: string;
    score: number;
    answers: Record<string, unknown>;
    aiAnalysis?: Record<string, unknown> | null;
    duration?: number | null;
    topic?: string | null;
    level?: string | null;
    completedAt: string;
  }>;
  testAttempts?: Array<{
    id: string;
    userId: string;
    quizId: string;
    metrics: Record<string, unknown>;
    aiAnalysis?: Record<string, unknown> | null;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
  liveCodingAttempts?: Array<{
    id: string;
    userId: string;
    quizId: string;
    metrics: Record<string, unknown>;
    code?: string | null;
    aiAnalysis?: Record<string, unknown> | null;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
  bugFixAttempts?: Array<{
    id: string;
    userId: string;
    quizId: string;
    metrics: Record<string, unknown>;
    fixedCode?: string | null;
    aiAnalysis?: Record<string, unknown> | null;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
  hackatonAttempts?: Array<{
    id: string;
    userId: string;
    quizId: string;
    hackathonId?: string | null;
    metrics: Record<string, unknown>;
    projectUrl?: string | null;
    aiAnalysis?: Record<string, unknown> | null;
    completedAt: string;
    createdAt: string;
    updatedAt: string;
  }>;
  userBalances?: Array<{
    userId: string;
    points: number;
    lifetimeXp: number;
    level: number;
  }>;
  userStreaks?: Array<{
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: string | null;
  }>;
};

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function formatTimestamp(iso: string): string {
  return `TIMESTAMP '${iso.replace("T", " ").replace("Z", "")}'`;
}

function formatJson(value: Record<string, unknown> | null | undefined): string {
  if (!value) return "NULL";
  return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
}

function formatNullableString(value: string | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return `'${escapeSqlString(value)}'`;
}

function formatNullableNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "NULL";
  return String(value);
}

function main() {
  const projectRoot = path.join(__dirname, "..");
  const jsonFile = path.join(projectRoot, "data", "seed-data", "seed-data-for-profile.json");
  const outputFile = path.join(projectRoot, "profile-seed-data.sql");

  if (!fs.existsSync(jsonFile)) {
    throw new Error(`JSON file not found: ${jsonFile}`);
  }

  const data: SeedData = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

  const lines: string[] = [];
  
  lines.push("-- Profile Seed Data");
  lines.push("-- Generated from seed-data-for-profile.json");
  lines.push(`-- Generated at: ${data.meta.generatedAt}`);
  lines.push(`-- Total users: ${data.meta.users}`);
  lines.push("");
  lines.push("BEGIN;");
  lines.push("");
  lines.push("-- Defer constraint checks until COMMIT");
  lines.push("-- This allows inserting data with foreign key references");
  lines.push("-- that may not exist yet in the database");
  lines.push("SET CONSTRAINTS ALL DEFERRED;");
  lines.push("");

  // Insert users
  if (data.users && data.users.length > 0) {
    lines.push("-- Insert users");
    lines.push('INSERT INTO "app_users" (');
    lines.push('    "id",');
    lines.push('    "email",');
    lines.push('    "password",');
    lines.push('    "name",');
    lines.push('    "role",');
    lines.push('    "profileImage",');
    lines.push('    "createdAt",');
    lines.push('    "updatedAt"');
    lines.push(') VALUES');

    const userValues = data.users.map((user, idx) => {
      const password = user.password || "$2b$10$defaultpasswordhashedvalueforseeddatageneration";
      const profileImage = user.profileImage?.replace(/\\/g, "/") || null;
      
      return `    (
        '${escapeSqlString(user.id)}',
        '${escapeSqlString(user.email)}',
        '${escapeSqlString(password)}',
        '${escapeSqlString(user.name)}',
        '${escapeSqlString(user.role)}',
        ${formatNullableString(profileImage)},
        ${formatTimestamp(user.createdAt)},
        ${formatTimestamp(user.updatedAt)}
    )${idx < data.users!.length - 1 ? "," : ";"}`;
    });

    lines.push(...userValues);
    lines.push("");
  }

  // Insert user badges
  if (data.userBadges && data.userBadges.length > 0) {
    lines.push("-- Insert user badges");
    lines.push('INSERT INTO "user_badges" (');
    lines.push('    "id",');
    lines.push('    "userId",');
    lines.push('    "badgeId",');
    lines.push('    "earnedAt",');
    lines.push('    "isDisplayed",');
    lines.push('    "featuredOrder"');
    lines.push(') VALUES');

    const badgeValues = data.userBadges.map((badge, idx) => {
      return `    (
        '${escapeSqlString(badge.id)}',
        '${escapeSqlString(badge.userId)}',
        '${escapeSqlString(badge.badgeId)}',
        ${formatTimestamp(badge.earnedAt)},
        ${badge.isDisplayed ? "TRUE" : "FALSE"},
        ${badge.featuredOrder !== null && badge.featuredOrder !== undefined ? String(badge.featuredOrder) : "NULL"}
    )${idx < data.userBadges!.length - 1 ? "," : ";"}`;
    });

    lines.push(...badgeValues);
    lines.push("");
  }

  // Insert quiz attempts (only for quizzes that exist in database)
  if (data.quizAttempts && data.quizAttempts.length > 0) {
    lines.push("-- Insert quiz attempts (only if quiz exists)");
    data.quizAttempts.forEach((attempt) => {
      lines.push(`INSERT INTO "quiz_attempts" (
    "id",
    "userId",
    "quizId",
    "score",
    "answers",
    "aiAnalysis",
    "duration",
    "topic",
    "level",
    "completedAt"
) SELECT
    '${escapeSqlString(attempt.id)}',
    '${escapeSqlString(attempt.userId)}',
    '${escapeSqlString(attempt.quizId)}',
    ${attempt.score},
    ${formatJson(attempt.answers)},
    ${formatJson(attempt.aiAnalysis)},
    ${formatNullableNumber(attempt.duration)},
    ${formatNullableString(attempt.topic)},
    ${formatNullableString(attempt.level)},
    ${formatTimestamp(attempt.completedAt)}
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = '${escapeSqlString(attempt.quizId)}')
ON CONFLICT DO NOTHING;`);
    });
    lines.push("");
  }

  // Insert test attempts (only for quizzes that exist in database)
  if (data.testAttempts && data.testAttempts.length > 0) {
    lines.push("-- Insert test attempts (only if quiz exists)");
    data.testAttempts.forEach((attempt) => {
      lines.push(`INSERT INTO "test_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    '${escapeSqlString(attempt.id)}',
    '${escapeSqlString(attempt.userId)}',
    '${escapeSqlString(attempt.quizId)}',
    ${formatJson(attempt.metrics)},
    ${formatJson(attempt.aiAnalysis)},
    ${formatTimestamp(attempt.completedAt)},
    ${formatTimestamp(attempt.createdAt)},
    ${formatTimestamp(attempt.updatedAt)}
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = '${escapeSqlString(attempt.quizId)}')
ON CONFLICT DO NOTHING;`);
    });
    lines.push("");
  }

  // Insert live coding attempts (only for quizzes that exist in database)
  if (data.liveCodingAttempts && data.liveCodingAttempts.length > 0) {
    lines.push("-- Insert live coding attempts (only if quiz exists)");
    data.liveCodingAttempts.forEach((attempt) => {
      lines.push(`INSERT INTO "live_coding_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "code",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    '${escapeSqlString(attempt.id)}',
    '${escapeSqlString(attempt.userId)}',
    '${escapeSqlString(attempt.quizId)}',
    ${formatJson(attempt.metrics)},
    ${formatNullableString(attempt.code)},
    ${formatJson(attempt.aiAnalysis)},
    ${formatTimestamp(attempt.completedAt)},
    ${formatTimestamp(attempt.createdAt)},
    ${formatTimestamp(attempt.updatedAt)}
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = '${escapeSqlString(attempt.quizId)}')
ON CONFLICT DO NOTHING;`);
    });
    lines.push("");
  }

  // Insert bug fix attempts (only for quizzes that exist in database)
  if (data.bugFixAttempts && data.bugFixAttempts.length > 0) {
    lines.push("-- Insert bug fix attempts (only if quiz exists)");
    data.bugFixAttempts.forEach((attempt) => {
      lines.push(`INSERT INTO "bug_fix_attempts" (
    "id",
    "userId",
    "quizId",
    "metrics",
    "fixedCode",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    '${escapeSqlString(attempt.id)}',
    '${escapeSqlString(attempt.userId)}',
    '${escapeSqlString(attempt.quizId)}',
    ${formatJson(attempt.metrics)},
    ${formatNullableString(attempt.fixedCode)},
    ${formatJson(attempt.aiAnalysis)},
    ${formatTimestamp(attempt.completedAt)},
    ${formatTimestamp(attempt.createdAt)},
    ${formatTimestamp(attempt.updatedAt)}
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = '${escapeSqlString(attempt.quizId)}')
ON CONFLICT DO NOTHING;`);
    });
    lines.push("");
  }

  // Insert hackathon attempts (only for quizzes that exist in database)
  if (data.hackatonAttempts && data.hackatonAttempts.length > 0) {
    lines.push("-- Insert hackathon attempts (only if quiz exists)");
    data.hackatonAttempts.forEach((attempt) => {
      lines.push(`INSERT INTO "hackaton_attempts" (
    "id",
    "userId",
    "quizId",
    "hackathonId",
    "metrics",
    "projectUrl",
    "aiAnalysis",
    "completedAt",
    "createdAt",
    "updatedAt"
) SELECT
    '${escapeSqlString(attempt.id)}',
    '${escapeSqlString(attempt.userId)}',
    '${escapeSqlString(attempt.quizId)}',
    ${formatNullableString(attempt.hackathonId)},
    ${formatJson(attempt.metrics)},
    ${formatNullableString(attempt.projectUrl)},
    ${formatJson(attempt.aiAnalysis)},
    ${formatTimestamp(attempt.completedAt)},
    ${formatTimestamp(attempt.createdAt)},
    ${formatTimestamp(attempt.updatedAt)}
WHERE EXISTS (SELECT 1 FROM "quizzes" WHERE "id" = '${escapeSqlString(attempt.quizId)}')
ON CONFLICT DO NOTHING;`);
    });
    lines.push("");
  }

  // Insert user balances
  if (data.userBalances && data.userBalances.length > 0) {
    lines.push("-- Insert user balances");
    lines.push('INSERT INTO "user_balances" (');
    lines.push('    "userId",');
    lines.push('    "points",');
    lines.push('    "lifetimeXp",');
    lines.push('    "level"');
    lines.push(') VALUES');

    const balanceValues = data.userBalances.map((balance, idx) => {
      return `    (
        '${escapeSqlString(balance.userId)}',
        ${balance.points},
        ${balance.lifetimeXp},
        ${balance.level}
    )${idx < data.userBalances!.length - 1 ? "," : ";"}`;
    });

    lines.push(...balanceValues);
    lines.push("");
  }

  // Insert user streaks
  if (data.userStreaks && data.userStreaks.length > 0) {
    lines.push("-- Insert user streaks");
    lines.push('INSERT INTO "user_streaks" (');
    lines.push('    "userId",');
    lines.push('    "currentStreak",');
    lines.push('    "longestStreak",');
    lines.push('    "lastActivityDate"');
    lines.push(') VALUES');

    const streakValues = data.userStreaks.map((streak, idx) => {
      return `    (
        '${escapeSqlString(streak.userId)}',
        ${streak.currentStreak},
        ${streak.longestStreak},
        ${streak.lastActivityDate ? formatTimestamp(streak.lastActivityDate) : "NULL"}
    )${idx < data.userStreaks!.length - 1 ? "," : ";"}`;
    });

    lines.push(...streakValues);
    lines.push("");
  }

  lines.push("COMMIT;");
  lines.push("");

  const sql = lines.join("\n");
  fs.writeFileSync(outputFile, sql, "utf8");

  console.log(`✓ Generated SQL file: ${path.relative(projectRoot, outputFile)}`);
  console.log(`  Total lines: ${lines.length}`);
  console.log(`  Users: ${data.users?.length || 0}`);
  console.log(`  User Badges: ${data.userBadges?.length || 0}`);
  console.log(`  Quiz Attempts: ${data.quizAttempts?.length || 0}`);
  console.log(`  Test Attempts: ${data.testAttempts?.length || 0}`);
  console.log(`  Live Coding Attempts: ${data.liveCodingAttempts?.length || 0}`);
  console.log(`  Bug Fix Attempts: ${data.bugFixAttempts?.length || 0}`);
  console.log(`  Hackathon Attempts: ${data.hackatonAttempts?.length || 0}`);
  console.log(`  User Balances: ${data.userBalances?.length || 0}`);
  console.log(`  User Streaks: ${data.userStreaks?.length || 0}`);
}

main();

