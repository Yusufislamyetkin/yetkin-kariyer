# Deployment Rehberi

## Yerel Geliştirme Ortamında Çalıştırma

### 1. Terminal'i Açın
Proje klasörünüzde (C:\Users\Yusuf\Desktop\Kariyer) terminal/PowerShell açın.

### 2. Veritabanı Migration'ı Çalıştırın

```bash
# Prisma migration oluştur ve uygula
npx prisma migrate dev --name add_performance_features
```

Bu komut:
- Yeni migration dosyası oluşturur
- Veritabanı şemasını günceller
- Prisma client'ı otomatik generate eder

### 3. Seed Script'i Çalıştırın

```bash
# Şemayı sıfırla ve seed data ekle
npm run db:schema
npm run db:seed
```

Bu iki komut:
- Mevcut verileri temizler ve Prisma şemasına göre tabloları yeniden kurar
- CV template'leri, kurslar, quizler, rozetler ve sohbet grupları gibi örnek verileri ekler

### 4. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

---

## Vercel'e Deploy Etme

### Ön Koşullar

1. Vercel hesabı oluşturun: https://vercel.com
2. Vercel CLI'yi yükleyin:
   ```bash
   npm i -g vercel
   ```

### Adım 1: Vercel'e Giriş Yapın

```bash
vercel login
```

### Adım 2: Projeyi Deploy Edin

Proje klasöründe:

```bash
vercel
```

İlk deploy'da size sorular sorulacak:
- Set up and deploy? → **Y** (Yes)
- Which scope? → Vercel hesabınızı seçin
- Link to existing project? → **N** (No, yeni proje)
- Project name? → Proje adını girin (örn: `ai-recruit`)
- Directory? → **./** (mevcut dizin)
- Override settings? → **N** (No)

### Adım 3: Environment Variables Ayarlayın

Vercel dashboard'a gidin: https://vercel.com/dashboard

Projenizi seçin → Settings → Environment Variables

Aşağıdaki değişkenleri ekleyin:

```
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-project.vercel.app
OPENAI_API_KEY=sk-... (opsiyonel)
```

### Adım 4: Production Database Migration

Vercel'de otomatik build sırasında Prisma generate çalışır (postinstall script).

Ancak migration'ı manuel çalıştırmanız gerekebilir:

**Seçenek 1: Vercel CLI ile**

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Seçenek 2: Vercel Dashboard'dan**

Vercel Dashboard → Proje → Settings → Build & Development Settings

Build Command'a ekleyin:
```bash
npm run db:generate && npm run build
```

### Adım 5: Production Seed Script

Production'da seed script'i çalıştırmak için:

**Seçenek 1: Vercel Function olarak**

`app/api/admin/seed/route.ts` dosyası oluşturun (admin korumalı)

**Seçenek 2: Local'den production database'e bağlanarak**

```bash
# Production database URL'ini .env'e ekleyin
vercel env pull .env.production.local

# Production database'e yeni scriptlerle seed atın
npm run db:schema
npm run db:seed
```

### Adım 6: Production Deploy

```bash
vercel --prod
```

---

## Vercel Build Ayarları

`vercel.json` dosyası zaten mevcut. İsterseniz `package.json`'a build hook ekleyebilirsiniz:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

---

## Önemli Notlar

1. **Migration'lar**: Production'da `prisma migrate deploy` kullanın (dev değil)
2. **Environment Variables**: Tüm değişkenler Vercel dashboard'da tanımlı olmalı
3. **Database**: Vercel Postgres veya external PostgreSQL kullanabilirsiniz
4. **Seed Script**: Production'da dikkatli çalıştırın (mevcut verileri silebilir)

---

## Hızlı Başlangıç (Local)

```bash
# 1. Dependencies yükle
npm install

# 2. Migration çalıştır
npx prisma migrate dev --name add_performance_features

# 3. Seed data ekle
npm run db:schema
npm run db:seed

# 4. Dev server başlat
npm run dev
```

---

## Sorun Giderme

### Migration hatası alırsanız:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Prisma client hatası:
```bash
npx prisma generate
```

### Vercel build hatası:
- Environment variables'ı kontrol edin
- `vercel.json` dosyasını kontrol edin
- Build logs'u inceleyin: Vercel Dashboard → Deployments → Logs

