-- Database Schema Indexes
-- Bu script tablo oluşturma işleminden SONRA çalıştırılmalıdır.
-- Vercel PostgreSQL timeout sorununu önlemek için ayrı bir dosya olarak hazırlanmıştır.

-- ============================================
-- İNDEKSLERİ OLUŞTUR
-- ============================================

-- Lesson indexes (created during table creation in optimized schema)
-- Bu index'ler database-schema-optimized.sql içinde oluşturuluyor
-- Burada sadece referans için listelenmişlerdir

-- Hackathon indexes
CREATE INDEX IF NOT EXISTS "hackathons_organizerId_idx" ON "hackathons"("organizerId");
CREATE INDEX IF NOT EXISTS "hackathon_applications_hackathonId_status_idx" ON "hackathon_applications"("hackathonId", "status");
CREATE INDEX IF NOT EXISTS "hackathon_applications_teamId_idx" ON "hackathon_applications"("teamId");
CREATE INDEX IF NOT EXISTS "hackathon_teams_hackathonId_idx" ON "hackathon_teams"("hackathonId");
CREATE INDEX IF NOT EXISTS "hackathon_team_members_userId_idx" ON "hackathon_team_members"("userId");
CREATE INDEX IF NOT EXISTS "hackathon_submissions_hackathonId_status_idx" ON "hackathon_submissions"("hackathonId", "status");

-- Friendship indexes
CREATE INDEX IF NOT EXISTS "friendships_addresseeId_status_idx" ON "friendships"("addresseeId", "status");
CREATE INDEX IF NOT EXISTS "friendships_requesterId_status_idx" ON "friendships"("requesterId", "status");

-- Goal and dashboard indexes
CREATE INDEX IF NOT EXISTS "dashboard_goal_plans_userId_frequency_idx" ON "dashboard_goal_plans"("userId", "frequency");
CREATE INDEX IF NOT EXISTS "dashboard_goal_plans_userId_frequency_nextUpdateAt_idx" ON "dashboard_goal_plans"("userId", "frequency", "nextUpdateAt");

-- Quiz and interview indexes
CREATE INDEX IF NOT EXISTS "quiz_attempts_userId_idx" ON "quiz_attempts"("userId");
CREATE INDEX IF NOT EXISTS "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "interview_attempts_userId_idx" ON "interview_attempts"("userId");
CREATE INDEX IF NOT EXISTS "interview_attempts_interviewId_idx" ON "interview_attempts"("interviewId");

-- CV and job indexes
CREATE INDEX IF NOT EXISTS "cvs_userId_idx" ON "cvs"("userId");
CREATE INDEX IF NOT EXISTS "jobs_employerId_idx" ON "jobs"("employerId");
CREATE INDEX IF NOT EXISTS "jobs_status_idx" ON "jobs"("status");
CREATE INDEX IF NOT EXISTS "job_applications_userId_idx" ON "job_applications"("userId");
CREATE INDEX IF NOT EXISTS "job_applications_jobId_idx" ON "job_applications"("jobId");

-- Freelancer indexes
CREATE INDEX IF NOT EXISTS "freelancer_projects_createdBy_idx" ON "freelancer_projects"("createdBy");
CREATE INDEX IF NOT EXISTS "freelancer_projects_status_idx" ON "freelancer_projects"("status");
CREATE INDEX IF NOT EXISTS "freelancer_bids_projectId_idx" ON "freelancer_bids"("projectId");
CREATE INDEX IF NOT EXISTS "freelancer_bids_userId_idx" ON "freelancer_bids"("userId");
CREATE INDEX IF NOT EXISTS "freelancer_bids_status_idx" ON "freelancer_bids"("status");

-- Career and learning indexes
CREATE INDEX IF NOT EXISTS "career_plans_userId_idx" ON "career_plans"("userId");
CREATE INDEX IF NOT EXISTS "learning_paths_userId_idx" ON "learning_paths"("userId");
CREATE INDEX IF NOT EXISTS "assistant_threads_createdAt_idx" ON "assistant_threads"("createdAt");
CREATE INDEX IF NOT EXISTS "lesson_threads_lessonSlug_idx" ON "lesson_threads"("lessonSlug");
CREATE INDEX IF NOT EXISTS "lesson_threads_userId_lessonSlug_idx" ON "lesson_threads"("userId", "lessonSlug");

