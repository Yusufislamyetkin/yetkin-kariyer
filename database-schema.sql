-- Kariyer Platform Database Schema
-- Bu script tüm veritabanı şemasını tek seferde kurar.
-- Çalıştırmadan önce önemli verilerinizi yedekleyin; tablo ve enumlar kaldırılıp yeniden oluşturulur.

BEGIN;

-- ============================================
-- 1. TABLOLARI VE ENUM'LARI TEMİZLE
-- ============================================

DROP TABLE IF EXISTS "post_saves" CASCADE;
DROP TABLE IF EXISTS "post_comments" CASCADE;
DROP TABLE IF EXISTS "post_likes" CASCADE;
DROP TABLE IF EXISTS "posts" CASCADE;
DROP TABLE IF EXISTS "chat_message_receipts" CASCADE;
DROP TABLE IF EXISTS "chat_attachments" CASCADE;
DROP TABLE IF EXISTS "chat_messages" CASCADE;
DROP TABLE IF EXISTS "chat_group_memberships" CASCADE;
DROP TABLE IF EXISTS "chat_groups" CASCADE;
DROP TABLE IF EXISTS "friendships" CASCADE;
DROP TABLE IF EXISTS "hackathon_submissions" CASCADE;
DROP TABLE IF EXISTS "hackathon_team_members" CASCADE;
DROP TABLE IF EXISTS "hackathon_teams" CASCADE;
DROP TABLE IF EXISTS "hackathon_applications" CASCADE;
DROP TABLE IF EXISTS "hackathons" CASCADE;
DROP TABLE IF EXISTS "dashboard_goal_plans" CASCADE;
DROP TABLE IF EXISTS "hackaton_leaderboard_entries" CASCADE;
DROP TABLE IF EXISTS "bug_fix_leaderboard_entries" CASCADE;
DROP TABLE IF EXISTS "live_coding_leaderboard_entries" CASCADE;
DROP TABLE IF EXISTS "test_leaderboard_entries" CASCADE;
DROP TABLE IF EXISTS "hackaton_attempts" CASCADE;
DROP TABLE IF EXISTS "bug_fix_attempts" CASCADE;
DROP TABLE IF EXISTS "live_coding_attempts" CASCADE;
DROP TABLE IF EXISTS "test_attempts" CASCADE;
DROP TABLE IF EXISTS "user_streaks" CASCADE;
DROP TABLE IF EXISTS "employer_comments" CASCADE;
DROP TABLE IF EXISTS "leaderboard_entries" CASCADE;
DROP TABLE IF EXISTS "daily_goals" CASCADE;
DROP TABLE IF EXISTS "user_badges" CASCADE;
DROP TABLE IF EXISTS "badges" CASCADE;
DROP TABLE IF EXISTS "lesson_completions" CASCADE;
DROP TABLE IF EXISTS "lesson_mini_test_attempts" CASCADE;
DROP TABLE IF EXISTS "wrong_questions" CASCADE;
DROP TABLE IF EXISTS "assistant_threads" CASCADE;
DROP TABLE IF EXISTS "learning_paths" CASCADE;
DROP TABLE IF EXISTS "career_plans" CASCADE;
DROP TABLE IF EXISTS "freelancer_bids" CASCADE;
DROP TABLE IF EXISTS "freelancer_projects" CASCADE;
DROP TABLE IF EXISTS "job_applications" CASCADE;
DROP TABLE IF EXISTS "jobs" CASCADE;
DROP TABLE IF EXISTS "cvs" CASCADE;
DROP TABLE IF EXISTS "cv_templates" CASCADE;
DROP TABLE IF EXISTS "interview_attempts" CASCADE;
DROP TABLE IF EXISTS "interviews" CASCADE;
DROP TABLE IF EXISTS "quiz_attempts" CASCADE;
DROP TABLE IF EXISTS "quizzes" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "app_users" CASCADE;

