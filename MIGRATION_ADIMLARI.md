# 🔄 Users → App_Users Migration Adımları

## ✅ Yapılan Değişiklikler

1. ✅ Prisma Schema güncellendi: `@@map("app_users")`
2. ✅ `database-schema.sql` güncellendi
3. ✅ `database-seed.sql` güncellendi
4. ✅ Tüm foreign key referansları güncellendi

## 📋 Şimdi Yapılacaklar

### Adım 1: Mevcut Database'de Tabloyu Rename Et

**Supabase Dashboard → SQL Editor'de çalıştır:**

```sql
-- Tabloyu yeniden adlandır
ALTER TABLE "users" RENAME TO "app_users";
```

**⚠️ ÖNEMLİ:** Bu işlem sırasında:
- Tüm foreign key'ler otomatik güncellenecek
- Veriler korunacak
- Uygulama kısa süreliğine çalışmayabilir

### Adım 2: Prisma Client'ı Yeniden Generate Et

```bash
npx prisma generate
```

### Adım 3: Test Et

```bash
npm run dev
```

Uygulamayı test et, her şeyin çalıştığından emin ol.

---

## 🔍 Kontrol

Migration sonrası kontrol et:

```sql
-- Tablo var mı?
SELECT * FROM "app_users" LIMIT 1;

-- Foreign key'ler doğru mu?
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND ccu.table_name = 'app_users';
```

---

## 🚨 Sorun Giderme

### Hata: "relation users does not exist"
- Migration'ı çalıştırdın mı kontrol et
- Tablo adı `app_users` olmalı

### Hata: "foreign key constraint fails"
- Foreign key'ler otomatik güncellenmeli
- Eğer sorun varsa, constraint'leri manuel kontrol et

### Prisma Client hatası
```bash
npx prisma generate
```

---

## ✅ Başarı Kontrolü

- [ ] SQL migration çalıştırıldı
- [ ] `npx prisma generate` çalıştırıldı
- [ ] Uygulama çalışıyor
- [ ] Kullanıcı girişi yapılabiliyor
- [ ] Chat çalışıyor

---

## 📝 Notlar

- **Production'da:** Backup al, maintenance window planla
- **Development'da:** Direkt çalıştırabilirsin
- **Veriler:** Tüm veriler korunacak, sadece tablo adı değişecek

