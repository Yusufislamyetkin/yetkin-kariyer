# Database seed dosyasini tum modullere ayirir

$ErrorActionPreference = "Stop"

# DB-Scripts klasorunu olustur
if (-not (Test-Path "DB-Scripts")) {
    New-Item -ItemType Directory -Path "DB-Scripts" | Out-Null
}

# Dosyayi satir satir oku
$lines = Get-Content "database-seed.sql" -Encoding UTF8

# Satir numaralari (0-indexed)
$baseEnd = 6984
$module01Start = 7059  # mini-test-csharp başlangıcı
$module01End = 7579    # mini-test-csharp bitişi
$module02Start = 7582  # mini-test-dotnet-runtime başlangıcı
$module02End = 7937    # mini-test-dotnet-runtime bitişi
$module03Start = 7939  # mini-test-architecture başlangıcı
$module03End = 8294    # mini-test-architecture bitişi
$module04Start = 8296  # mini-test-aspnet-mvc başlangıcı
$module04End = 8599    # mini-test-aspnet-mvc bitişi
$module05Start = 8602  # mini-test-web-api başlangıcı
$module05End = 8956    # mini-test-web-api bitişi
$module06Start = 8959  # mini-test-middleware başlangıcı
$module06End = 9313    # mini-test-middleware bitişi
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

# Module 01 - C# Temelleri
$module01Lines = $lines[$module01Start..$module01End]
$module01Content = $module01Lines -join "`n"
$module01File = "DB-Scripts\Net-Core-module-01-seed-data.sql"
$module01Header = "-- Module 01: C# Temelleri - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module01Footer = "`n`nCOMMIT;`n"
($module01Header + $module01Content + $module01Footer) | Set-Content -Path $module01File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-01-seed-data.sql olusturuldu"

# Module 02 - .NET Core Runtime
$module02Lines = $lines[$module02Start..$module02End]
$module02Content = $module02Lines -join "`n"
$module02File = "DB-Scripts\Net-Core-module-02-seed-data.sql"
$module02Header = "-- Module 02: .NET Core Runtime - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module02Footer = "`n`nCOMMIT;`n"
($module02Header + $module02Content + $module02Footer) | Set-Content -Path $module02File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-02-seed-data.sql olusturuldu"

# Module 03 - Architecture
$module03Lines = $lines[$module03Start..$module03End]
$module03Content = $module03Lines -join "`n"
$module03File = "DB-Scripts\Net-Core-module-03-seed-data.sql"
$module03Header = "-- Module 03: Architecture - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module03Footer = "`n`nCOMMIT;`n"
($module03Header + $module03Content + $module03Footer) | Set-Content -Path $module03File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-03-seed-data.sql olusturuldu"

# Module 04 - ASP.NET Core MVC
$module04Lines = $lines[$module04Start..$module04End]
$module04Content = $module04Lines -join "`n"
$module04File = "DB-Scripts\Net-Core-module-04-seed-data.sql"
$module04Header = "-- Module 04: ASP.NET Core MVC - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module04Footer = "`n`nCOMMIT;`n"
($module04Header + $module04Content + $module04Footer) | Set-Content -Path $module04File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-04-seed-data.sql olusturuldu"

# Module 05 - Web API
$module05Lines = $lines[$module05Start..$module05End]
$module05Content = $module05Lines -join "`n"
$module05File = "DB-Scripts\Net-Core-module-05-seed-data.sql"
$module05Header = "-- Module 05: Web API - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module05Footer = "`n`nCOMMIT;`n"
($module05Header + $module05Content + $module05Footer) | Set-Content -Path $module05File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-05-seed-data.sql olusturuldu"

# Module 06 - Middleware
$module06Lines = $lines[$module06Start..$module06End]
$module06Content = $module06Lines -join "`n"
$module06File = "DB-Scripts\Net-Core-module-06-seed-data.sql"
$module06Header = "-- Module 06: Middleware - Mini Tests`nBEGIN;`n`nINSERT INTO `"quizzes`" (`n    `"id`",`n    `"courseId`",`n    `"title`",`n    `"description`",`n    `"topic`",`n    `"type`",`n    `"level`",`n    `"questions`",`n    `"passingScore`",`n    `"lessonSlug`",`n    `"createdAt`",`n    `"updatedAt`"`n)`nVALUES`n"
$module06Footer = "`n`nCOMMIT;`n"
($module06Header + $module06Content + $module06Footer) | Set-Content -Path $module06File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-06-seed-data.sql olusturuldu"

