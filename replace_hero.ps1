
$targetPath = "src\results\TeaserPageNew.tsx"
$replacementPath = "temp_hero.tsx"
$startLine = 38
$endLine = 126

# Check if files exist
if (-not (Test-Path $targetPath)) { Write-Error "Target not found"; exit 1 }
if (-not (Test-Path $replacementPath)) { Write-Error "Replacement not found"; exit 1 }

$content = Get-Content -Path $targetPath
$newBlock = Get-Content -Path $replacementPath

# 1-based indexing logic:
# We want to overwrite lines 38 to 126 inclusive.
# 0-based: index 37 to 125.
# Keep 0 to 36.
# Keep 126 to end.

$before = $content[0..($startLine - 2)]
$after = $content[$endLine..($content.Length - 1)]

$finalContent = $before + $newBlock + $after
Set-Content -Path $targetPath -Value $finalContent -Encoding UTF8

Write-Host "Replacement successful."
