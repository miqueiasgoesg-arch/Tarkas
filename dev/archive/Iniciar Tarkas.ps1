$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
$electron = Join-Path $PSScriptRoot 'node_modules\electron\dist\electron.exe'
if (-not (Test-Path $electron)) { & npm install; if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar dependencias.' } }
Start-Process -FilePath $electron -ArgumentList '.' -WorkingDirectory $PSScriptRoot