DROP TYPE IF EXISTS "ChatAttachmentType" CASCADE;
DROP TYPE IF EXISTS "ChatMessageType" CASCADE;
DROP TYPE IF EXISTS "ChatGroupRole" CASCADE;
DROP TYPE IF EXISTS "ChatGroupVisibility" CASCADE;
DROP TYPE IF EXISTS "LeaderboardPeriod" CASCADE;
DROP TYPE IF EXISTS "GoalFrequency" CASCADE;
DROP TYPE IF EXISTS "GoalType" CASCADE;
DROP TYPE IF EXISTS "BadgeRarity" CASCADE;
DROP TYPE IF EXISTS "BadgeCategory" CASCADE;
DROP TYPE IF EXISTS "WrongQuestionStatus" CASCADE;
DROP TYPE IF EXISTS "ApplicationStatus" CASCADE;
DROP TYPE IF EXISTS "JobStatus" CASCADE;
DROP TYPE IF EXISTS "EducationType" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "FriendshipStatus" CASCADE;
DROP TYPE IF EXISTS "HackathonVisibility" CASCADE;
DROP TYPE IF EXISTS "HackathonPhase" CASCADE;
DROP TYPE IF EXISTS "HackathonApplicationStatus" CASCADE;
DROP TYPE IF EXISTS "HackathonTeamRole" CASCADE;
DROP TYPE IF EXISTS "HackathonTeamMemberStatus" CASCADE;
DROP TYPE IF EXISTS "HackathonSubmissionStatus" CASCADE;

-- ============================================
-- 2. ENUM'LARI OLUŞTUR
-- ============================================

CREATE TYPE "UserRole" AS ENUM ('candidate', 'employer', 'admin');
CREATE TYPE "JobStatus" AS ENUM ('draft', 'published', 'closed');
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'reviewing', 'accepted', 'rejected');
CREATE TYPE "WrongQuestionStatus" AS ENUM ('not_reviewed', 'reviewed', 'understood');
CREATE TYPE "BadgeCategory" AS ENUM ('test_count', 'score', 'topic', 'streak', 'special');
CREATE TYPE "BadgeRarity" AS ENUM ('common', 'rare', 'epic', 'legendary');
CREATE TYPE "GoalType" AS ENUM ('test_count', 'topic_complete', 'score_target', 'streak_maintain');
CREATE TYPE "LeaderboardPeriod" AS ENUM ('daily', 'monthly');
CREATE TYPE "EducationType" AS ENUM ('TEST', 'LIVE_CODING', 'BUG_FIX', 'HACKATON', 'MINI_TEST');
CREATE TYPE "ChatGroupRole" AS ENUM ('member', 'moderator', 'admin');
CREATE TYPE "ChatGroupVisibility" AS ENUM ('public', 'private');
CREATE TYPE "ChatMessageType" AS ENUM ('text', 'image', 'audio', 'video', 'file', 'gif', 'system');
CREATE TYPE "ChatAttachmentType" AS ENUM ('image', 'audio', 'video', 'file', 'gif');
CREATE TYPE "FriendshipStatus" AS ENUM ('pending', 'accepted', 'declined', 'blocked');
CREATE TYPE "HackathonVisibility" AS ENUM ('public', 'invite_only', 'private');
CREATE TYPE "HackathonPhase" AS ENUM ('draft', 'upcoming', 'applications', 'submission', 'judging', 'completed', 'archived');
CREATE TYPE "HackathonApplicationStatus" AS ENUM ('pending_review', 'auto_accepted', 'approved', 'waitlisted', 'rejected', 'withdrawn');
CREATE TYPE "HackathonTeamRole" AS ENUM ('leader', 'co_leader', 'member');
CREATE TYPE "HackathonTeamMemberStatus" AS ENUM ('invited', 'active', 'left', 'removed');
CREATE TYPE "HackathonSubmissionStatus" AS ENUM ('pending', 'valid', 'late', 'disqualified', 'under_review', 'finalist', 'winner');
CREATE TYPE "GoalFrequency" AS ENUM ('daily', 'weekly', 'monthly');

-- ============================================
-- 3. TABLOLARI OLUŞTUR
-- ============================================

