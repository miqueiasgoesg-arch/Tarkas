param(
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent),
  [string[]]$UserDataRoots = @((Join-Path $env:APPDATA 'Tarkas'), (Join-Path $env:APPDATA 'projeto-tarkas'))
)
$ErrorActionPreference = 'Stop'
$running = @(Get-Process -Name Tarkas,electron -ErrorAction SilentlyContinue | Where-Object { $_.Path -and ($_.Path -like "$ProjectRoot\*" -or $_.Path -like '*\Tarkas.exe') })
if ($running.Count) { throw 'Feche o Tarkas antes do backup para preservar SQLite e armazenamento do navegador.' }
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss-fff'
$backupRoot = Join-Path $ProjectRoot 'backups'
$dest = Join-Path $backupRoot $stamp
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$roots = @($UserDataRoots | Where-Object { Test-Path -LiteralPath $_ -PathType Container } | Select-Object -Unique)
if (!$roots.Count) { throw 'Nenhuma pasta de dados encontrada. Informe -UserDataRoots.' }
$manifest = @()
foreach ($root in $roots) {
  $source = (Resolve-Path -LiteralPath $root).Path
  $target = Join-Path $dest (Split-Path $source -Leaf)
  New-Item -ItemType Directory -Path $target | Out-Null
  Get-ChildItem -LiteralPath $source -Force | Where-Object { $_.Name -notin @('Cache','Code Cache','GPUCache','DawnCache','Crashpad','logs','SingletonLock','SingletonCookie','SingletonSocket') } |
    ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $target -Recurse -Force }
  $manifest += [pscustomobject]@{source=$source;destination=$target}
}
$hashes = @(Get-ChildItem -LiteralPath $dest -File -Recurse | ForEach-Object {
  [pscustomobject]@{path=$_.FullName.Substring($dest.Length+1);size=$_.Length;sha256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash}
})
[pscustomobject]@{createdAt=(Get-Date).ToString('o');version=(Get-Content -LiteralPath (Join-Path $ProjectRoot 'VERSION') -Raw).Trim();roots=$manifest;files=$hashes} |
  ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $dest 'manifest.json') -Encoding UTF8
Write-Output "Backup completo e verificavel: $dest"
exit 0
