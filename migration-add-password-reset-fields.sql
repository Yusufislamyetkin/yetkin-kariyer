-- Şifre sıfırlama için gerekli alanları ekleyen migration script
-- Bu script User tablosuna resetPasswordToken ve resetPasswordExpires alanlarını ekler

-- 1. resetPasswordToken kolonunu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'app_users' 
        AND column_name = 'resetPasswordToken'
    ) THEN
        ALTER TABLE app_users ADD COLUMN "resetPasswordToken" TEXT;
        RAISE NOTICE 'resetPasswordToken kolonu eklendi';
    ELSE
        RAISE NOTICE 'resetPasswordToken kolonu zaten mevcut';
    END IF;
END $$;

-- 2. resetPasswordExpires kolonunu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'app_users' 
        AND column_name = 'resetPasswordExpires'
    ) THEN
        ALTER TABLE app_users ADD COLUMN "resetPasswordExpires" TIMESTAMP;
        RAISE NOTICE 'resetPasswordExpires kolonu eklendi';
    ELSE
        RAISE NOTICE 'resetPasswordExpires kolonu zaten mevcut';
    END IF;
END $$;

-- 3. Index ekle (performans için - token ile arama yapılırken kullanılır)
CREATE INDEX IF NOT EXISTS app_users_resetPasswordToken_idx ON app_users("resetPasswordToken") 
WHERE "resetPasswordToken" IS NOT NULL;

-- 4. Eski token'ları temizle (opsiyonel - 1 saatten eski token'ları sil)
-- Bu sorgu çalıştırılabilir ama gerekli değil
-- DELETE FROM app_users WHERE "resetPasswordExpires" < NOW() - INTERVAL '1 hour';

