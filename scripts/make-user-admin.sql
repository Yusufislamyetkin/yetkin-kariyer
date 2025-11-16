-- Kullanıcı rolünü admin yapmak için SQL scripti
-- Kullanım: psql $POSTGRES_PRISMA_URL -f scripts/make-user-admin.sql
-- Veya email'i değiştirip çalıştırın

-- Örnek: Belirli bir email'i admin yap
UPDATE app_users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Tüm kullanıcıları görmek için
-- SELECT id, email, name, role FROM app_users;

-- İlk kullanıcıyı admin yapmak için
-- UPDATE app_users 
-- SET role = 'admin' 
-- WHERE id = (SELECT id FROM app_users ORDER BY "createdAt" LIMIT 1);

