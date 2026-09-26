param(
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent)
)
$pit = Join-Path $PSScriptRoot 'PitStop.ps1'
if(!(Test-Path $pit)){
  Write-Output 'SINAL VERMELHO: PitStop.ps1 ausente.'
  exit 2
}

& powershell -NoProfile -ExecutionPolicy Bypass -File $pit -ProjectRoot $ProjectRoot
$code = $LASTEXITCODE
if($code -ne 0){
  Write-Output ''
  Write-Output 'SINAL VERMELHO: corrija os itens FAIL antes da release.'
  exit $code
}

$status='GREEN'
$diag=Join-Path $ProjectRoot 'logs\diagnostics-latest.json'
if(Test-Path $diag){ try { $status=(Get-Content $diag -Raw | ConvertFrom-Json).status } catch {} }
Write-Output ''
if($status -eq 'YELLOW'){
  Write-Output 'SINAL VERDE COM ATENCAO: checks obrigatorios passaram, mas existem avisos.'
}else{
  Write-Output 'SINAL VERDE: verificacoes obrigatorias aprovadas.'
}
exit 0
