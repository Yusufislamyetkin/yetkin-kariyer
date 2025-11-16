# Update Module 5 in main JSON file using PowerShell
$ErrorActionPreference = "Stop"

$mainJsonPath = "data\lesson-contents\dotnet-core-lessons.json"
$module5JsonPath = "data\lesson-contents\module-05-console-detailed.json"

Write-Host "Reading Module 5 JSON..."
try {
    $module5Content = Get-Content $module5JsonPath -Raw -Encoding UTF8
    $module5Data = $module5Content | ConvertFrom-Json
    Write-Host "Module 5 JSON is valid"
} catch {
    Write-Host "Error reading Module 5 JSON: $_"
    exit 1
}

Write-Host "Reading main JSON file..."
try {
    # Try to read and parse the main JSON
    $mainContent = Get-Content $mainJsonPath -Raw -Encoding UTF8
    
    # Try to find and fix common JSON issues
    # Remove BOM if present
    if ($mainContent.StartsWith([char]0xFEFF)) {
        $mainContent = $mainContent.Substring(1)
    }
    
    $mainData = $mainContent | ConvertFrom-Json
    Write-Host "Main JSON is valid"
    
    Write-Host "Finding module-05..."
    $moduleIndex = -1
    
    # Try to find module-05
    for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
        if ($mainData.modules[$i].moduleId -eq "module-05") {
            $moduleIndex = $i
            Write-Host "Found module-05 at index $i"
            break
        }
    }
    
    # If not found, try module-05-web-api
    if ($moduleIndex -eq -1) {
        for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
            if ($mainData.modules[$i].moduleId -eq "module-05-web-api") {
                $moduleIndex = $i
                Write-Host "Found module-05-web-api at index $i, will replace with module-05"
                break
            }
        }
    }
    
    if ($moduleIndex -ge 0) {
        Write-Host "Updating module at index $moduleIndex..."
        $mainData.modules[$moduleIndex] = $module5Data
    } else {
        Write-Host "module-05 not found, adding new module..."
        # Find position after module-04
        $module04Index = -1
        for ($i = 0; $i -lt $mainData.modules.Count; $i++) {
            $moduleId = $mainData.modules[$i].moduleId
            if ($moduleId -eq "module-04-aspnet-mvc" -or $moduleId -eq "module-04") {
                $module04Index = $i
                break
            }
        }
        if ($module04Index -ge 0) {
            $mainData.modules.Insert($module04Index + 1, $module5Data)
        } else {
            $mainData.modules += $module5Data
        }
    }
    
    # Update total lessons count
    $totalLessons = 0
    foreach ($module in $mainData.modules) {
        if ($module.lessons -and $module.lessons.Count -gt 0) {
            $totalLessons += $module.lessons.Count
        }
    }
    $mainData.totalLessons = $totalLessons
    
    Write-Host "Writing updated JSON file..."
    # Convert to JSON and write without BOM
    $jsonContent = $mainData | ConvertTo-Json -Depth 100 -Compress:$false
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText((Resolve-Path $mainJsonPath).Path, $jsonContent, $utf8NoBom)
    
    Write-Host "✅ Module 5 content updated successfully!"
    Write-Host "✅ Total lessons in file: $totalLessons"
    Write-Host "✅ Module 5 has $($module5Data.lessons.Count) lessons"
    
} catch {
    Write-Host "Error: $_"
    Write-Host "Stack trace: $($_.ScriptStackTrace)"
    
    # Try to create a backup and fix the JSON
    Write-Host "Attempting to fix JSON..."
    $backupPath = "$mainJsonPath.backup"
    Copy-Item $mainJsonPath $backupPath -Force
    Write-Host "Backup created: $backupPath"
    
    exit 1
}
