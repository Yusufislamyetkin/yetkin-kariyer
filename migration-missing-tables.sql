-- Migration: Eksik Tablolar ve Yapılar
-- Bu migration Prisma şemasında tanımlı ancak SQL şemasında eksik olan
-- tabloları, enum'ları ve alanları ekler.

BEGIN;

-- ============================================
-- 1. EKSİK ENUM'LARI OLUŞTUR
-- ============================================

-- EarningType enum'ını oluştur (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EarningType') THEN
        CREATE TYPE "EarningType" AS ENUM ('FREELANCER_PROJECT', 'MONTHLY_WINNER', 'HACKATHON');
    END IF;
END $$;

-- PointSource enum'ını oluştur (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PointSource') THEN
        CREATE TYPE "PointSource" AS ENUM ('BADGE', 'STRIKE');
    END IF;
END $$;

-- BotActivityType enum'ını oluştur (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BotActivityType') THEN
        CREATE TYPE "BotActivityType" AS ENUM (
            'POST',
            'COMMENT',
            'LIKE',
            'TEST',
            'LIVE_CODING',
            'BUG_FIX',
            'LESSON',
            'CHAT',
            'FRIEND_REQUEST',
            'ACCEPT_FRIEND_REQUEST',
            'HACKATHON_APPLICATION',
            'FREELANCER_BID',
            'JOB_APPLICATION'
        );
    END IF;
END $$;

-- ============================================
-- 2. MEVCUT ENUM'LARA EKSİK DEĞERLERİ EKLE
-- ============================================
-- Not: PostgreSQL'de enum değerleri eklemek için IF NOT EXISTS yoktur
-- Bu değerler zaten varsa hata verebilir, bu durumda hata mesajını görmezden gelebilirsiniz

-- BadgeRarity enum'ına "mythic" değerini ekle
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'mythic' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'BadgeRarity')
    ) THEN
        ALTER TYPE "BadgeRarity" ADD VALUE 'mythic';
    END IF;
END $$;

-- BadgeTier enum'ına "diamond" değerini ekle
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'diamond' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'BadgeTier')
    ) THEN
        ALTER TYPE "BadgeTier" ADD VALUE 'diamond';
    END IF;
END $$;

-- BadgeCategory enum'ına "total_achievements" değerini ekle
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'total_achievements' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'BadgeCategory')
    ) THEN
        ALTER TYPE "BadgeCategory" ADD VALUE 'total_achievements';
    END IF;
END $$;

-- ============================================
-- 3. app_users TABLOSUNA EKSİK ALANLARI EKLE
-- ============================================

-- password alanını nullable yap (OAuth kullanıcıları için)
ALTER TABLE "app_users" 
    ALTER COLUMN "password" DROP NOT NULL;

-- emailVerified alanını ekle
ALTER TABLE "app_users" 
    ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);

-- isBot alanını ekle
ALTER TABLE "app_users" 
    ADD COLUMN IF NOT EXISTS "isBot" BOOLEAN NOT NULL DEFAULT FALSE;

-- resetPasswordToken alanını ekle
ALTER TABLE "app_users" 
    ADD COLUMN IF NOT EXISTS "resetPasswordToken" TEXT;

-- resetPasswordExpires alanını ekle
ALTER TABLE "app_users" 
    ADD COLUMN IF NOT EXISTS "resetPasswordExpires" TIMESTAMP(3);

-- ============================================
-- 4. EKSİK TABLOLARI OLUŞTUR
-- ============================================

-- accounts tablosu (OAuth hesap bilgileri)
CREATE TABLE IF NOT EXISTS "accounts" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "accounts_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

-- certificates tablosu (Kurs tamamlama sertifikaları)
CREATE TABLE IF NOT EXISTS "certificates" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL UNIQUE,
    "userName" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "certificates_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "certificates_userId_courseId_key" UNIQUE ("userId", "courseId")
);

-- earnings tablosu (Kullanıcı kazançları)
CREATE TABLE IF NOT EXISTS "earnings" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" "EarningType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "referenceId" TEXT,
    "metadata" JSONB,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "earnings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "earnings_amount_check" CHECK ("amount" > 0)
);

