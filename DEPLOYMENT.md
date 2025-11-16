# Vercel Deployment Rehberi

## Hızlı Başlangıç

### 1. Vercel Dashboard'a Git

https://vercel.com/kinyas-projects/yetkin-hub adresine gidin ve projeyi deploy edin.

### 2. Environment Variables Ekle

Vercel Dashboard → Settings → Environment Variables → Add New:

**Supabase PostgreSQL:**
```
POSTGRES_PRISMA_URL=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

POSTGRES_URL_NON_POOLING=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require
```

**NextAuth:**
```
NEXTAUTH_SECRET=j/joiA8C8lu0TBJoIqkr+pQV9kZPJwPILVW9e159B6nVOJWwnTOQQyKG+JJd1JKdrLSy9Fiv4l+Mrq/BYcT6DA==

NEXTAUTH_URL=https://yetkin-hub.vercel.app
```
(Deployment URL'inizi kullanın)

**OpenAI:**
```
OPENAI_API_KEY=sk-...
```
(OpenAI API key'inizi girin)

**Vercel Blob Storage:**
```
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx...
```
(Vercel Blob Storage token'ınızı girin)

### 3. Deploy

Vercel otomatik olarak deploy edecek. İlk deploy'dan sonra:

1. Deployment log'larını kontrol edin
2. Database schema'yı push edin (aşağıdaki adımlar)

### 4. Database Schema'yı Oluştur

**Seçenek 1: Vercel CLI ile (Önerilen)**

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Login
vercel login

# Projeye git
cd /path/to/project

# Environment variables'ları pull et
vercel env pull

# Prisma generate
npx prisma generate

# Database push
npx prisma db push
```

**Seçenek 2: Supabase SQL Editor ile**

Supabase Dashboard → SQL Editor → New Query:

```sql
-- Prisma schema'yı manuel olarak oluşturun
-- veya prisma/schema.prisma dosyasındaki tabloları SQL'e çevirin
```

**Seçenek 3: Setup Script ile**

```bash
vercel env pull
npx prisma generate
npx prisma db push
npm run db:schema
npm run db:seed  # Örnek verileri ekler
```

### 5. Test Et

1. https://yetkin-hub.vercel.app adresine gidin
2. Kayıt ol sayfasından hesap oluşturun
3. Dashboard'a giriş yapın
4. Tüm modüllerin çalıştığını test edin

## Sorun Giderme

### Database Connection Hatası

- `POSTGRES_PRISMA_URL` ve `POSTGRES_URL_NON_POOLING` doğru mu kontrol edin
- Supabase dashboard'da connection pooling aktif mi kontrol edin

### Build Hatası

- `postinstall` script'i çalışıyor mu kontrol edin
- Prisma client generate edildi mi kontrol edin

### Authentication Hatası

- `NEXTAUTH_SECRET` doğru mu kontrol edin
- `NEXTAUTH_URL` deployment URL'inizle eşleşiyor mu kontrol edin

## Neden İki Database?

1. **Supabase PostgreSQL**: Ana veritabanı (kullanıcılar, kurslar, testler, vb.)
2. **Vercel Blob Storage**: Video dosyaları için (mülakat kayıtları)

Bu mimari video dosyalarının daha hızlı ve güvenilir bir şekilde saklanmasını sağlar.

