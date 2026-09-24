$roots = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -eq 'electron.exe' -and
  $_.CommandLine -like '*Projeto-Tarkas*' -and
  $_.CommandLine -notlike '*--type=*'
}
$roots | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 800
Write-Output ("Tarkas roots encerrados: " + $roots.Count)
