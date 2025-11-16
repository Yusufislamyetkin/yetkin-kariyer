Veritabanı Güncelleme Kuralı
Kural: Tüm veritabanı güncellemeleri iki ayrı SQL dosyasında tutulmalıdır:
1. Tablo Şema Yapısı → database-schema.sql
Bu dosyada yer alması gerekenler:
Tablo oluşturma/şema değişiklikleri (CREATE TABLE, ALTER TABLE)
Enum tanımlamaları (CREATE TYPE)
Index tanımlamaları (CREATE INDEX)
Foreign key constraint'leri
Tüm DDL (Data Definition Language) işlemleri
Örnek: Yeni bir tablo eklerken, sütun eklerken, enum değeri eklerken → database-schema.sql dosyasını güncelle.
2. Seed Data → database-seed.sql
Bu dosyada yer alması gerekenler:
Örnek veri eklemeleri (INSERT INTO)
Test verileri
Başlangıç verileri (badges, default courses, vb.)
Tüm DML (Data Manipulation Language) işlemleri
Örnek: Yeni bir kullanıcı, quiz, badge veya örnek veri eklerken → database-seed.sql dosyasını güncelle.
Önemli Notlar:
database-schema.sql dosyası şemayı sıfırdan oluşturabilmelidir (DROP → CREATE)
database-seed.sql dosyası şema mevcutken çalıştırılmalıdır (TRUNCATE → INSERT)
Her iki dosya da transaction içinde (BEGIN / COMMIT) olmalıdır
Yeni bir özellik eklerken her iki dosyayı da kontrol et ve gerekirse güncelle
Kullanım Senaryosu:
-- Yeni bir tablo ekliyorsan:-- 1. database-schema.sql'e CREATE TABLE ekle-- 2. database-seed.sql'e örnek INSERT'ler ekle (isteğe bağlı)-- Mevcut tabloya sütun ekliyorsan:-- 1. database-schema.sql'e ALTER TABLE ekle-- 2. database-seed.sql'e yeni sütun için örnek veri ekle (gerekirse)