CREATE TABLE "app_users" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'candidate',
    "profileImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "courses" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "field" TEXT,
    "subCategory" TEXT,
    "expertise" TEXT,
    "topic" TEXT,
    "topicContent" TEXT,
    "difficulty" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "estimatedDuration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "quizzes" (
    "id" TEXT PRIMARY KEY,
    "courseId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "topic" TEXT,
    "type" "EducationType" NOT NULL DEFAULT 'TEST',
    "level" TEXT,
    "questions" JSONB NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 60,
    "lessonSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quizzes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quizzes_passing_score_check" CHECK ("passingScore" >= 0 AND "passingScore" <= 100),
    CONSTRAINT "quizzes_course_or_lesson_check" CHECK (("courseId" IS NOT NULL) OR ("lessonSlug" IS NOT NULL))
);

CREATE TABLE "hackathons" (
    "id" TEXT PRIMARY KEY,
    "quizId" TEXT UNIQUE,
    "organizerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bannerUrl" TEXT,
    "visibility" "HackathonVisibility" NOT NULL DEFAULT 'public',
    "phase" "HackathonPhase" NOT NULL DEFAULT 'draft',
    "applicationOpensAt" TIMESTAMP(3) NOT NULL,
    "applicationClosesAt" TIMESTAMP(3) NOT NULL,
    "submissionOpensAt" TIMESTAMP(3) NOT NULL,
    "submissionClosesAt" TIMESTAMP(3) NOT NULL,
    "judgingOpensAt" TIMESTAMP(3),
    "judgingClosesAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "maxParticipants" INTEGER,
    "minTeamSize" INTEGER DEFAULT 1,
    "maxTeamSize" INTEGER DEFAULT 1,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "requirements" JSONB,
    "prizesSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "hackathons_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathons_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathons_min_max_team_size_check" CHECK (
        ("minTeamSize" IS NULL AND "maxTeamSize" IS NULL) OR
        ("minTeamSize" IS NOT NULL AND "maxTeamSize" IS NOT NULL AND "minTeamSize" <= "maxTeamSize" AND "minTeamSize" > 0)
    ),
    CONSTRAINT "hackathons_application_dates_check" CHECK ("applicationOpensAt" < "applicationClosesAt"),
    CONSTRAINT "hackathons_submission_dates_check" CHECK ("submissionOpensAt" < "submissionClosesAt"),
    CONSTRAINT "hackathons_judging_dates_check" CHECK (
        ("judgingOpensAt" IS NULL AND "judgingClosesAt" IS NULL) OR
        ("judgingOpensAt" IS NOT NULL AND "judgingClosesAt" IS NOT NULL AND "judgingOpensAt" < "judgingClosesAt")
    )
);

CREATE TABLE "quiz_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "aiAnalysis" JSONB,
    "duration" INTEGER,
    "topic" TEXT,
    "level" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_attempts_score_check" CHECK ("score" >= 0 AND "score" <= 100),
    CONSTRAINT "quiz_attempts_duration_check" CHECK ("duration" IS NULL OR "duration" > 0)
);

CREATE TABLE "lesson_mini_test_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "lessonSlug" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lesson_mini_test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_mini_test_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_mini_test_attempts_score_check" CHECK ("score" >= 0 AND "score" <= 100),
    CONSTRAINT "lesson_mini_test_attempts_questions_check" CHECK ("totalQuestions" > 0 AND "correctCount" >= 0 AND "correctCount" <= "totalQuestions")
);

CREATE INDEX "lesson_mini_test_attempts_lessonSlug_idx" ON "lesson_mini_test_attempts" ("lessonSlug");
CREATE INDEX "lesson_mini_test_attempts_user_lesson_idx" ON "lesson_mini_test_attempts" ("userId", "lessonSlug");

CREATE TABLE "lesson_completions" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT,
    "lessonSlug" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "miniTestAttemptId" TEXT,
    "miniTestScore" INTEGER,
    "miniTestPassed" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "lesson_completions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lesson_completions_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "lesson_completions_miniTestAttemptId_fkey" FOREIGN KEY ("miniTestAttemptId") REFERENCES "lesson_mini_test_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "lesson_completions_user_lesson_key" ON "lesson_completions" ("userId", "lessonSlug");
CREATE INDEX "lesson_completions_lessonSlug_idx" ON "lesson_completions" ("lessonSlug");

