# Yerel Kurulum Adımları

## 0. Environment Variables Ayarlayın (ÖNEMLİ!)

Giriş yapabilmek için `AUTH_SECRET` environment variable'ı gereklidir.

**Hızlı Kurulum:**

1. Environment variable'ları kontrol edin:
```powershell
.\setup-env.ps1
```

2. Eğer `AUTH_SECRET` eksikse, oluşturun:
```powershell
# AUTH_SECRET oluştur
$secret = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
Write-Host "AUTH_SECRET=$secret"
```

3. `.env` dosyası oluşturun ve ekleyin:
```powershell
# .env dosyası oluştur
@"
AUTH_SECRET=oluşturduğunuz-secret-buraya
NEXTAUTH_URL=http://localhost:3000
POSTGRES_PRISMA_URL=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
"@ | Out-File -FilePath .env -Encoding utf8
```

**Not:** `.env` dosyasını oluşturduktan sonra sunucuyu yeniden başlatmanız gerekir.

## 1. Terminal'i Açın

Windows PowerShell veya Command Prompt'u açın ve proje klasörüne gidin:

```powershell
cd C:\Users\Yusuf\Desktop\Kariyer
```

## 2. Veritabanı Şemasını Güncelleyin

Aşağıdaki komutu çalıştırın:

```bash
npx prisma db push
```

**Bu komut ne yapar?**
- Prisma şemasındaki tüm tabloları (chat grupları dahil) veritabanına uygular
- Prisma client'ı otomatik olarak generate eder

**Alternatif:** PostgreSQL bağlantınızı kullanarak aşağıdaki SQL dosyasını doğrudan çalıştırabilirsiniz:

```bash
psql $DATABASE_URL -f prisma/migrations/20241108_add_chat_tables/migration.sql
```

## 3. Seed Script'i Çalıştırın

Veritabanını temizleyip yeni verilerle doldurun:

```bash
npm run db:schema
npm run db:seed
```

**Bu komut ne yapar?**
- `database-schema.sql` aracılığıyla mevcut tüm verileri temizler ve şemayı yeniden kurar
- CV template'lerini oluşturur
- Örnek kurs, test ve mülakatları ekler
- Yeni chat gruplarını, üyelikleri ve örnek mesajları doldurur

## 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Tarayıcıda http://localhost:3000 adresine gidin.

---

## Özet: Hızlı Başlangıç

```bash
# 1. Migration
npx prisma db push

# 2. Seed Data
npm run db:schema
npm run db:seed

# 3. Dev Server
npm run dev
```

---

## Sorun Giderme

### "Migration already exists" hatası:
```bash
npx prisma migrate reset
npx prisma db push
```

### "Prisma Client" hatası:
```bash
npx prisma generate
```

### "Sunucu yapılandırma hatası" veya "Configuration" hatası:
Bu hata, `AUTH_SECRET` veya `NEXTAUTH_SECRET` environment variable'ının eksik olmasından kaynaklanır.

**Çözüm:**

1. `.env` dosyası oluşturun (proje kök dizininde):
```powershell
# .env dosyası oluştur
New-Item -Path .env -ItemType File
```

2. `AUTH_SECRET` oluşturun:
```powershell
# PowerShell ile AUTH_SECRET oluştur
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

3. `.env` dosyasına ekleyin:
```env
AUTH_SECRET=oluşturduğunuz-secret-buraya
NEXTAUTH_URL=http://localhost:3000
POSTGRES_PRISMA_URL=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
POSTGRES_URL_NON_POOLING=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

4. Environment variable'ları kontrol edin:
```powershell
.\setup-env.ps1
```

5. Sunucuyu yeniden başlatın:
```bash
npm run dev
```

### Database connection hatası:
`.env` dosyanızda aşağıdaki değişkenlerin olduğundan emin olun:

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `AUTH_SECRET` veya `NEXTAUTH_SECRET` (GİRİŞ İÇİN GEREKLİ!)
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SIGNALR_URL` (opsiyonel - chat için SignalR hub URL'i, varsayılan: http://softwareinterview.tryasp.net/chatHub)

