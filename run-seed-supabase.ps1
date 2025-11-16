# Supabase Database Seed Script Runner (Node.js Version)
# Bu script database-seed.sql dosyasını Supabase PostgreSQL veritabanında çalıştırır
# Node.js ve pg kütüphanesi kullanır

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Supabase Database Seed Script Runner" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Node.js'in yüklü olup olmadığını kontrol et
$nodePath = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodePath) {
    Write-Host "HATA: Node.js bulunamadı!" -ForegroundColor Red
    Write-Host "Node.js yüklü olmalıdır." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Node.js indirin: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node.js bulundu: $($nodePath.Version)" -ForegroundColor Green
Write-Host ""

# Seed dosyasının var olup olmadığını kontrol et
$SEED_FILE = "database-seed.sql"
if (-not (Test-Path $SEED_FILE)) {
    Write-Host "HATA: $SEED_FILE dosyası bulunamadı!" -ForegroundColor Red
    exit 1
}

# run-seed.js dosyasının var olup olmadığını kontrol et
$RUN_SCRIPT = "run-seed.js"
if (-not (Test-Path $RUN_SCRIPT)) {
    Write-Host "HATA: $RUN_SCRIPT dosyası bulunamadı!" -ForegroundColor Red
    exit 1
}

Write-Host "Bağlantı bilgileri:" -ForegroundColor Green
Write-Host "  Host: db.lpkkzylcckparmovjmjm.supabase.co" -ForegroundColor Gray
Write-Host "  Database: postgres" -ForegroundColor Gray
Write-Host "  User: postgres" -ForegroundColor Gray
Write-Host "  Port: 5432" -ForegroundColor Gray
Write-Host "  SSL Mode: require" -ForegroundColor Gray
Write-Host ""
Write-Host "Seed dosyası: $SEED_FILE" -ForegroundColor Green
Write-Host ""

# pg kütüphanesinin yüklü olup olmadığını kontrol et
$packageJson = "package.json"
if (Test-Path $packageJson) {
    Write-Host "package.json bulundu. Bağımlılıklar kontrol ediliyor..." -ForegroundColor Yellow
    Write-Host ""
    
    # node_modules klasörünün var olup olmadığını kontrol et
    if (-not (Test-Path "node_modules")) {
        Write-Host "node_modules bulunamadı. Bağımlılıklar yükleniyor..." -ForegroundColor Yellow
        Write-Host ""
        
        npm install
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "HATA: Bağımlılıklar yüklenemedi!" -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "✓ Bağımlılıklar başarıyla yüklendi!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "✓ node_modules bulundu." -ForegroundColor Green
        Write-Host ""
    }
} else {
    Write-Host "UYARI: package.json bulunamadı. Bağımlılıklar otomatik yüklenecek." -ForegroundColor Yellow
    Write-Host ""
}

# Node.js script'ini çalıştır
Write-Host "Script çalıştırılıyor..." -ForegroundColor Yellow
Write-Host ""

try {
    node $RUN_SCRIPT
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Green
        Write-Host "✓ Script başarıyla tamamlandı!" -ForegroundColor Green
        Write-Host "================================================" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "================================================" -ForegroundColor Red
        Write-Host "✗ Script çalıştırılırken hata oluştu!" -ForegroundColor Red
        Write-Host "Exit Code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "================================================" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host ""
    Write-Host "HATA: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