CREATE TABLE "interviews" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "questions" JSONB NOT NULL,
    "duration" INTEGER,
    "type" TEXT,
    "difficulty" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "interview_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "videoUrl" TEXT,
    "transcript" TEXT,
    "aiScore" INTEGER,
    "aiFeedback" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "interview_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interview_attempts_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "interview_attempts_ai_score_check" CHECK ("aiScore" IS NULL OR ("aiScore" >= 0 AND "aiScore" <= 100))
);

CREATE TABLE "cv_templates" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "preview" TEXT,
    "structure" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "cvs" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "atsOptimized" BOOLEAN NOT NULL DEFAULT FALSE,
    "aiMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cvs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cvs_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "cv_templates"("id") ON UPDATE CASCADE
);

CREATE TABLE "jobs" (
    "id" TEXT PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "location" TEXT,
    "salary" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "jobs_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "job_applications" (
    "id" TEXT PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "score" INTEGER,
    "notes" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "job_applications_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cvs"("id") ON UPDATE CASCADE,
    CONSTRAINT "job_applications_score_check" CHECK ("score" IS NULL OR ("score" >= 0 AND "score" <= 100))
);

CREATE TABLE "freelancer_projects" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "freelancer_projects_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "freelancer_projects_budget_check" CHECK ("budget" IS NULL OR "budget" > 0),
    CONSTRAINT "freelancer_projects_deadline_check" CHECK ("deadline" IS NULL OR "deadline" > "createdAt")
);

CREATE TABLE "freelancer_bids" (
    "id" TEXT PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "freelancer_bids_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "freelancer_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "freelancer_bids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "freelancer_bids_amount_check" CHECK ("amount" > 0)
);

CREATE TABLE "career_plans" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "goals" JSONB NOT NULL,
    "roadmap" JSONB NOT NULL,
    "recommendedCourses" JSONB,
    "skillsToDevelop" JSONB,
    "timeline" TEXT,
    "summary" TEXT,
    "aiGenerated" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "learning_paths" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courses" JSONB NOT NULL,
    "aiRecommended" BOOLEAN NOT NULL DEFAULT FALSE,
    "progress" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "learning_paths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "assistant_threads" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "threadId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assistant_threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "wrong_questions" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizAttemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "userAnswer" TEXT NOT NULL,
    "status" "WrongQuestionStatus" NOT NULL DEFAULT 'not_reviewed',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wrong_questions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "wrong_questions_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "badges" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "criteria" JSONB NOT NULL,
    "rarity" "BadgeRarity" NOT NULL DEFAULT 'common',
    "points" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "badges_points_check" CHECK ("points" >= 0)
);

CREATE TABLE "user_badges" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDisplayed" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_badges_userId_badgeId_key" UNIQUE ("userId", "badgeId")
);

CREATE TABLE "daily_goals" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "goalType" "GoalType" NOT NULL,
    "targetValue" INTEGER NOT NULL,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT FALSE,
    "completedAt" TIMESTAMP(3),
    "autoGenerated" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "daily_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "daily_goals_userId_date_goalType_key" UNIQUE ("userId", "date", "goalType"),
    CONSTRAINT "daily_goals_target_value_check" CHECK ("targetValue" > 0),
    CONSTRAINT "daily_goals_current_value_check" CHECK ("currentValue" >= 0)
);

CREATE TABLE "dashboard_goal_plans" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "frequency" "GoalFrequency" NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE,
    "goals" JSONB NOT NULL,
    "source" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextUpdateAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dashboard_goal_plans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dashboard_goal_plans_userId_frequency_periodStart_key" UNIQUE ("userId", "frequency", "periodStart")
);

CREATE TABLE "leaderboard_entries" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodDate" TEXT NOT NULL,
    "quizCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "leaderboard_entries_userId_period_periodDate_key" UNIQUE ("userId", "period", "periodDate")
);

CREATE TABLE "employer_comments" (
    "id" TEXT PRIMARY KEY,
    "employerId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "badgeId" TEXT,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "employer_comments_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employer_comments_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "employer_comments_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "employer_comments_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5),
    CONSTRAINT "employer_comments_different_users_check" CHECK ("employerId" != "candidateId")
);

