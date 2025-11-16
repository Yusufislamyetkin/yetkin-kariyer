# 🚀 Deployment Adımları - Hızlı Başlangıç

## ✅ Hazır Olanlar

- ✅ Supabase PostgreSQL (Veritabanı)
- ✅ Vercel Blob Storage (Video dosyaları için)
- ✅ Vercel Projesi: https://vercel.com/kinyas-projects/yetkin-hub

## 📋 Yapılacaklar

### 1. Vercel Environment Variables Ekle

Vercel Dashboard → Project → Settings → Environment Variables → Add New:

**Aşağıdaki değerleri ekleyin:**

```
POSTGRES_PRISMA_URL=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

POSTGRES_URL_NON_POOLING=postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require

NEXTAUTH_SECRET=j/joiA8C8lu0TBJoIqkr+pQV9kZPJwPILVW9e159B6nVOJWwnTOQQyKG+JJd1JKdrLSy9Fiv4l+Mrq/BYcT6DA==

NEXTAUTH_URL=https://yetkin-hub.vercel.app

OPENAI_API_KEY=sk-... (OpenAI API key'inizi girin)

BLOB_READ_WRITE_TOKEN=vercel_blob_xxx... (Vercel Blob Storage token'ınızı girin)
```

**Önemli:** 
- `NEXTAUTH_URL` değerini Vercel deployment URL'iniz ile değiştirin
- `OPENAI_API_KEY` değerini OpenAI'den alın
- `BLOB_READ_WRITE_TOKEN` değerini Vercel Blob Storage'dan alın

### 2. GitHub'a Push Et

```bash
git add .
git commit -m "Deploy to Vercel"
git push
```

Vercel otomatik olarak deploy edecek.

### 3. İlk Deploy Sonrası - Database Schema Oluştur

Deploy tamamlandıktan sonra:

```bash
# Vercel CLI kurulumu (eğer yoksa)
npm i -g vercel

# Vercel'e login
vercel login

# Projeye git
cd /path/to/project

# Environment variables'ları pull et
vercel env pull

# Prisma client'ı generate et
npx prisma generate

# Database schema'yı push et
npx prisma db push
```

### 4. Test Et

1. https://yetkin-hub.vercel.app adresine gidin
2. Kayıt ol sayfasından hesap oluşturun
3. Dashboard'a giriş yapın
4. Tüm modüllerin çalıştığını test edin

## ❓ Neden İki Storage?

1. **Supabase PostgreSQL**: Ana veritabanı (kullanıcılar, kurslar, testler, CV'ler, iş ilanları)
2. **Vercel Blob Storage**: Video dosyaları için (mülakat kayıtları)

Bu mimari:
- Video dosyalarının daha hızlı yüklenmesini sağlar
- Vercel CDN ile global dağıtım sağlar
- Supabase'in storage limitlerinden bağımsız çalışır

## 🐛 Sorun Giderme

### Build Hatası
- `postinstall` script'i çalışıyor mu kontrol edin
- Prisma client generate edildi mi kontrol edin

### Database Connection Hatası
- `POSTGRES_PRISMA_URL` ve `POSTGRES_URL_NON_POOLING` doğru mu kontrol edin
- Supabase dashboard'da connection pooling aktif mi kontrol edin

### Authentication Hatası
- `NEXTAUTH_SECRET` doğru mu kontrol edin
- `NEXTAUTH_URL` deployment URL'inizle eşleşiyor mu kontrol edin

## 📞 Yardım

Sorun yaşarsanız:
1. Vercel deployment log'larını kontrol edin
2. Supabase dashboard'da connection'ları kontrol edin
3. `DEPLOYMENT.md` dosyasına bakın

