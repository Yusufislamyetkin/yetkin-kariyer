-- Rozetler (badges) tablosundaki tüm değerleri silen PostgreSQL sorgusu

-- ÖNEMLİ: Bu işlem geri alınamaz! Önce yedek alın.

-- Seçenek 1: Sadece badges tablosunu temizleme
-- Not: Eğer user_badges tablosunda bu rozetlere referans varsa hata alabilirsiniz
DELETE FROM badges;

-- Seçenek 2: Önce user_badges tablosunu temizleme, sonra badges tablosunu temizleme
-- (Foreign key hatası almamak için önerilen yöntem)
-- DELETE FROM user_badges;
-- DELETE FROM badges;

-- Seçenek 3: TRUNCATE kullanarak (daha hızlı, ama foreign key constraint'leri nedeniyle çalışmayabilir)
-- TRUNCATE TABLE badges CASCADE;

