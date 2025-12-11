-- Add scheduler-related columns to bot_configurations table if they don't exist
-- This script ensures all required columns for scheduler functionality are present

-- Check and add scheduleEnabled column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bot_configurations' 
        AND column_name = 'scheduleEnabled'
    ) THEN
        ALTER TABLE bot_configurations 
        ADD COLUMN "scheduleEnabled" BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Check and add enabledActivities column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bot_configurations' 
        AND column_name = 'enabledActivities'
    ) THEN
        ALTER TABLE bot_configurations 
        ADD COLUMN "enabledActivities" TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Check and add activityIntervals column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bot_configurations' 
        AND column_name = 'activityIntervals'
    ) THEN
        ALTER TABLE bot_configurations 
        ADD COLUMN "activityIntervals" JSONB;
    END IF;
END $$;

-- Check and add activityHours column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bot_configurations' 
        AND column_name = 'activityHours'
    ) THEN
        ALTER TABLE bot_configurations 
        ADD COLUMN "activityHours" INTEGER[] DEFAULT ARRAY[9, 12, 18, 21];
    END IF;
END $$;

-- Check and add lastScheduledAt column
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bot_configurations' 
        AND column_name = 'lastScheduledAt'
    ) THEN
        ALTER TABLE bot_configurations 
        ADD COLUMN "lastScheduledAt" TIMESTAMP;
    END IF;
END $$;

-- Verify columns exist
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'bot_configurations' 
AND column_name IN ('scheduleEnabled', 'enabledActivities', 'activityIntervals', 'activityHours', 'lastScheduledAt')
ORDER BY column_name;