CREATE TABLE "user_streaks" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3),
    "totalDaysActive" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_streaks_current_streak_check" CHECK ("currentStreak" >= 0),
    CONSTRAINT "user_streaks_longest_streak_check" CHECK ("longestStreak" >= 0),
    CONSTRAINT "user_streaks_total_days_check" CHECK ("totalDaysActive" >= 0),
    CONSTRAINT "user_streaks_streak_consistency_check" CHECK ("currentStreak" <= "longestStreak" OR "longestStreak" = 0)
);

CREATE TABLE "test_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "aiAnalysis" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "test_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "test_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "live_coding_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "code" TEXT,
    "aiAnalysis" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "live_coding_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "live_coding_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "bug_fix_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "fixedCode" TEXT,
    "aiAnalysis" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bug_fix_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bug_fix_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "hackaton_attempts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "hackathonId" TEXT,
    "metrics" JSONB NOT NULL,
    "projectUrl" TEXT,
    "aiAnalysis" JSONB,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hackaton_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackaton_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackaton_attempts_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "hackathon_teams" (
    "id" TEXT PRIMARY KEY,
    "hackathonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "creatorId" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    CONSTRAINT "hackathon_teams_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_teams_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "hackathon_applications" (
    "id" TEXT PRIMARY KEY,
    "hackathonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "status" "HackathonApplicationStatus" NOT NULL DEFAULT 'pending_review',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "motivation" TEXT,
    "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "githubProfile" TEXT,
    "portfolioUrl" TEXT,
    "waitlistRank" INTEGER,
    "responses" JSONB,
    CONSTRAINT "hackathon_applications_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_applications_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "hackathon_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_applications_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_applications_hackathonId_userId_key" UNIQUE ("hackathonId", "userId")
);

CREATE TABLE "hackathon_team_members" (
    "id" TEXT PRIMARY KEY,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "HackathonTeamRole" NOT NULL DEFAULT 'member',
    "status" "HackathonTeamMemberStatus" NOT NULL DEFAULT 'invited',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invitedById" TEXT,
    CONSTRAINT "hackathon_team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "hackathon_teams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_team_members_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_team_members_teamId_userId_key" UNIQUE ("teamId", "userId")
);

CREATE TABLE "hackathon_submissions" (
    "id" TEXT PRIMARY KEY,
    "hackathonId" TEXT NOT NULL,
    "teamId" TEXT UNIQUE,
    "userId" TEXT,
    "attemptId" TEXT,
    "repoUrl" TEXT NOT NULL,
    "branch" TEXT NOT NULL DEFAULT 'main',
    "commitSha" TEXT,
    "title" TEXT,
    "summary" TEXT,
    "presentationUrl" TEXT,
    "demoUrl" TEXT,
    "status" "HackathonSubmissionStatus" NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hackathon_submissions_hackathonId_fkey" FOREIGN KEY ("hackathonId") REFERENCES "hackathons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackathon_submissions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "hackathon_teams"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_submissions_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "hackaton_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "hackathon_submissions_hackathonId_teamId_key" UNIQUE ("hackathonId", "teamId"),
    CONSTRAINT "hackathon_submissions_hackathonId_userId_key" UNIQUE ("hackathonId", "userId"),
    CONSTRAINT "hackathon_submissions_attemptId_key" UNIQUE ("attemptId"),
    CONSTRAINT "hackathon_submissions_team_or_user_check" CHECK (
        ("teamId" IS NOT NULL AND "userId" IS NULL) OR
        ("teamId" IS NULL AND "userId" IS NOT NULL)
    )
);

CREATE TABLE "friendships" (
    "id" TEXT PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'pending',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "blockedById" TEXT,
    CONSTRAINT "friendships_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friendships_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "friendships_blockedById_fkey" FOREIGN KEY ("blockedById") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "friendships_requesterId_addresseeId_key" UNIQUE ("requesterId", "addresseeId"),
    CONSTRAINT "friendships_different_users_check" CHECK ("requesterId" != "addresseeId")
);

CREATE TABLE "test_leaderboard_entries" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodDate" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "test_leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "test_leaderboard_entries_userId_period_periodDate_key" UNIQUE ("userId", "period", "periodDate")
);

