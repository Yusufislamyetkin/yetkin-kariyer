#!/bin/bash
# Supabase Database Seed Script Runner
# Bu script database-seed.sql dosyasını Supabase PostgreSQL veritabanında çalıştırır

# Supabase bağlantı bilgileri
POSTGRES_HOST="db.lpkkzylcckparmovjmjm.supabase.co"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="UVj6HgBSlEK3dLJ6"
POSTGRES_DATABASE="postgres"
POSTGRES_PORT="5432"
SSL_MODE="require"

# Seed dosyasının yolu
SEED_FILE="database-seed.sql"

echo "================================================"
echo "Supabase Database Seed Script Runner"
echo "================================================"
echo ""

# psql'in yüklü olup olmadığını kontrol et
if ! command -v psql &> /dev/null; then
    echo "HATA: psql bulunamadı!"
    echo "PostgreSQL client tools yüklü olmalıdır."
    echo ""
    echo "Linux/Mac için: sudo apt-get install postgresql-client"
    echo "veya: brew install postgresql"
    exit 1
fi

# Seed dosyasının var olup olmadığını kontrol et
if [ ! -f "$SEED_FILE" ]; then
    echo "HATA: $SEED_FILE dosyası bulunamadı!"
    exit 1
fi

echo "Bağlantı bilgileri:"
echo "  Host: $POSTGRES_HOST"
echo "  Database: $POSTGRES_DATABASE"
echo "  User: $POSTGRES_USER"
echo "  Port: $POSTGRES_PORT"
echo "  SSL Mode: $SSL_MODE"
echo ""
echo "Seed dosyası: $SEED_FILE"
echo ""

# Kullanıcıdan onay al
read -p "Devam etmek istiyor musunuz? (E/H): " confirmation
if [ "$confirmation" != "E" ] && [ "$confirmation" != "e" ] && [ "$confirmation" != "Y" ] && [ "$confirmation" != "y" ]; then
    echo "İşlem iptal edildi."
    exit 0
fi

echo ""
echo "Script çalıştırılıyor..."
echo ""

# psql komutunu çalıştır
export PGPASSWORD="$POSTGRES_PASSWORD"

psql -h "$POSTGRES_HOST" \
     -p "$POSTGRES_PORT" \
     -U "$POSTGRES_USER" \
     -d "$POSTGRES_DATABASE" \
     -f "$SEED_FILE" \
     --set=sslmode="$SSL_MODE"

EXIT_CODE=$?

# Güvenlik için PGPASSWORD'u temizle
unset PGPASSWORD

if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✓ Script başarıyla çalıştırıldı!"
    echo "================================================"
    exit 0
else
    echo ""
    echo "================================================"
    echo "✗ Script çalıştırılırken hata oluştu!"
    echo "Exit Code: $EXIT_CODE"
    echo "================================================"
    exit $EXIT_CODE
fi