-- Wrong questions indexes
CREATE INDEX IF NOT EXISTS "wrong_questions_userId_idx" ON "wrong_questions"("userId");
CREATE INDEX IF NOT EXISTS "wrong_questions_quizAttemptId_idx" ON "wrong_questions"("quizAttemptId");

-- Gamification indexes
CREATE INDEX IF NOT EXISTS "gamification_events_userId_occurredAt_idx" ON "gamification_events"("userId", "occurredAt");
CREATE INDEX IF NOT EXISTS "gamification_events_type_occurredAt_idx" ON "gamification_events"("type", "occurredAt");
CREATE INDEX IF NOT EXISTS "point_transactions_userId_createdAt_idx" ON "point_transactions"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "leaderboard_snapshots_period_createdAt_idx" ON "leaderboard_snapshots"("period", "createdAt");
CREATE INDEX IF NOT EXISTS "quest_progress_questId_idx" ON "quest_progress"("questId");

-- Reward indexes
CREATE INDEX IF NOT EXISTS "reward_redemptions_userId_createdAt_idx" ON "reward_redemptions"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "reward_redemptions_rewardId_idx" ON "reward_redemptions"("rewardId");

-- Admin indexes
CREATE INDEX IF NOT EXISTS "admin_audit_logs_adminId_createdAt_idx" ON "admin_audit_logs"("adminId", "createdAt");

-- Daily goals and leaderboard indexes
CREATE INDEX IF NOT EXISTS "daily_goals_userId_idx" ON "daily_goals"("userId", "date");
CREATE INDEX IF NOT EXISTS "leaderboard_entries_period_idx" ON "leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "leaderboard_entries_userId_idx" ON "leaderboard_entries"("userId", "period");

-- Employer comments indexes
CREATE INDEX IF NOT EXISTS "employer_comments_candidateId_idx" ON "employer_comments"("candidateId");
CREATE INDEX IF NOT EXISTS "employer_comments_employerId_idx" ON "employer_comments"("employerId");

-- Badge indexes
CREATE INDEX IF NOT EXISTS "badges_key_idx" ON "badges"("key");
CREATE INDEX IF NOT EXISTS "badges_category_idx" ON "badges"("category");
CREATE INDEX IF NOT EXISTS "badges_rarity_idx" ON "badges"("rarity");
CREATE INDEX IF NOT EXISTS "user_badges_userId_idx" ON "user_badges"("userId");
CREATE INDEX IF NOT EXISTS "user_badges_badgeId_idx" ON "user_badges"("badgeId");
CREATE INDEX IF NOT EXISTS "user_badges_userId_earnedAt_idx" ON "user_badges"("userId", "earnedAt" DESC);
CREATE INDEX IF NOT EXISTS "user_badges_userId_isDisplayed_idx" ON "user_badges"("userId", "isDisplayed") WHERE "isDisplayed" = TRUE;

-- User streaks indexes
CREATE INDEX IF NOT EXISTS "user_streaks_userId_idx" ON "user_streaks"("userId");

-- Test attempt indexes
CREATE INDEX IF NOT EXISTS "test_attempts_userId_completedAt_idx" ON "test_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "test_attempts_quizId_idx" ON "test_attempts"("quizId");

-- Live coding attempt indexes
CREATE INDEX IF NOT EXISTS "live_coding_attempts_userId_completedAt_idx" ON "live_coding_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "live_coding_attempts_quizId_idx" ON "live_coding_attempts"("quizId");

-- Bug fix attempt indexes
CREATE INDEX IF NOT EXISTS "bug_fix_attempts_userId_completedAt_idx" ON "bug_fix_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "bug_fix_attempts_quizId_idx" ON "bug_fix_attempts"("quizId");

-- Hackathon attempt indexes
CREATE INDEX IF NOT EXISTS "hackaton_attempts_userId_completedAt_idx" ON "hackaton_attempts"("userId", "completedAt");
CREATE INDEX IF NOT EXISTS "hackaton_attempts_quizId_idx" ON "hackaton_attempts"("quizId");
CREATE INDEX IF NOT EXISTS "hackaton_attempts_hackathonId_idx" ON "hackaton_attempts"("hackathonId");

