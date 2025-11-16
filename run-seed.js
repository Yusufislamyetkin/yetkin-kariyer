#!/usr/bin/env node
/**
 * Supabase Database Seed Script Runner
 * Bu script database-seed.sql dosyasını Supabase PostgreSQL veritabanında çalıştırır
 * Node.js ve pg kütüphanesi kullanır
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Supabase bağlantı bilgileri
// Non-pooling connection string kullanıyoruz (transaction ve BEGIN/COMMIT için gerekli)
// Pooler üzerinden non-pooling port (5432) kullanıyoruz
// SSL sertifika hatası için NODE_TLS_REJECT_UNAUTHORIZED=0 ayarı gerekebilir
const CONNECTION_STRING = "postgres://postgres.lpkkzylcckparmovjmjm:UVj6HgBSlEK3dLJ6@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require";

// Seed dosyasının yolu
const SEED_FILE = path.join(__dirname, "database-seed.sql");

// Renkli console output için
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
    log('\n================================================', 'cyan');
    log(message, 'cyan');
    log('================================================', 'cyan');
    log('');
}

function logInfo(message) {
    log(message, 'gray');
}

function logSuccess(message) {
    log(message, 'green');
}

function logError(message) {
    log(message, 'red');
}

function logWarning(message) {
    log(message, 'yellow');
}

// pg kütüphanesinin yüklü olup olmadığını kontrol et
function checkPgLibrary() {
    try {
        require.resolve('pg');
        return true;
    } catch (e) {
        return false;
    }
}

// pg kütüphanesini yükle
async function installPgLibrary() {
    logWarning('pg kütüphanesi bulunamadı. Yükleniyor...');
    logInfo('Bu işlem birkaç saniye sürebilir...\n');
    
    const { execSync } = require('child_process');
    try {
        execSync('npm install pg', { stdio: 'inherit', cwd: __dirname });
        logSuccess('✓ pg kütüphanesi başarıyla yüklendi!\n');
        return true;
    } catch (error) {
        logError('✗ pg kütüphanesi yüklenemedi!');
        logError('Hata: ' + error.message);
        logWarning('\nManuel olarak yüklemek için: npm install pg');
        return false;
    }
}

// Seed dosyasını oku
function readSeedFile() {
    try {
        if (!fs.existsSync(SEED_FILE)) {
            logError(`HATA: ${SEED_FILE} dosyası bulunamadı!`);
            process.exit(1);
        }
        
        // UTF-8 BOM olmadan oku
        const sql = fs.readFileSync(SEED_FILE, 'utf8').replace(/^\uFEFF/, '');
        logSuccess(`✓ Seed dosyası okundu: ${SEED_FILE}`);
        logInfo(`  Dosya boyutu: ${(sql.length / 1024).toFixed(2)} KB`);
        logInfo(`  Satır sayısı: ${sql.split('\n').length}`);
        return sql;
    } catch (error) {
        logError(`HATA: Seed dosyası okunamadı!`);
        logError('Hata: ' + error.message);
        process.exit(1);
    }
}

// Supabase'e bağlan ve SQL'i çalıştır
async function runSeed(sql) {
    // SSL sertifika hatası için environment variable ayarla
    // Bu güvenlik riski yaratabilir, sadece güvenilir bağlantılar için kullanın
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }
    
    // Connection string kullanarak bağlan
    const client = new Client({
        connectionString: CONNECTION_STRING,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        logInfo('Supabase\'e bağlanılıyor...');
        logInfo('  Connection: Non-pooling (port 5432)');
        logInfo('  SSL: Required');
        log('');

        await client.connect();
        logSuccess('✓ Bağlantı başarılı!');
        log('');

        logWarning('Script çalıştırılıyor...');
        logWarning('Bu işlem birkaç dakika sürebilir...');
        log('');

        const startTime = Date.now();
        
        // SQL'i temizle
        let cleanSql = sql.trim();
        // BOM ve diğer görünmez karakterleri kaldır
        cleanSql = cleanSql.replace(/^\uFEFF/, '').trim();
        
        // Büyük SQL dosyaları için connection string kullanarak direkt çalıştırma
        // PostgreSQL'in kendi parser'ı daha iyi çalışır
        // Ancak pg kütüphanesi ile tek query olarak gönderiyoruz
        
        // Önemli: PostgreSQL pooler ile çalışırken bazı sınırlamalar var
        // Bu yüzden SQL'i doğrudan çalıştırıyoruz
        logInfo('SQL script çalıştırılıyor (bu işlem biraz zaman alabilir)...');
        
        try {
            // SQL'i çalıştır - BEGIN/COMMIT bloğu içinde
            await client.query(cleanSql);
        } catch (error) {
            // Daha detaylı hata göster
            logError(`SQL hatası: ${error.message}`);
            
            if (error.position) {
                // Hata pozisyonunu satır numarasına çevir
                const lines = cleanSql.substring(0, error.position).split('\n');
                const lineNumber = lines.length;
                logError(`Hata pozisyonu: ${error.position} (yaklaşık satır: ${lineNumber})`);
                
                // Hatalı bölgeyi göster
                const contextLines = 10;
                const startLine = Math.max(0, lineNumber - contextLines);
                const endLine = Math.min(cleanSql.split('\n').length, lineNumber + contextLines);
                const allLines = cleanSql.split('\n');
                
                logWarning(`\nHatalı bölge (satır ${startLine + 1}-${endLine}):`);
                for (let i = startLine; i < endLine; i++) {
                    const lineNum = i + 1;
                    const line = allLines[i];
                    if (lineNum === lineNumber) {
                        logError(`>>> ${lineNum}: ${line}`);
                    } else {
                        logInfo(`    ${lineNum}: ${line}`);
                    }
                }
            }
            
            if (error.hint) {
                logWarning(`İpucu: ${error.hint}`);
            }
            
            if (error.detail) {
                logInfo(`Detay: ${error.detail}`);
            }
            
            // JSON hatası özel durumu
            if (error.message.includes('json') || error.message.includes('JSON')) {
                logWarning('\nNOT: JSON hatası alıyorsanız, muhtemelen SQL dosyasındaki JSON içeriğinde');
                logWarning('escape karakterleri sorunlu olabilir. SQL Editor\'de kontrol edin.');
            }
            
            throw error;
        }
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        log('');
        logHeader('✓ Script Başarıyla Çalıştırıldı!');
        logSuccess(`Süre: ${duration} saniye`);
        log('');

    } catch (error) {
        log('');
        logHeader('✗ Script Çalıştırılırken Hata Oluştu!');
        logError('Hata: ' + error.message);
        
        if (error.position) {
            logError(`Satır: ${error.position}`);
        }
        
        if (error.hint) {
            logWarning('İpucu: ' + error.hint);
        }
        
        if (error.detail) {
            logInfo('Detay: ' + error.detail);
        }
        
        log('');
        process.exit(1);
    } finally {
        await client.end();
        logInfo('Bağlantı kapatıldı.');
    }
}

// Ana fonksiyon
async function main() {
    logHeader('Supabase Database Seed Script Runner');
    
    // pg kütüphanesini kontrol et
    if (!checkPgLibrary()) {
        const installed = await installPgLibrary();
        if (!installed) {
            process.exit(1);
        }
        // pg kütüphanesini yeniden yükle
        delete require.cache[require.resolve('pg')];
    }
    
    // Seed dosyasını oku
    const sql = readSeedFile();
    log('');
    
    // Non-interactive mod kontrolü (--yes veya AUTO_CONFIRM environment variable)
    const autoConfirm = process.argv.includes('--yes') || 
                        process.argv.includes('-y') || 
                        process.env.AUTO_CONFIRM === 'true' ||
                        process.env.AUTO_CONFIRM === '1';
    
    if (autoConfirm) {
        logInfo('Otomatik onay modu aktif. Script çalıştırılıyor...');
        log('');
        // SQL'i çalıştır
        await runSeed(sql);
        return;
    }
    
    // Kullanıcıdan onay al
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question('Devam etmek istiyor musunuz? (E/H): ', async (answer) => {
            rl.close();
            
            if (answer.toLowerCase() !== 'e' && answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'evet') {
                logWarning('İşlem iptal edildi.');
                process.exit(0);
            }
            
            // SQL'i çalıştır
            await runSeed(sql);
            resolve();
        });
    });
}

// Script'i çalıştır
main().catch((error) => {
    logError('Beklenmeyen hata: ' + error.message);
    process.exit(1);
});
