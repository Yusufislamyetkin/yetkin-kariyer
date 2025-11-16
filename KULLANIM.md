# Database Seed Script Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

Script'i çalıştırmak için tek komut yeterli:

```powershell
.\run-seed-supabase.ps1
```

## 📋 Gereksinimler

- ✅ Node.js (v14.0.0 veya üzeri) - Zaten yüklü
- ✅ database-seed.sql dosyası - Mevcut
- ✅ Supabase bağlantı bilgileri - Script içinde mevcut

## 🎯 Kullanım

### Yöntem 1: PowerShell Script (Önerilen)

1. PowerShell'i açın
2. Proje dizinine gidin:
   ```powershell
   cd C:\Users\Yusuf\Desktop\Kariyer
   ```
3. Script'i çalıştırın:
   ```powershell
   .\run-seed-supabase.ps1
   ```

**Avantajlar:**
- ✅ Otomatik bağımlılık yükleme
- ✅ Hata kontrolü
- ✅ Renkli çıktı
- ✅ Kullanıcı onayı

### Yöntem 2: Node.js Script (Doğrudan)

```powershell
node run-seed.js
```

## ⚠️ Önemli Uyarılar

1. **Veri Kaybı**: Bu script tüm tabloları TRUNCATE eder ve yeni veriler ekler.
2. **Yedekleme**: Script'i çalıştırmadan önce önemli verilerinizi yedekleyin.
3. **Test Ortamı**: İlk olarak test ortamında deneyin.

## 🔧 Nasıl Çalışır?

1. Script, Node.js'in yüklü olup olmadığını kontrol eder
2. `pg` kütüphanesinin yüklü olup olmadığını kontrol eder (yoksa otomatik yükler)
3. `database-seed.sql` dosyasını okur
4. Supabase PostgreSQL veritabanına bağlanır
5. SQL script'ini çalıştırır
6. Sonuçları gösterir

## 📊 Çıktı Örneği

```
================================================
Supabase Database Seed Script Runner
================================================

Node.js bulundu: v22.17.1
✓ node_modules bulundu.

Bağlantı bilgileri:
  Host: db.lpkkzylcckparmovjmjm.supabase.co
  Database: postgres
  User: postgres
  Port: 5432
  SSL Mode: require

Seed dosyası: database-seed.sql

Script çalıştırılıyor...

Supabase'e bağlanılıyor...
  Host: db.lpkkzylcckparmovjmjm.supabase.co
  Database: postgres
  User: postgres
  Port: 5432

✓ Bağlantı başarılı!

Script çalıştırılıyor...
Bu işlem birkaç dakika sürebilir...

================================================
✓ Script Başarıyla Çalıştırıldı!
Süre: 45.23 saniye
================================================
```

## 🐛 Hata Ayıklama

### Bağlantı Hatası
- Supabase bağlantı bilgilerini kontrol edin
- Firewall/network ayarlarını kontrol edin
- SSL sertifikası sorunlarını kontrol edin

### SQL Syntax Hatası
- SQL script'ini kontrol edin
- Supabase SQL Editor'de hata mesajlarını okuyun
- Script'in başındaki `BEGIN` ve sonundaki `COMMIT` ifadelerini kontrol edin

### Bağımlılık Hatası
- `npm install pg` komutunu manuel olarak çalıştırın
- Node.js'in güncel olduğundan emin olun

## 📝 Script İçeriği

Script şunları yapar:
1. `pgcrypto` extension'ını yükler (gen_random_uuid() için)
2. Tüm tabloları TRUNCATE eder (CASCADE ile)
3. Users tablosuna seed data ekler
4. Friendships tablosuna seed data ekler
5. Courses tablosuna seed data ekler
6. Quizzes tablosuna seed data ekler (50+ quiz)

## 🔐 Güvenlik Notları

- ⚠️ Script'teki bağlantı bilgileri hassas bilgilerdir
- ⚠️ Script'leri version control'e commit etmeden önce `.env` dosyası kullanın
- ⚠️ Production ortamında environment variable'ları kullanın
- ⚠️ Script'leri public repository'lere yüklemeyin

## 🆘 Destek

Sorun yaşarsanız:
1. Script'in çıktısını kontrol edin
2. Hata mesajlarını okuyun
3. Supabase Dashboard'dan database log'larını kontrol edin
4. Script'i küçük parçalara bölerek test edin

## 📚 İlgili Dosyalar

- `database-seed.sql` - SQL seed script'i
- `run-seed.js` - Node.js script'i
- `run-seed-supabase.ps1` - PowerShell wrapper script'i
- `package.json` - Node.js bağımlılıkları
- `README-SEED.md` - Detaylı kılavuz

## 🎉 Başarılı!

Script başarıyla çalıştıktan sonra:
- ✅ Tüm tablolar temizlendi
- ✅ Yeni seed data eklendi
- ✅ Veritabanı hazır!

Artık her seferinde kopyalama yapmanıza gerek yok. Sadece script'i çalıştırın! 🚀

