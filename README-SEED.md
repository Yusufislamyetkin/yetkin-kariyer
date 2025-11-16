# Database Seed Script Çalıştırma Kılavuzu

Bu kılavuz, `database-seed.sql` dosyasını Supabase PostgreSQL veritabanında çalıştırmak için farklı yöntemleri açıklar.

## ⚠️ Önemli Uyarılar

1. **Veri Kaybı**: Bu script tüm tabloları TRUNCATE eder ve yeni veriler ekler. Mevcut verileriniz silinecektir!
2. **Yedekleme**: Script'i çalıştırmadan önce önemli verilerinizi yedekleyin.
3. **Test Ortamı**: İlk olarak test ortamında deneyin.

## Yöntem 1: Supabase SQL Editor (Önerilen)

1. Supabase Dashboard'a giriş yapın: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın
4. `database-seed.sql` dosyasının içeriğini kopyalayın
5. SQL Editor'e yapıştırın
6. **Run** butonuna tıklayın

**Avantajlar:**
- En kolay yöntem
- Hata mesajlarını görebilirsiniz
- Güvenli (Supabase arayüzü üzerinden)

## Yöntem 2: PowerShell Script (Windows)

1. PowerShell'i yönetici olarak açın
2. Proje dizinine gidin:
   ```powershell
   cd C:\Users\Yusuf\Desktop\Kariyer
   ```
3. Script'i çalıştırın:
   ```powershell
   .\run-seed-supabase.ps1
   ```

**Gereksinimler:**
- PostgreSQL client tools (psql) yüklü olmalı
- Windows için: https://www.postgresql.org/download/windows/
- Veya Scoop ile: `scoop install postgresql`

## Yöntem 3: Bash Script (Linux/Mac)

1. Terminal'i açın
2. Proje dizinine gidin:
   ```bash
   cd ~/Desktop/Kariyer
   ```
3. Script'e çalıştırma izni verin:
   ```bash
   chmod +x run-seed-supabase.sh
   ```
4. Script'i çalıştırın:
   ```bash
   ./run-seed-supabase.sh
   ```

**Gereksinimler:**
- PostgreSQL client tools (psql) yüklü olmalı
- Linux: `sudo apt-get install postgresql-client`
- Mac: `brew install postgresql`

## Yöntem 4: Doğrudan psql Komutu

### Windows (PowerShell)
```powershell
$env:PGPASSWORD="UVj6HgBSlEK3dLJ6"
psql -h db.lpkkzylcckparmovjmjm.supabase.co -p 5432 -U postgres -d postgres -f database-seed.sql --set=sslmode=require
$env:PGPASSWORD=$null
```

### Linux/Mac (Bash)
```bash
export PGPASSWORD="UVj6HgBSlEK3dLJ6"
psql -h db.lpkkzylcckparmovjmjm.supabase.co -p 5432 -U postgres -d postgres -f database-seed.sql --set=sslmode=require
unset PGPASSWORD
```

## Yöntem 5: Node.js ile (pg Kütüphanesi)

Eğer Node.js kullanıyorsanız:

```javascript
const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  host: 'db.lpkkzylcckparmovjmjm.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'UVj6HgBSlEK3dLJ6',
  ssl: { rejectUnauthorized: false }
});

async function runSeed() {
  try {
    await client.connect();
    console.log('Bağlantı başarılı!');
    
    const sql = fs.readFileSync('database-seed.sql', 'utf8');
    await client.query(sql);
    
    console.log('✓ Script başarıyla çalıştırıldı!');
  } catch (error) {
    console.error('HATA:', error.message);
  } finally {
    await client.end();
  }
}

runSeed();
```

## Hata Ayıklama

### Bağlantı Hatası
- SSL sertifikası sorunları olabilir
- Firewall/network ayarlarını kontrol edin
- Supabase dashboard'dan bağlantı bilgilerini doğrulayın

### Syntax Hatası
- SQL syntax'ını kontrol edin
- Supabase SQL Editor'de hata mesajlarını okuyun
- Script'in başındaki `BEGIN` ve sonundaki `COMMIT` ifadelerini kontrol edin

### Permission Hatası
- Kullanıcı yetkilerini kontrol edin
- Extension'ların yüklenmesi için gerekli yetkileri kontrol edin

## Script İçeriği

Script şunları yapar:
1. `pgcrypto` extension'ını yükler (gen_random_uuid() için)
2. Tüm tabloları TRUNCATE eder (CASCADE ile)
3. Users tablosuna seed data ekler
4. Friendships tablosuna seed data ekler
5. Courses tablosuna seed data ekler
6. Quizzes tablosuna seed data ekler (50+ quiz)

## Güvenlik Notları

- Bu script'teki bağlantı bilgileri hassas bilgilerdir
- Script'leri version control'e commit etmeden önce `.env` dosyası kullanın
- Production ortamında environment variable'ları kullanın
- Script'leri public repository'lere yüklemeyin

## Destek

Sorun yaşarsanız:
1. Supabase SQL Editor'de hata mesajlarını kontrol edin
2. Script'i küçük parçalara bölerek test edin
3. Supabase Dashboard'dan database log'larını kontrol edin

