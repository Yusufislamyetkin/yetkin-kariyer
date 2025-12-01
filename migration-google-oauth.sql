-- Google OAuth için gerekli migration script
-- Bu script Account tablosunu oluşturur ve User tablosunu günceller

-- 1. User tablosunda password'u nullable yap (eğer zaten nullable değilse)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'app_users' 
        AND column_name = 'password' 
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE app_users ALTER COLUMN password DROP NOT NULL;
    END IF;
END $$;

-- 2. emailVerified kolonunu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'app_users' 
        AND column_name = 'emailVerified'
    ) THEN
        ALTER TABLE app_users ADD COLUMN "emailVerified" TIMESTAMP;
    END IF;
END $$;

-- 3. Account tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

-- 4. Unique constraint ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'accounts_provider_providerAccountId_key'
    ) THEN
        ALTER TABLE accounts 
        ADD CONSTRAINT accounts_provider_providerAccountId_key 
        UNIQUE (provider, "providerAccountId");
    END IF;
END $$;

-- 5. Foreign key ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'accounts_userId_fkey'
    ) THEN
        ALTER TABLE accounts 
        ADD CONSTRAINT accounts_userId_fkey 
        FOREIGN KEY ("userId") 
        REFERENCES app_users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- 6. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts("userId");
CREATE INDEX IF NOT EXISTS accounts_provider_idx ON accounts(provider);

