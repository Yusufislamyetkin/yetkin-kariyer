# Vercel PostgreSQL Database Setup Guide

## Sorun
Vercel PostgreSQL'de `database-schema.sql` dosyası çalıştırılırken timeout hatası alınıyor. Bu dosya çok büyük ve tek bir transaction içinde çalıştığı için Vercel'in timeout limitini aşıyor.

## Çözüm
Schema dosyası optimize edilmiş iki ayrı dosyaya bölündü:

1. **`database-schema-optimized.sql`** - Tablolar ve enum'lar (ana yapı)
2. **`database-schema-indexes.sql`** - Index'ler (performans)

## Kurulum Adımları

### Seçenek 1: Optimize Edilmiş Tek Dosya (Önerilen)
Eğer schema'yı tek seferde kurmak istiyorsanız, `database-schema-optimized.sql` dosyasını kullanın.

**Avantajlar:**
- Transaction yok (her statement bağımsız)
- Index'ler ayrı dosyada (daha sonra eklenebilir)
- DROP işlemleri optimize edilmiş
- Timeout riski daha düşük

**Kullanım:**
1. Vercel PostgreSQL dashboard'una gidin
2. SQL Editor'ü açın
3. `database-schema-optimized.sql` dosyasını yükleyip çalıştırın
4. İşlem tamamlandıktan sonra `database-schema-indexes.sql` dosyasını çalıştırın

### Seçenek 2: İki Ayrı Dosya (En Güvenli)
Schema'yı iki aşamada kurmak istiyorsanız:

**Adım 1: Tablolar ve Enum'lar**
```sql
-- database-schema-optimized.sql dosyasını çalıştırın
```

**Adım 2: Index'ler**
```sql
-- database-schema-indexes.sql dosyasını çalıştırın
```

## Yapılan Optimizasyonlar

### 1. Transaction Kaldırıldı
- Eski dosyada tüm işlemler `BEGIN; ... COMMIT;` bloğu içindeydi
- Yeni dosyada her statement bağımsız çalışıyor
- Bir hata olsa bile diğer işlemler etkilenmiyor

### 2. DROP İşlemleri Optimize Edildi
- Eski: Her tablo için ayrı DROP statement
- Yeni: PostgreSQL loop kullanarak toplu DROP

```sql
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

### 3. Index'ler Ayrıldı
- Tablo oluşturma sırasında index oluşturma işlemi yavaşlatıyor
- Index'ler artık ayrı bir dosyada ve tablo oluşturma sonrasında çalıştırılıyor
- Bu sayede tablo oluşturma daha hızlı tamamlanıyor

### 4. Gereksiz İşlemler Kaldırıldı
- Bazı index'ler tablo oluşturma sırasında zaten oluşturuluyor (UNIQUE constraint'ler)
- Bu index'ler duplicate olarak oluşturulmuyor

## Timeout Limitleri

Vercel PostgreSQL'in varsayılan timeout limitleri:
- Normal queries: ~30 saniye
- Long-running queries: ~60 saniye (konfigüre edilebilir)

Optimize edilmiş dosya bu limitlerin altında çalışmalıdır.

## Hata Durumunda

Eğer hala timeout alıyorsanız:

1. **Statement timeout'u artırın:**
```sql
SET statement_timeout = 300000; -- 5 dakika (milisaniye)
```

2. **Dosyayı daha küçük parçalara bölün:**
   - Part 1: Enum'lar
   - Part 2: Core tablolar (app_users, courses, quizzes)
   - Part 3: İlişkili tablolar
   - Part 4: Index'ler

3. **Doğrudan PostgreSQL bağlantısı kullanın:**
   Vercel SQL Editor yerine doğrudan PostgreSQL client kullanarak:
   ```bash
   psql -h your-db-host -U your-user -d your-database -f database-schema-optimized.sql
   ```

## Notlar

- ⚠️ **ÖNEMLİ:** Script çalıştırılmadan önce verilerinizi yedekleyin!
- ⚠️ Script tüm tabloları ve enum'ları DROP edip yeniden oluşturur
- ✅ Production'da RLS (Row Level Security) ayarlarını aktif etmeyi unutmayın
- ✅ Index'leri tablo oluşturma sonrasında mutlaka ekleyin (performans için)

## Dosya Karşılaştırması

| Özellik | database-schema.sql | database-schema-optimized.sql |
|---------|---------------------|-------------------------------|
| Transaction | ✅ Var | ❌ Yok |
| Drop Yöntemi | Manuel | Otomatik (Loop) |
| Index'ler | İçeride | Ayrı dosya |
| Timeout Riski | Yüksek | Düşük |
| Hata Toleransı | Düşük | Yüksek |

## Sonraki Adımlar

1. ✅ Schema'yı kurun
2. ✅ Index'leri ekleyin
3. ✅ Seed data'yı yükleyin (varsa)
4. ✅ RLS ayarlarını yapılandırın
5. ✅ Veritabanı bağlantılarını test edin

## Destek

Sorun yaşarsanız:
- Vercel PostgreSQL loglarını kontrol edin
- SQL syntax hatalarını kontrol edin
- Timeout süresini artırmayı deneyin