CREATE TABLE "live_coding_leaderboard_entries" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodDate" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "live_coding_leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "live_coding_leaderboard_entries_userId_period_periodDate_key" UNIQUE ("userId", "period", "periodDate")
);

CREATE TABLE "bug_fix_leaderboard_entries" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodDate" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bug_fix_leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bug_fix_leaderboard_entries_userId_period_periodDate_key" UNIQUE ("userId", "period", "periodDate")
);

CREATE TABLE "hackaton_leaderboard_entries" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "period" "LeaderboardPeriod" NOT NULL,
    "periodDate" TEXT NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "averageScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "highestScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "points" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "hackaton_leaderboard_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "hackaton_leaderboard_entries_userId_period_periodDate_key" UNIQUE ("userId", "period", "periodDate")
);

CREATE TABLE "chat_groups" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "visibility" "ChatGroupVisibility" NOT NULL DEFAULT 'public',
    "allowLinkJoin" BOOLEAN NOT NULL DEFAULT FALSE,
    "inviteCode" TEXT UNIQUE,
    "createdById" TEXT,
    "expertise" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_groups_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "app_users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "chat_group_memberships" (
    "id" TEXT PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ChatGroupRole" NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "isMuted" BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT "chat_group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_group_memberships_groupId_userId_key" UNIQUE ("groupId", "userId")
);

CREATE TABLE "chat_messages" (
    "id" TEXT PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL DEFAULT 'text',
    "content" TEXT,
    "mentionIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "chat_messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "chat_attachments" (
    "id" TEXT PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ChatAttachmentType" NOT NULL,
    "metadata" JSONB,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "chat_message_receipts" (
    "id" TEXT PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_message_receipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_message_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_message_receipts_messageId_userId_key" UNIQUE ("messageId", "userId")
);

-- ============================================
-- Social Media Posts Tables
-- ============================================

CREATE TABLE "posts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "post_likes" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_likes_postId_userId_key" UNIQUE ("postId", "userId")
);

CREATE TABLE "post_comments" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "post_saves" (
    "id" TEXT PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "post_saves_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_saves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_saves_postId_userId_key" UNIQUE ("postId", "userId")
);

-- ============================================
-- 4. REALTIME PUBLICATION AYARLARI
-- ============================================

-- Chat altyapısı SignalR kullanıyor, Supabase Realtime gerekmiyor
ALTER TABLE public.chat_groups REPLICA IDENTITY FULL;
ALTER TABLE public.app_users REPLICA IDENTITY FULL;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) - OPSİYONEL
-- ============================================

-- RLS'yi aktif et (production için önerilir, test için devre dışı bırakılabilir)
-- ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Test için RLS'yi devre dışı bırak (production'da mutlaka aktif et!)
ALTER TABLE public.chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. İNDEKSLERİ OLUŞTUR
-- ============================================

