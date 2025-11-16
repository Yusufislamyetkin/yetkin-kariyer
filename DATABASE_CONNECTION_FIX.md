# Database Connection Pool Sorunu - Çözüm

## Sorun
```
FATAL: Max client connections reached
```

Bu hata, Supabase PostgreSQL connection pool'unun tükendiğini gösterir.

## Neden Oluşur?

1. **Serverless Ortam (Vercel)**: Her request yeni bir serverless function başlatır
2. **Connection Pool Limit**: Supabase free tier'da 60, pro tier'da 200 connection limit var
3. **Connection'lar Kapanmıyor**: Prisma client connection'ları düzgün kapatılmıyor
4. **Çok Fazla Eşzamanlı Request**: Rate limiting olmadan çok fazla istek

## Çözümler

### 1. Connection String Optimizasyonu (Yapıldı ✅)

Prisma client singleton pattern ile optimize edildi. `lib/db.ts` dosyasında:
- Global instance reuse
- Graceful shutdown handlers
- Error handling

### 2. Supabase Connection Pooler Kullanımı

**ÖNEMLİ**: `POSTGRES_PRISMA_URL` connection string'inde `pgbouncer=true` parametresi olmalı:

```
postgres://...@pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

Port **6543** (pooler) kullanılmalı, **5432** (direct) değil!

### 3. Connection Limit Kontrolü

Vercel Dashboard → Environment Variables'da kontrol edin:

```bash
# Doğru (Pooler - Port 6543)
POSTGRES_PRISMA_URL=postgres://...@pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true

# Yanlış (Direct - Port 5432)
POSTGRES_PRISMA_URL=postgres://...@pooler.supabase.com:5432/postgres?sslmode=require
```

### 4. Supabase Dashboard Kontrolü

1. Supabase Dashboard → Settings → Database
2. **Connection Pooling** bölümünü kontrol edin
3. **Connection String** → **Session mode** seçin (Transaction mode değil)
4. **Pooler** connection string'i kopyalayın

### 5. Connection Pool Ayarları

Supabase'de connection pool limitleri:
- **Free Tier**: 60 connections
- **Pro Tier**: 200 connections
- **Team Tier**: 400 connections

Eğer limit aşılıyorsa:
1. Supabase plan'ınızı yükseltin
2. Connection'ları optimize edin (yapıldı ✅)
3. Rate limiting ekleyin (yapıldı ✅)

### 6. Prisma Connection Timeout

Eğer hala sorun varsa, connection string'e timeout parametreleri ekleyin:

```
POSTGRES_PRISMA_URL=postgres://...@pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&connect_timeout=10&pool_timeout=10
```

### 7. Monitoring

Supabase Dashboard → Database → Connection Pooling:
- **Active Connections**: Kaç connection açık?
- **Pool Size**: Pool boyutu nedir?
- **Wait Time**: Connection bekleyen request var mı?

## Test

Deploy sonrası test edin:

```bash
# Vercel logs'da kontrol edin
vercel logs

# Supabase Dashboard'da connection sayısını izleyin
# Eğer sürekli 60/60 veya 200/200 ise, connection'lar kapanmıyor demektir
```

## Geçici Çözüm

Eğer hala sorun varsa:

1. **Supabase'i yeniden başlatın**: Dashboard → Settings → Database → Restart
2. **Connection'ları temizleyin**: 
   ```sql
   SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE datname = 'postgres' 
   AND pid <> pg_backend_pid();
   ```
3. **Birkaç dakika bekleyin**: Connection pool reset olur

## Önleme

1. ✅ Prisma client singleton pattern (yapıldı)
2. ✅ Rate limiting (yapıldı)
3. ✅ Error handling (yapıldı)
4. ✅ Connection cleanup (yapıldı)
5. ⚠️ Supabase plan yükseltme (gerekirse)

## İletişim

Supabase Support:
- Email: support@supabase.com
- Discord: https://discord.supabase.com

