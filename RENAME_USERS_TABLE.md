# 🔄 Users Tablosunu App_Users Olarak Değiştirme

## 📋 Yapılacaklar

### 1. Prisma Schema Güncellendi ✅

`prisma/schema.prisma` dosyasında:
```prisma
model User {
  // ...
  @@map("app_users")  // Eski: @@map("users")
}
```

### 2. Database Migration Çalıştır

**Seçenek 1: Prisma Migrate (Önerilen)**
```bash
# Migration oluştur
npx prisma migrate dev --name rename_users_to_app_users

# Veya manuel SQL çalıştır
```

**Seçenek 2: Manuel SQL (Supabase SQL Editor)**

Supabase Dashboard → SQL Editor'de çalıştır:

```sql
-- Tabloyu yeniden adlandır
ALTER TABLE "users" RENAME TO "app_users";
```

**⚠️ ÖNEMLİ:** Tüm foreign key'ler otomatik olarak güncellenecek çünkü PostgreSQL constraint'leri tablo adına göre çalışır.

### 3. Prisma Client'ı Yeniden Generate Et

```bash
npx prisma generate
```

### 4. Test Et

```bash
npm run dev
```

---

## ✅ Kontrol Listesi

- [ ] Prisma schema güncellendi (`@@map("app_users")`)
- [ ] Database'de tablo rename edildi (`users` → `app_users`)
- [ ] `npx prisma generate` çalıştırıldı
- [ ] Uygulama test edildi

---

## 🔍 Neden Bu Değişiklik?

Supabase'in kendi `auth.users` tablosu var. Chat modülü kurulumu sırasında `users` tablosu oluşturulmaya çalışıldığında çakışma oluyor:

```
Error: relation "users" already exists
```

Bu değişiklikle:
- ✅ `app_users` = Senin kullanıcı tablon
- ✅ `auth.users` = Supabase Auth tablosu (değiştirilemez)
- ✅ Çakışma yok!

---

## 🚨 Dikkat!

- Production'da migration yapmadan önce **backup al!**
- Migration sırasında uygulama kısa süreliğine çalışmayabilir
- Tüm foreign key'ler otomatik güncellenecek (PostgreSQL özelliği)

---

## 📝 Alternatif İsimler

Eğer `app_users` yerine başka bir isim istersen:
- `platform_users`
- `application_users`
- `custom_users`
- `project_users`

Sadece Prisma schema'da `@@map("yeni_isim")` değiştir ve migration'ı güncelle.

