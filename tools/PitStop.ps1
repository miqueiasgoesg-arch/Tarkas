param(
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
)
$ErrorActionPreference = 'Stop'
$checks = [System.Collections.Generic.List[object]]::new()
function Add-Check([string]$Name,[bool]$Ok,[string]$Detail,[bool]$Required=$true){
  $checks.Add([pscustomobject]@{name=$Name;ok=$Ok;required=$Required;detail=$Detail})
}

$logs = Join-Path $ProjectRoot 'logs'
New-Item -ItemType Directory -Force -Path $logs | Out-Null
Add-Check 'ProjectRoot' (Test-Path $ProjectRoot) $ProjectRoot

$requiredFiles = @(
  'AGENTS.md',
  'docs\PROJECT-STATE.md',
  'docs\ROADMAP.md',
  'docs\CHANGELOG.md',
  'VERSION'
)
foreach($rel in $requiredFiles){
  $p = Join-Path $ProjectRoot $rel
  Add-Check $rel (Test-Path $p) ($(if(Test-Path $p){'OK'}else{'Ausente'}))
}

$pkg = Join-Path $ProjectRoot 'package.json'
if(Test-Path $pkg){
  $node = Get-Command node -ErrorAction SilentlyContinue
  Add-Check 'Node runtime' ($null -ne $node) ($(if($node){$node.Source}else{'node nao encontrado'}))
}

$driveName = (Get-Item $ProjectRoot).PSDrive.Name
$drive = Get-PSDrive -Name $driveName
$freeGb = [math]::Round($drive.Free/1GB,2)
Add-Check 'Espaco minimo' ($freeGb -ge 2) "$freeGb GB livres" $true
Add-Check 'Espaco recomendado' ($freeGb -ge 10) "$freeGb GB livres; recomendado >= 10 GB" $false

$scanExt = @('*.json','*.js','*.cjs','*.mjs','*.ts','*.tsx','*.ps1','*.cmd','*.bat','*.env')
$files = Get-ChildItem $ProjectRoot -Recurse -File -Include $scanExt -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\(node_modules|dist|release|build|\.git|backups)\\' -and $_.FullName -ne (Join-Path $ProjectRoot 'tools\PitStop.ps1') }
$bad = @()
foreach($f in $files){
  $hit = Select-String -Path $f.FullName -Pattern 'MGOES-NOTE' -SimpleMatch -ErrorAction SilentlyContinue
  if($hit){ $bad += $f.FullName }
}
Add-Check 'Sem dependencia do notebook' ($bad.Count -eq 0) ($(if($bad.Count){$bad -join '; '}else{'Nenhuma referencia obrigatoria detectada'}))

$failed = @($checks | Where-Object { $_.required -and -not $_.ok })
$warnings = @($checks | Where-Object { -not $_.required -and -not $_.ok })
$status = if($failed.Count -gt 0){'RED'}elseif($warnings.Count -gt 0){'YELLOW'}else{'GREEN'}
$result = [pscustomobject]@{
  timestamp = (Get-Date).ToString('o')
  projectRoot = $ProjectRoot
  status = $status
  checks = $checks
}
$outFile = Join-Path $logs 'diagnostics-latest.json'
$result | ConvertTo-Json -Depth 6 | Set-Content -Path $outFile -Encoding UTF8

Write-Output "PIT STOP: $status"
foreach($c in $checks){
  $mark = if($c.ok){'[OK]'}elseif($c.required){'[FAIL]'}else{'[WARN]'}
  Write-Output "$mark $($c.name) - $($c.detail)"
}
Write-Output "Relatorio: $outFile"
if($failed.Count -gt 0){ exit 2 }
exit 0
