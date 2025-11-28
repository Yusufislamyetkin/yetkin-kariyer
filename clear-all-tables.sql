-- TÜM TABLOLARI TEMİZLE
-- Bu script veritabanındaki tüm tabloları, constraint'leri ve bağımlılıkları temizler.
-- ⚠️ DİKKAT: Bu işlem geri alınamaz! Tüm veriler silinecektir!
-- ⚠️ Çalıştırmadan önce mutlaka verilerinizi yedekleyin!

-- ============================================
-- 1. TÜM TABLOLARI DROP ET (CASCADE ile bağımlılıkları da siler)
-- ============================================

DO $$ 
DECLARE
    r RECORD;
    table_count INTEGER := 0;
BEGIN
    -- Tüm tabloları bul ve DROP et
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        table_count := table_count + 1;
        RAISE NOTICE 'Dropped table: %', r.tablename;
    END LOOP;
    
    RAISE NOTICE 'Toplam % tablo silindi.', table_count;
END $$;

-- ============================================
-- 2. TÜM ENUM TİPLERİNİ DROP ET (Opsiyonel)
-- ============================================

DO $$ 
DECLARE
    r RECORD;
    type_count INTEGER := 0;
BEGIN
    -- Tüm enum tiplerini bul ve DROP et
    FOR r IN (
        SELECT typname 
        FROM pg_type 
        WHERE typtype = 'e'
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ORDER BY typname
    ) LOOP
        EXECUTE 'DROP TYPE IF EXISTS public.' || quote_ident(r.typname) || ' CASCADE';
        type_count := type_count + 1;
        RAISE NOTICE 'Dropped type: %', r.typname;
    END LOOP;
    
    IF type_count > 0 THEN
        RAISE NOTICE 'Toplam % enum tipi silindi.', type_count;
    ELSE
        RAISE NOTICE 'Silinecek enum tipi bulunamadı.';
    END IF;
END $$;

-- ============================================
-- 3. SEQUENCE'LERİ DROP ET (Opsiyonel)
-- ============================================

DO $$ 
DECLARE
    r RECORD;
    seq_count INTEGER := 0;
BEGIN
    -- Tüm sequence'leri bul ve DROP et
    FOR r IN (
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_schema = 'public'
        ORDER BY sequence_name
    ) LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS public.' || quote_ident(r.sequence_name) || ' CASCADE';
        seq_count := seq_count + 1;
        RAISE NOTICE 'Dropped sequence: %', r.sequence_name;
    END LOOP;
    
    IF seq_count > 0 THEN
        RAISE NOTICE 'Toplam % sequence silindi.', seq_count;
    ELSE
        RAISE NOTICE 'Silinecek sequence bulunamadı.';
    END IF;
END $$;

-- ============================================
-- 4. FUNCTION'LARI DROP ET (Opsiyonel)
-- ============================================

DO $$ 
DECLARE
    r RECORD;
    func_count INTEGER := 0;
BEGIN
    -- Tüm fonksiyonları bul ve DROP et
    FOR r IN (
        SELECT proname, oidvectortypes(proargtypes) as args
        FROM pg_proc 
        WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
        ORDER BY proname
    ) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
        func_count := func_count + 1;
        RAISE NOTICE 'Dropped function: %', r.proname;
    END LOOP;
    
    IF func_count > 0 THEN
        RAISE NOTICE 'Toplam % fonksiyon silindi.', func_count;
    ELSE
        RAISE NOTICE 'Silinecek fonksiyon bulunamadı.';
    END IF;
END $$;

-- ============================================
-- 5. VIEW'LERİ DROP ET (Opsiyonel)
-- ============================================

DO $$ 
DECLARE
    r RECORD;
    view_count INTEGER := 0;
BEGIN
    -- Tüm view'leri bul ve DROP et
    FOR r IN (
        SELECT viewname 
        FROM pg_views 
        WHERE schemaname = 'public'
        ORDER BY viewname
    ) LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
        view_count := view_count + 1;
        RAISE NOTICE 'Dropped view: %', r.viewname;
    END LOOP;
    
    IF view_count > 0 THEN
        RAISE NOTICE 'Toplam % view silindi.', view_count;
    ELSE
        RAISE NOTICE 'Silinecek view bulunamadı.';
    END IF;
END $$;

-- ============================================
-- BİLGİLENDİRME
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tüm veritabanı objeleri temizlendi!';
    RAISE NOTICE 'Artık yeni schema kurulumu yapabilirsiniz.';
    RAISE NOTICE '========================================';
END $$;

