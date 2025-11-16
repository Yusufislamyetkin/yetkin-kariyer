# Database seed dosyasini modullere ayirir

$ErrorActionPreference = "Stop"

# DB-Scripts klasorunu olustur
if (-not (Test-Path "DB-Scripts")) {
    New-Item -ItemType Directory -Path "DB-Scripts" | Out-Null
}

# Dosyayi satir satir oku
$lines = Get-Content "database-seed.sql" -Encoding UTF8

# Satir numaralari (0-indexed)
$baseEnd = 6984
$generalQuizStart = 6985
$generalQuizEnd = 9314
$module07Start = 9315
$module07End = 9813
$module08Start = 9814
$module08End = 10524
$module09Start = 10525
$module09End = 11235
$module10Start = 11236
$module10End = 11946
$module11Start = 11947
$module11End = 12657
$module12Start = 12658
$module12End = 13013

# Base script
$baseLines = $lines[0..$baseEnd]
$baseContent = $baseLines -join "`n"
$baseFile = "DB-Scripts\00-base-seed-data.sql"
($baseContent + "`n`nCOMMIT;`n") | Set-Content -Path $baseFile -Encoding UTF8 -NoNewline
Write-Host "00-base-seed-data.sql olusturuldu"

# Genel quizler
$generalLines = $lines[$generalQuizStart..$generalQuizEnd]
$generalContent = $generalLines -join "`n"
$generalFile = "DB-Scripts\01-general-quizzes-seed-data.sql"
$generalHeader = "-- General Quizzes Seed Data`nBEGIN;`n`n"
$generalFooter = "`n`nCOMMIT;`n"
($generalHeader + $generalContent + $generalFooter) | Set-Content -Path $generalFile -Encoding UTF8 -NoNewline
Write-Host "01-general-quizzes-seed-data.sql olusturuldu"

# Module 07
$module07Lines = $lines[$module07Start..$module07End]
$module07Content = $module07Lines -join "`n"
$module07File = "DB-Scripts\Net-Core-module-07-seed-data.sql"
$module07Header = "-- Module 07 Seed Data`nBEGIN;`n`n"
$module07Footer = "`n`nCOMMIT;`n"
($module07Header + $module07Content + $module07Footer) | Set-Content -Path $module07File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-07-seed-data.sql olusturuldu"

# Module 08
$module08Lines = $lines[$module08Start..$module08End]
$module08Content = $module08Lines -join "`n"
$module08File = "DB-Scripts\Net-Core-module-08-seed-data.sql"
$module08Header = "-- Module 08 Seed Data`nBEGIN;`n`n"
$module08Footer = "`n`nCOMMIT;`n"
($module08Header + $module08Content + $module08Footer) | Set-Content -Path $module08File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-08-seed-data.sql olusturuldu"

# Module 09
$module09Lines = $lines[$module09Start..$module09End]
$module09Content = $module09Lines -join "`n"
$module09File = "DB-Scripts\Net-Core-module-09-seed-data.sql"
$module09Header = "-- Module 09 Seed Data`nBEGIN;`n`n"
$module09Footer = "`n`nCOMMIT;`n"
($module09Header + $module09Content + $module09Footer) | Set-Content -Path $module09File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-09-seed-data.sql olusturuldu"

# Module 10
$module10Lines = $lines[$module10Start..$module10End]
$module10Content = $module10Lines -join "`n"
$module10File = "DB-Scripts\Net-Core-module-10-seed-data.sql"
$module10Header = "-- Module 10 Seed Data`nBEGIN;`n`n"
$module10Footer = "`n`nCOMMIT;`n"
($module10Header + $module10Content + $module10Footer) | Set-Content -Path $module10File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-10-seed-data.sql olusturuldu"

# Module 11
$module11Lines = $lines[$module11Start..$module11End]
$module11Content = $module11Lines -join "`n"
$module11File = "DB-Scripts\Net-Core-module-11-seed-data.sql"
$module11Header = "-- Module 11 Seed Data`nBEGIN;`n`n"
$module11Footer = "`n`nCOMMIT;`n"
($module11Header + $module11Content + $module11Footer) | Set-Content -Path $module11File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-11-seed-data.sql olusturuldu"

# Module 12
$module12Lines = $lines[$module12Start..$module12End]
$module12Content = $module12Lines -join "`n"
$module12File = "DB-Scripts\Net-Core-module-12-seed-data.sql"
$module12Header = "-- Module 12 Seed Data`nBEGIN;`n`n"
$module12Footer = "`n`nCOMMIT;`n"
($module12Header + $module12Content + $module12Footer) | Set-Content -Path $module12File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-12-seed-data.sql olusturuldu"

# Master script
$masterContent = "-- Master Seed Data Script`n"
$masterContent += "-- Tum modulleri sirayla calistirir`n`n"
$masterContent += "\i 00-base-seed-data.sql`n"
$masterContent += "\i 01-general-quizzes-seed-data.sql`n"
$masterContent += "\i Net-Core-module-07-seed-data.sql`n"
$masterContent += "\i Net-Core-module-08-seed-data.sql`n"
$masterContent += "\i Net-Core-module-09-seed-data.sql`n"
$masterContent += "\i Net-Core-module-10-seed-data.sql`n"
$masterContent += "\i Net-Core-module-11-seed-data.sql`n"
$masterContent += "\i Net-Core-module-12-seed-data.sql`n"

$masterContent | Set-Content -Path "DB-Scripts\master-seed-data.sql" -Encoding UTF8 -NoNewline
Write-Host "master-seed-data.sql olusturuldu"
Write-Host "Tum dosyalar DB-Scripts klasorunde olusturuldu"