CREATE INDEX IF NOT EXISTS "hackathons_organizerId_idx" ON "hackathons"("organizerId");
CREATE INDEX IF NOT EXISTS "hackathon_applications_hackathonId_status_idx" ON "hackathon_applications"("hackathonId", "status");
CREATE INDEX IF NOT EXISTS "hackathon_applications_teamId_idx" ON "hackathon_applications"("teamId");
CREATE INDEX IF NOT EXISTS "hackathon_teams_hackathonId_idx" ON "hackathon_teams"("hackathonId");
CREATE INDEX IF NOT EXISTS "hackathon_team_members_userId_idx" ON "hackathon_team_members"("userId");
CREATE INDEX IF NOT EXISTS "hackathon_submissions_hackathonId_status_idx" ON "hackathon_submissions"("hackathonId", "status");
CREATE INDEX IF NOT EXISTS "friendships_addresseeId_status_idx" ON "friendships"("addresseeId", "status");
CREATE INDEX IF NOT EXISTS "friendships_requesterId_status_idx" ON "friendships"("requesterId", "status");
CREATE INDEX IF NOT EXISTS "dashboard_goal_plans_userId_frequency_idx" ON "dashboard_goal_plans"("userId", "frequency");
CREATE INDEX IF NOT EXISTS "dashboard_goal_plans_userId_frequency_nextUpdateAt_idx" ON "dashboard_goal_plans"("userId", "frequency", "nextUpdateAt");
CREATE INDEX IF NOT EXISTS "quiz_attempts_userId_idx" ON "quiz_attempts"("userId");
CREATE INDEX IF NOT EXISTS "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "interview_attempts_userId_idx" ON "interview_attempts"("userId");
CREATE INDEX IF NOT EXISTS "interview_attempts_interviewId_idx" ON "interview_attempts"("interviewId");
CREATE INDEX IF NOT EXISTS "cvs_userId_idx" ON "cvs"("userId");
CREATE INDEX IF NOT EXISTS "jobs_employerId_idx" ON "jobs"("employerId");
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs"("status");
CREATE INDEX IF NOT EXISTS "job_applications_userId_idx" ON "job_applications"("userId");
CREATE INDEX IF NOT EXISTS "job_applications_jobId_idx" ON "job_applications"("jobId");
CREATE INDEX IF NOT EXISTS "freelancer_projects_createdBy_idx" ON "freelancer_projects"("createdBy");
CREATE INDEX IF NOT EXISTS "freelancer_projects_status_idx" ON "freelancer_projects"("status");
CREATE INDEX IF NOT EXISTS "freelancer_bids_projectId_idx" ON "freelancer_bids"("projectId");
CREATE INDEX IF NOT EXISTS "freelancer_bids_userId_idx" ON "freelancer_bids"("userId");
CREATE INDEX IF NOT EXISTS "freelancer_bids_status_idx" ON "freelancer_bids"("status");
CREATE INDEX IF NOT EXISTS "career_plans_userId_idx" ON "career_plans"("userId");
CREATE INDEX IF NOT EXISTS "learning_paths_userId_idx" ON "learning_paths"("userId");
CREATE INDEX IF NOT EXISTS "assistant_threads_createdAt_idx" ON "assistant_threads"("createdAt");
CREATE INDEX IF NOT EXISTS "wrong_questions_userId_idx" ON "wrong_questions"("userId");
CREATE INDEX IF NOT EXISTS "wrong_questions_quizAttemptId_idx" ON "wrong_questions"("quizAttemptId");
CREATE INDEX IF NOT EXISTS "daily_goals_userId_idx" ON "daily_goals"("userId", "date");
CREATE INDEX IF NOT EXISTS "leaderboard_entries_period_idx" ON "leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "leaderboard_entries_userId_idx" ON "leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "employer_comments_candidateId_idx" ON "employer_comments"("candidateId");
CREATE INDEX IF NOT EXISTS "employer_comments_employerId_idx" ON "employer_comments"("employerId");
CREATE INDEX IF NOT EXISTS "user_streaks_userId_idx" ON "user_streaks"("userId");
CREATE INDEX IF NOT EXISTS "test_attempts_userId_completedAt_idx" ON "test_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "test_attempts_quizId_idx" ON "test_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "live_coding_attempts_userId_completedAt_idx" ON "live_coding_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "live_coding_attempts_quizId_idx" ON "live_coding_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "bug_fix_attempts_userId_completedAt_idx" ON "bug_fix_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "bug_fix_attempts_quizId_idx" ON "bug_fix_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "hackaton_attempts_userId_completedAt_idx" ON "hackaton_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "hackaton_attempts_quizId_idx" ON "hackaton_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "hackaton_attempts_hackathonId_idx" ON "hackaton_attempts"("hackathonId");
CREATE INDEX IF NOT EXISTS "test_leaderboard_entries_period_idx" ON "test_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "test_leaderboard_entries_userId_idx" ON "test_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "live_coding_leaderboard_entries_period_idx" ON "live_coding_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "live_coding_leaderboard_entries_userId_idx" ON "live_coding_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "bug_fix_leaderboard_entries_period_idx" ON "bug_fix_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "bug_fix_leaderboard_entries_userId_idx" ON "bug_fix_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "hackaton_leaderboard_entries_period_idx" ON "hackaton_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "hackaton_leaderboard_entries_userId_idx" ON "hackaton_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "chat_groups_slug_idx" ON "chat_groups"("slug");
CREATE INDEX IF NOT EXISTS "chat_groups_createdById_idx" ON "chat_groups"("createdById");
CREATE INDEX IF NOT EXISTS "chat_group_memberships_userId_idx" ON "chat_group_memberships"("userId");
CREATE INDEX IF NOT EXISTS "chat_messages_groupId_createdAt_idx" ON "chat_messages"("groupId", "createdAt");
CREATE INDEX IF NOT EXISTS "chat_messages_userId_idx" ON "chat_messages"("userId");
CREATE INDEX IF NOT EXISTS "chat_attachments_messageId_idx" ON "chat_attachments"("messageId");
CREATE INDEX IF NOT EXISTS "chat_message_receipts_userId_idx" ON "chat_message_receipts"("userId");
CREATE INDEX IF NOT EXISTS "posts_userId_idx" ON "posts"("userId");
CREATE INDEX IF NOT EXISTS "posts_createdAt_idx" ON "posts"("createdAt");
CREATE INDEX IF NOT EXISTS "post_likes_postId_idx" ON "post_likes"("postId");
CREATE INDEX IF NOT EXISTS "post_likes_userId_idx" ON "post_likes"("userId");
CREATE INDEX IF NOT EXISTS "post_comments_postId_idx" ON "post_comments"("postId");
CREATE INDEX IF NOT EXISTS "post_comments_postId_createdAt_idx" ON "post_comments"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS "post_comments_userId_idx" ON "post_comments"("userId");
CREATE INDEX IF NOT EXISTS "post_saves_postId_idx" ON "post_saves"("postId");
CREATE INDEX IF NOT EXISTS "post_saves_userId_idx" ON "post_saves"("userId");
CREATE INDEX IF NOT EXISTS "quizzes_courseId_idx" ON "quizzes"("courseId");
CREATE INDEX IF NOT EXISTS "quizzes_lessonSlug_idx" ON "quizzes"("lessonSlug");
CREATE INDEX IF NOT EXISTS "quizzes_type_idx" ON "quizzes"("type");
CREATE INDEX IF NOT EXISTS "quizzes_courseId_type_idx" ON "quizzes"("courseId", "type");
CREATE INDEX IF NOT EXISTS "courses_topic_idx" ON "courses"("topic");
CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses"("category");
CREATE INDEX IF NOT EXISTS "courses_field_idx" ON "courses"("field");
CREATE INDEX IF NOT EXISTS "courses_difficulty_idx" ON "courses"("difficulty");

