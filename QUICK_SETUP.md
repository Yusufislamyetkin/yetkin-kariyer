# Hızlı Kurulum ve Deploy

## Network Hatası Çözümü

Network hatası alıyorsanız, aşağıdaki adımları deneyin:

### Çözüm 1: Prisma'yı Local Yükleyin (Önerilen)

```bash
# Prisma'yı projeye yükleyin
npm install prisma --save-dev

# Sonra migration çalıştırın
npx prisma migrate dev --name add_performance_features
```

### Çözüm 2: npm Cache Temizleme

```bash
# Cache temizle
npm cache clean --force

# Tekrar deneyin
npx prisma migrate dev --name add_performance_features
```

### Çözüm 3: Direkt Prisma ile

```bash
# Prisma'yı yükleyin
npm install prisma @prisma/client --save-dev

# Migration
.\node_modules\.bin\prisma migrate dev --name add_performance_features
```

---

## Vercel Deploy

Projeniz zaten Vercel'de: https://vercel.com/kinyas-projects/yetkin-hub

### Adım 1: Vercel CLI ile Deploy

```bash
# Vercel'e login (zaten login olduğunuz için atlanabilir)
vercel login

# Production'a deploy
vercel --prod
```

### Adım 2: Environment Variables

Vercel Dashboard'dan (https://vercel.com/kinyas-projects/yetkin-hub) Settings → Environment Variables'a gidin ve ekleyin:

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (production URL'iniz)
- `OPENAI_API_KEY` (opsiyonel)

### Adım 3: Build Settings

Vercel otomatik olarak Next.js projelerini algılar. Ancak build command'i kontrol edin:

**Build Command:**
```bash
npm run build
```

**Install Command:**
```bash
npm install
```

Bu komutlar `postinstall` script'inde `prisma generate` çalıştıracak.

### Adım 4: Production Migration

Production'da migration için iki seçenek:

**Seçenek 1: Vercel CLI ile (Önerilen)**

```bash
# Production environment variables'ı çek
vercel env pull .env.production.local

# Migration çalıştır
npx prisma migrate deploy
```

**Seçenek 2: Vercel Dashboard'dan**

Proje → Settings → Build & Development Settings

Build Command'ı güncelleyin:
```bash
prisma generate && prisma migrate deploy && npm run build
```

### Adım 5: Seed Script (Production)

⚠️ **DİKKAT:** Seed script mevcut verileri siler! Production'da dikkatli kullanın.

**Seçenek 1: Local'den production database'e**

```bash
# Production env'i çek
vercel env pull .env.production.local

# Production database'e seed script çalıştır
npm run db:seed
```

**Seçenek 2: Vercel Function oluştur**

`app/api/admin/seed/route.ts` dosyası oluşturun (admin korumalı).

---

## Hızlı Deploy Komutları

```bash
# 1. Prisma migration (local)
npm install prisma --save-dev
npx prisma migrate dev --name add_performance_features

# 2. Seed data (local)
npm run db:schema
npm run db:seed

# 3. Vercel'e deploy
vercel --prod

# 4. Production migration
vercel env pull .env.production.local
npx prisma migrate deploy

# 5. Production seed (opsiyonel - dikkatli!)
npm run db:seed
```

---

## Sorun Giderme

### Migration hatası:
```bash
# Migration'ı reset et
npx prisma migrate reset

# Yeniden migration
npx prisma migrate dev --name add_performance_features
```

### Vercel build hatası:
- Environment variables'ı kontrol edin
- Build logs'u inceleyin: Vercel Dashboard → Deployments → Logs

### Prisma client hatası:
```bash
npx prisma generate
```

