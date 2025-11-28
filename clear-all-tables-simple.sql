-- BASIT VERSİYON: SADECE TABLOLARI TEMİZLE
-- Bu script sadece tabloları temizler, enum ve diğer objeleri bırakır.
-- ⚠️ DİKKAT: Bu işlem geri alınamaz! Tüm tablo verileri silinecektir!

DO $$ 
DECLARE
    r RECORD;
    table_count INTEGER := 0;
BEGIN
    -- Tüm tabloları bul ve DROP et (CASCADE ile foreign key'leri de siler)
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    ) LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        table_count := table_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Toplam % tablo silindi.', table_count;
END $$;