-- ============================================
-- 7. BİLGİLENDİRME
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Database schema created successfully.';
    RAISE NOTICE 'Enums: UserRole, JobStatus, ApplicationStatus, WrongQuestionStatus, BadgeCategory, BadgeRarity, GoalType, GoalFrequency, LeaderboardPeriod, EducationType, ChatGroupRole, ChatGroupVisibility, ChatMessageType, ChatAttachmentType, FriendshipStatus, HackathonVisibility, HackathonPhase, HackathonApplicationStatus, HackathonTeamRole, HackathonTeamMemberStatus, HackathonSubmissionStatus';
    RAISE NOTICE 'Tables: app_users, courses, quizzes, hackathons, quiz_attempts, interviews, interview_attempts, cv_templates, cvs, jobs, job_applications, freelancer_projects, freelancer_bids, career_plans, learning_paths, assistant_threads, wrong_questions, badges, user_badges, daily_goals, dashboard_goal_plans, leaderboard_entries, employer_comments, user_streaks, test_attempts, live_coding_attempts, bug_fix_attempts, hackaton_attempts, hackathon_applications, hackathon_teams, hackathon_team_members, hackathon_submissions, friendships, test_leaderboard_entries, live_coding_leaderboard_entries, bug_fix_leaderboard_entries, hackaton_leaderboard_entries, chat_groups, chat_group_memberships, chat_messages, chat_attachments, chat_message_receipts, posts, post_likes, post_comments, post_saves';
END $$;

COMMIT;