-- Leaderboard indexes
CREATE INDEX IF NOT EXISTS "test_leaderboard_entries_period_idx" ON "test_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "test_leaderboard_entries_userId_idx" ON "test_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "live_coding_leaderboard_entries_period_idx" ON "live_coding_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "live_coding_leaderboard_entries_userId_idx" ON "live_coding_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "bug_fix_leaderboard_entries_period_idx" ON "bug_fix_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "bug_fix_leaderboard_entries_userId_idx" ON "bug_fix_leaderboard_entries"("userId", "period");
CREATE INDEX IF NOT EXISTS "hackaton_leaderboard_entries_period_idx" ON "hackaton_leaderboard_entries"("period", "periodDate");
CREATE INDEX IF NOT EXISTS "hackaton_leaderboard_entries_userId_idx" ON "hackaton_leaderboard_entries"("userId", "period");

-- Chat indexes
CREATE INDEX IF NOT EXISTS "chat_groups_slug_idx" ON "chat_groups"("slug");
CREATE INDEX IF NOT EXISTS "chat_groups_createdById_idx" ON "chat_groups"("createdById");
CREATE INDEX IF NOT EXISTS "chat_group_memberships_userId_idx" ON "chat_group_memberships"("userId");
CREATE INDEX IF NOT EXISTS "chat_messages_groupId_createdAt_idx" ON "chat_messages"("groupId", "createdAt");
CREATE INDEX IF NOT EXISTS "chat_messages_userId_idx" ON "chat_messages"("userId");
CREATE INDEX IF NOT EXISTS "chat_attachments_messageId_idx" ON "chat_attachments"("messageId");
CREATE INDEX IF NOT EXISTS "chat_message_receipts_userId_idx" ON "chat_message_receipts"("userId");

-- Post indexes
CREATE INDEX IF NOT EXISTS "posts_userId_idx" ON "posts"("userId");
CREATE INDEX IF NOT EXISTS "posts_createdAt_idx" ON "posts"("createdAt");
CREATE INDEX IF NOT EXISTS "post_likes_postId_idx" ON "post_likes"("postId");
CREATE INDEX IF NOT EXISTS "post_likes_userId_idx" ON "post_likes"("userId");
CREATE INDEX IF NOT EXISTS "post_comments_postId_idx" ON "post_comments"("postId");
CREATE INDEX IF NOT EXISTS "post_comments_postId_createdAt_idx" ON "post_comments"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS "post_comments_userId_idx" ON "post_comments"("userId");
CREATE INDEX IF NOT EXISTS "post_saves_postId_idx" ON "post_saves"("postId");
CREATE INDEX IF NOT EXISTS "post_saves_userId_idx" ON "post_saves"("userId");

-- Story indexes
CREATE INDEX IF NOT EXISTS "stories_userId_idx" ON "stories"("userId");
CREATE INDEX IF NOT EXISTS "stories_expiresAt_idx" ON "stories"("expiresAt");
CREATE INDEX IF NOT EXISTS "stories_createdAt_idx" ON "stories"("createdAt");
CREATE INDEX IF NOT EXISTS "story_views_storyId_idx" ON "story_views"("storyId");
CREATE INDEX IF NOT EXISTS "story_views_userId_idx" ON "story_views"("userId");

-- Quiz and course indexes
CREATE INDEX IF NOT EXISTS "quizzes_courseId_idx" ON "quizzes"("courseId");
CREATE INDEX IF NOT EXISTS "quizzes_lessonSlug_idx" ON "quizzes"("lessonSlug");
CREATE INDEX IF NOT EXISTS "quizzes_type_idx" ON "quizzes"("type");
CREATE INDEX IF NOT EXISTS "quizzes_courseId_type_idx" ON "quizzes"("courseId", "type");
CREATE INDEX IF NOT EXISTS "courses_topic_idx" ON "courses"("topic");
CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses"("category");
CREATE INDEX IF NOT EXISTS "courses_field_idx" ON "courses"("field");
CREATE INDEX IF NOT EXISTS "courses_difficulty_idx" ON "courses"("difficulty");

-- Challenge content indexes (GIN indexes for array searches)
CREATE INDEX IF NOT EXISTS "live_coding_challenges_isPublished_createdAt_idx" ON "live_coding_challenges"("isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "bug_fix_challenges_language_published_createdAt_idx" ON "bug_fix_challenges"("language", "isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "live_coding_challenges_tags_idx" ON "live_coding_challenges" USING GIN ("tags");
CREATE INDEX IF NOT EXISTS "bug_fix_challenges_tags_idx" ON "bug_fix_challenges" USING GIN ("tags");

-- ============================================
-- BİLGİLENDİRME
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Database indexes created successfully.';
END $$;