-- user_earned_points tablosu (Kullanıcı kazanılan puanlar)
CREATE TABLE IF NOT EXISTS "user_earned_points" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "source" "PointSource" NOT NULL,
    "sourceId" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_earned_points_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_earned_points_points_check" CHECK ("points" > 0)
);

-- bot_characters tablosu (Bot karakter tanımları)
CREATE TABLE IF NOT EXISTS "bot_characters" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "name" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "traits" JSONB,
    "expertise" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_characters_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- bot_configurations tablosu (Bot konfigürasyon ayarları)
-- Global Bot Scheduler Config (singleton table)
CREATE TABLE IF NOT EXISTS "global_bot_scheduler_config" (
    "id" TEXT PRIMARY KEY,
    "enabledActivities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "activityIntervals" JSONB,
    "activityHours" INTEGER[] NOT NULL DEFAULT ARRAY[9, 12, 18, 21]::INTEGER[],
    "scheduleEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
    "maxPostsPerDay" INTEGER NOT NULL DEFAULT 3,
    "maxCommentsPerDay" INTEGER NOT NULL DEFAULT 5,
    "maxLikesPerDay" INTEGER NOT NULL DEFAULT 10,
    "maxTestsPerWeek" INTEGER NOT NULL DEFAULT 3,
    "maxLiveCodingPerWeek" INTEGER NOT NULL DEFAULT 2,
    "maxLessonsPerWeek" INTEGER NOT NULL DEFAULT 5,
    "lastScheduledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bot Configuration (simplified - only isActive and lastActivityAt)
CREATE TABLE IF NOT EXISTS "bot_configurations" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_configurations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- bot_news_sources tablosu (Bot haber kaynakları)
CREATE TABLE IF NOT EXISTS "bot_news_sources" (
    "id" TEXT PRIMARY KEY,
    "botId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_news_sources_botId_fkey" FOREIGN KEY ("botId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bot_news_sources_botId_sourceId_key" UNIQUE ("botId", "sourceId")
);

-- bot_activities tablosu (Bot aktivite logları)
CREATE TABLE IF NOT EXISTS "bot_activities" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "activityType" "BotActivityType" NOT NULL,
    "targetId" TEXT,
    "details" JSONB,
    "success" BOOLEAN NOT NULL DEFAULT TRUE,
    "errorMessage" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- bot_activity_campaigns tablosu (Bot kampanya yönetimi)
CREATE TABLE IF NOT EXISTS "bot_activity_campaigns" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "botCount" INTEGER NOT NULL,
    "totalActivities" INTEGER NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "config" JSONB NOT NULL,
    "hangfireJobId" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT FALSE,
    "recurringPattern" TEXT,
    "parentCampaignId" TEXT,
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_activity_campaigns_parentCampaignId_fkey" FOREIGN KEY ("parentCampaignId") REFERENCES "bot_activity_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "bot_activity_campaigns_bot_count_check" CHECK ("botCount" > 0),
    CONSTRAINT "bot_activity_campaigns_total_activities_check" CHECK ("totalActivities" > 0),
    CONSTRAINT "bot_activity_campaigns_duration_check" CHECK ("durationHours" > 0),
    CONSTRAINT "bot_activity_campaigns_time_check" CHECK ("startTime" < "endTime")
);

-- bot_activity_campaign_jobs tablosu (Bot kampanya işleri)
CREATE TABLE IF NOT EXISTS "bot_activity_campaign_jobs" (
    "id" TEXT PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "hangfireJobId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_activity_campaign_jobs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "bot_activity_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- bot_activity_executions tablosu (Bot kampanya çalıştırmaları)
CREATE TABLE IF NOT EXISTS "bot_activity_executions" (
    "id" TEXT PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "targetId" TEXT,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bot_activity_executions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "bot_activity_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bot_activity_executions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app_users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- 5. İNDEKSLERİ OLUŞTUR
-- ============================================

-- accounts tablosu için index'ler
CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts"("userId");

-- certificates tablosu için index'ler
CREATE INDEX IF NOT EXISTS "certificates_userId_idx" ON "certificates"("userId");
CREATE INDEX IF NOT EXISTS "certificates_courseId_idx" ON "certificates"("courseId");
CREATE INDEX IF NOT EXISTS "certificates_certificateNumber_idx" ON "certificates"("certificateNumber");

-- earnings tablosu için index'ler
CREATE INDEX IF NOT EXISTS "earnings_userId_earnedAt_idx" ON "earnings"("userId", "earnedAt");
CREATE INDEX IF NOT EXISTS "earnings_type_earnedAt_idx" ON "earnings"("type", "earnedAt");
CREATE INDEX IF NOT EXISTS "earnings_userId_type_idx" ON "earnings"("userId", "type");

-- user_earned_points tablosu için index'ler
CREATE INDEX IF NOT EXISTS "user_earned_points_userId_earnedAt_idx" ON "user_earned_points"("userId", "earnedAt");
CREATE INDEX IF NOT EXISTS "user_earned_points_userId_source_idx" ON "user_earned_points"("userId", "source");

-- bot_characters tablosu için index'ler (userId zaten unique, ek index gerekmez)

-- bot_configurations tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_configurations_isActive_lastActivityAt_idx" ON "bot_configurations"("isActive", "lastActivityAt");

-- bot_news_sources tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_news_sources_botId_idx" ON "bot_news_sources"("botId");
CREATE INDEX IF NOT EXISTS "bot_news_sources_usedAt_idx" ON "bot_news_sources"("usedAt");

-- bot_activities tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_activities_userId_executedAt_idx" ON "bot_activities"("userId", "executedAt");
CREATE INDEX IF NOT EXISTS "bot_activities_activityType_executedAt_idx" ON "bot_activities"("activityType", "executedAt");

-- bot_activity_campaigns tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_activity_campaigns_status_createdAt_idx" ON "bot_activity_campaigns"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "bot_activity_campaigns_activityType_status_idx" ON "bot_activity_campaigns"("activityType", "status");
CREATE INDEX IF NOT EXISTS "bot_activity_campaigns_isRecurring_nextRunAt_idx" ON "bot_activity_campaigns"("isRecurring", "nextRunAt");
CREATE INDEX IF NOT EXISTS "bot_activity_campaigns_parentCampaignId_idx" ON "bot_activity_campaigns"("parentCampaignId");

-- bot_activity_campaign_jobs tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_activity_campaign_jobs_campaignId_idx" ON "bot_activity_campaign_jobs"("campaignId");
CREATE INDEX IF NOT EXISTS "bot_activity_campaign_jobs_hangfireJobId_idx" ON "bot_activity_campaign_jobs"("hangfireJobId");

-- bot_activity_executions tablosu için index'ler
CREATE INDEX IF NOT EXISTS "bot_activity_executions_campaignId_executedAt_idx" ON "bot_activity_executions"("campaignId", "executedAt");
CREATE INDEX IF NOT EXISTS "bot_activity_executions_userId_executedAt_idx" ON "bot_activity_executions"("userId", "executedAt");
CREATE INDEX IF NOT EXISTS "bot_activity_executions_activityType_executedAt_idx" ON "bot_activity_executions"("activityType", "executedAt");

-- ============================================
-- 6. BİLGİLENDİRME
-- ============================================

DO $$
BEGIN
    RAISE NOTICE 'Migration completed successfully.';
    RAISE NOTICE 'Added enum types: EarningType, PointSource, BotActivityType';
    RAISE NOTICE 'Updated enum values: BadgeRarity (mythic), BadgeTier (diamond), BadgeCategory (total_achievements)';
    RAISE NOTICE 'Updated app_users table: emailVerified, isBot, resetPasswordToken, resetPasswordExpires, password (nullable)';
    RAISE NOTICE 'Created tables: accounts, certificates, earnings, user_earned_points, bot_characters, bot_configurations, bot_news_sources, bot_activities, bot_activity_campaigns, bot_activity_campaign_jobs, bot_activity_executions';
END $$;

COMMIT;
