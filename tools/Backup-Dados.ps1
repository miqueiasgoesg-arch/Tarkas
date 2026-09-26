param(
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $ProjectRoot 'backups'
$dest = Join-Path $backupRoot $stamp
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$items = @('data','config\settings.json','VERSION')
$copied = 0
foreach($rel in $items){
  $src = Join-Path $ProjectRoot $rel
  if(Test-Path $src){
    $target = Join-Path $dest $rel
    $parent = Split-Path $target -Parent
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    Copy-Item $src $target -Recurse -Force
    $copied++
  }
}

if($copied -eq 0){
  Remove-Item $dest -Recurse -Force
  Write-Output 'Nenhum dado/configuracao encontrado para backup.'
  exit 1
}
Write-Output "Backup criado: $dest"
exit 0
