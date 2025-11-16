# SQL dosyasındaki kesme işaretlerini düzeltir
# SQL'de string içindeki kesme işaretleri '' (iki tane) ile escape edilmelidir.

$content = Get-Content -Path "database-seed.sql" -Raw -Encoding UTF8

# SQL string literal içindeki kesme işaretlerini düzelt
# Basit yaklaşım: ' ile başlayan string'ler içindeki kesme işaretlerini bul ve düzelt
# Ancak zaten '' olanları değiştirme

$lines = $content -split "`n"
$fixedLines = @()

foreach ($line in $lines) {
    $result = ""
    $i = 0
    $inString = $false
    
    while ($i -lt $line.Length) {
        $char = $line[$i]
        
        if ($char -eq "'") {
            if (-not $inString) {
                # String başlangıcı
                $inString = $true
                $result += $char
                $i++
            } else {
                # String içindeyiz
                if ($i + 1 -lt $line.Length) {
                    $nextChar = $line[$i + 1]
                    if ($nextChar -eq "'") {
                        # Zaten escape edilmiş
                        $result += "''"
                        $i += 2
                    } elseif ($nextChar -match '[,)}\]\s]' -or $i + 1 -eq $line.Length - 1) {
                        # String sonu
                        $inString = $false
                        $result += $char
                        $i++
                    } else {
                        # String içinde kesme işareti - escape et
                        $result += "''"
                        $i++
                    }
                } else {
                    # Satır sonu
                    $inString = $false
                    $result += $char
                    $i++
                }
            }
        } else {
            $result += $char
            $i++
        }
    }
    
    $fixedLines += $result
}

$fixedContent = $fixedLines -join "`n"

Set-Content -Path "database-seed.sql" -Value $fixedContent -Encoding UTF8 -NoNewline

Write-Host "Kesme işaretleri başarıyla düzeltildi!"

