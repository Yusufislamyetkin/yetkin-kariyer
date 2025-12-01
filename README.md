# AI Recruit Platform

Yapay zeka destekli kariyer geliştirme ve mülakat platformu.

## Özellikler

- **Eğitim Modülü**: Kurslar ve testler ile teknik bilgi geliştirme
- **Mülakat Simülasyonu**: Güvenli tam ekran ortamda mülakat pratiği
- **CV Oluşturma**: ATS uyumlu profesyonel CV'ler
- **İş İlanları**: İş ilanlarına başvuru ve başvuru takibi
- **Kariyer Planlama**: AI destekli kişiselleştirilmiş kariyer planları
- **İşveren Paneli**: İlan yönetimi ve aday değerlendirme
- **Topluluk Sohbeti**: Uzmanlık alanına göre gerçek zamanlı grup sohbetleri

## Teknolojiler

- Next.js 14+ (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- OpenAI API
- Tailwind CSS
- Vercel Blob Storage

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment değişkenlerini ayarlayın:
```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_recruit?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
BLOB_READ_WRITE_TOKEN="your-blob-storage-token"
# For development, HTTP is fine. For production, use HTTPS to avoid mixed content issues.
NEXT_PUBLIC_SIGNALR_URL="http://softwareinterview.tryasp.net/chatHub"
# Google OAuth (Optional - for Google Sign In)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Veritabanını hazırlayın:
```bash
npx prisma generate
npx prisma db push
# veya migration SQL dosyasını uygulayın:
# psql $DATABASE_URL -f prisma/migrations/20241108_add_chat_tables/migration.sql
```

5. Google OAuth Kurulumu (Opsiyonel):

Google ile giriş özelliğini kullanmak için:

a) [Google Cloud Console](https://console.cloud.google.com/)'a gidin ve yeni bir proje oluşturun veya mevcut projeyi seçin.

b) "APIs & Services" > "Credentials" bölümüne gidin ve "Create Credentials" > "OAuth client ID" seçin.

c) Application type olarak "Web application" seçin.

d) Authorized redirect URIs'ye şunları ekleyin:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`

e) Client ID ve Client Secret'ı kopyalayıp `.env` dosyanıza ekleyin.

6. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Vercel Deployment

### 1. Vercel Projesi Oluştur

Vercel dashboard'da yeni bir proje oluşturun:
- https://vercel.com/kinyas-projects/yetkin-hub
- GitHub repository'nizi bağlayın

### 2. Supabase PostgreSQL (Zaten Oluşturulmuş ✅)

Supabase PostgreSQL veritabanınız hazır. Aşağıdaki connection string'leri kullanın.

### 3. Vercel Blob Storage (Zaten Oluşturulmuş ✅)

Vercel Blob Storage'ınız hazır. Token'ı Vercel dashboard'dan alın.

### 4. Environment Variables - Vercel'e Ekleyin

Vercel dashboard → Settings → Environment Variables'da şunları ekleyin:

**Gerekli Variables:**
```
POSTGRES_PRISMA_URL=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

POSTGRES_URL_NON_POOLING=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

NEXTAUTH_SECRET=j/joiA8C8lu0TBJoIqkr+pQV9kZPJwPILVW9e159B6nVOJWwnTOQQyKG+JJd1JKdrLSy9Fiv4l+Mrq/BYcT6DA==

NEXTAUTH_URL=https://yetkin-hub.vercel.app

OPENAI_API_KEY=your-openai-api-key-here

BLOB_READ_WRITE_TOKEN=your-vercel-blob-token-here
NEXT_PUBLIC_SIGNALR_URL=https://softwareinterview.tryasp.net/chatHub

# Google OAuth (Optional - for Google Sign In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Not:** 
- `NEXTAUTH_URL` değerini Vercel deployment URL'iniz ile değiştirin
- `OPENAI_API_KEY` değerini OpenAI'den alın
- `BLOB_READ_WRITE_TOKEN` değerini Vercel Blob Storage'dan alın
- `NEXT_PUBLIC_SIGNALR_URL` için **production'da HTTPS kullanın** (mixed content sorunlarını önlemek için). Development için HTTP kullanılabilir.
- `GOOGLE_CLIENT_ID` ve `GOOGLE_CLIENT_SECRET` için Google Cloud Console'dan OAuth 2.0 credentials oluşturun. Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`

### 5. Build Settings

Vercel otomatik olarak Next.js projelerini algılar. `postinstall` script'i Prisma client'ı otomatik generate edecek.

### 6. İlk Deploy Sonrası

Deploy tamamlandıktan sonra, Vercel CLI ile database schema'yı push edin:

```bash
# Vercel CLI kurulumu (eğer yoksa)
npm i -g vercel

# Vercel'e login
vercel login

# Environment variables'ları pull et
vercel env pull

# Database schema'yı push et
npx prisma db push
```

Veya Supabase SQL Editor'den manuel olarak schema'yı oluşturabilirsiniz.

## Veritabanı Migration

Production'da migration'ları uygulamak için:

```bash
npx prisma migrate deploy
```

Veya Vercel CLI ile:

```bash
vercel env pull
npx prisma migrate deploy
```

## API Routes

- `/api/auth/*` - Authentication
- `/api/courses` - Course management
- `/api/quiz/*` - Quiz operations
- `/api/interview/*` - Interview operations
- `/api/cv/*` - CV operations
- `/api/jobs/*` - Job listings and applications
- `/api/employer/*` - Employer panel
- `/api/ai/*` - AI analysis endpoints
- `/api/chat/*` - Grup sohbeti, mesajlaşma ve gerçek zamanlı olaylar

## Lisans

MIT

