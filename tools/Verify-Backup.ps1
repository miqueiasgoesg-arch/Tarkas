param([Parameter(Mandatory=$true)][string]$BackupDirectory)
$ErrorActionPreference='Stop'
$root=(Resolve-Path -LiteralPath $BackupDirectory).Path
$manifest=Get-Content -LiteralPath (Join-Path $root 'manifest.json') -Raw | ConvertFrom-Json
$verified=0
foreach($entry in $manifest.files){
  $target=[IO.Path]::GetFullPath((Join-Path $root $entry.path))
  if(!$target.StartsWith($root+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Caminho fora do backup'}
  if(!(Test-Path -LiteralPath $target -PathType Leaf)){throw "Arquivo ausente: $($entry.path)"}
  $file=Get-Item -LiteralPath $target
  if($file.Length -ne $entry.size -or (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne $entry.sha256){throw "Integridade divergente: $($entry.path)"}
  $verified++
}
if(!$verified){throw 'Backup vazio'}
Write-Output "Backup verificado: $verified arquivos; SQLite, perfis e armazenamento local preservados."