# Module 07
$module07Lines = $lines[$module07Start..$module07End]
$module07Content = $module07Lines -join "`n"
$module07File = "DB-Scripts\Net-Core-module-07-seed-data.sql"
$module07Header = "-- Module 07: Authentication & Authorization - Mini Tests`nBEGIN;`n`n"
$module07Footer = "`n`nCOMMIT;`n"
($module07Header + $module07Content + $module07Footer) | Set-Content -Path $module07File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-07-seed-data.sql olusturuldu"

# Module 08
$module08Lines = $lines[$module08Start..$module08End]
$module08Content = $module08Lines -join "`n"
$module08File = "DB-Scripts\Net-Core-module-08-seed-data.sql"
$module08Header = "-- Module 08: Logging ve Exception Handling - Mini Tests`nBEGIN;`n`n"
$module08Footer = "`n`nCOMMIT;`n"
($module08Header + $module08Content + $module08Footer) | Set-Content -Path $module08File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-08-seed-data.sql olusturuldu"

# Module 09
$module09Lines = $lines[$module09Start..$module09End]
$module09Content = $module09Lines -join "`n"
$module09File = "DB-Scripts\Net-Core-module-09-seed-data.sql"
$module09Header = "-- Module 09: Configuration Management - Mini Tests`nBEGIN;`n`n"
$module09Footer = "`n`nCOMMIT;`n"
($module09Header + $module09Content + $module09Footer) | Set-Content -Path $module09File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-09-seed-data.sql olusturuldu"

# Module 10
$module10Lines = $lines[$module10Start..$module10End]
$module10Content = $module10Lines -join "`n"
$module10File = "DB-Scripts\Net-Core-module-10-seed-data.sql"
$module10Header = "-- Module 10: Unit Test ve Integration Test - Mini Tests`nBEGIN;`n`n"
$module10Footer = "`n`nCOMMIT;`n"
($module10Header + $module10Content + $module10Footer) | Set-Content -Path $module10File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-10-seed-data.sql olusturuldu"

# Module 11
$module11Lines = $lines[$module11Start..$module11End]
$module11Content = $module11Lines -join "`n"
$module11File = "DB-Scripts\Net-Core-module-11-seed-data.sql"
$module11Header = "-- Module 11: Performans ve Caching Teknikleri - Mini Tests`nBEGIN;`n`n"
$module11Footer = "`n`nCOMMIT;`n"
($module11Header + $module11Content + $module11Footer) | Set-Content -Path $module11File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-11-seed-data.sql olusturuldu"

# Module 12
$module12Lines = $lines[$module12Start..$module12End]
$module12Content = $module12Lines -join "`n"
$module12File = "DB-Scripts\Net-Core-module-12-seed-data.sql"
$module12Header = "-- Module 12: Asenkron Programlama (Async/Await) - Mini Tests`nBEGIN;`n`n"
$module12Footer = "`n`nCOMMIT;`n"
($module12Header + $module12Content + $module12Footer) | Set-Content -Path $module12File -Encoding UTF8 -NoNewline
Write-Host "Net-Core-module-12-seed-data.sql olusturuldu"

# Master script
$masterContent = "-- Master Seed Data Script`n"
$masterContent += "-- Tum modulleri sirayla calistirir`n`n"
$masterContent += "\i 00-base-seed-data.sql`n"
$masterContent += "\i Net-Core-module-01-seed-data.sql`n"
$masterContent += "\i Net-Core-module-02-seed-data.sql`n"
$masterContent += "\i Net-Core-module-03-seed-data.sql`n"
$masterContent += "\i Net-Core-module-04-seed-data.sql`n"
$masterContent += "\i Net-Core-module-05-seed-data.sql`n"
$masterContent += "\i Net-Core-module-06-seed-data.sql`n"
$masterContent += "\i Net-Core-module-07-seed-data.sql`n"
$masterContent += "\i Net-Core-module-08-seed-data.sql`n"
$masterContent += "\i Net-Core-module-09-seed-data.sql`n"
$masterContent += "\i Net-Core-module-10-seed-data.sql`n"
$masterContent += "\i Net-Core-module-11-seed-data.sql`n"
$masterContent += "\i Net-Core-module-12-seed-data.sql`n"

$masterContent | Set-Content -Path "DB-Scripts\master-seed-data.sql" -Encoding UTF8 -NoNewline
Write-Host "master-seed-data.sql olusturuldu"
Write-Host "Tum dosyalar DB-Scripts klasorunde olusturuldu"

