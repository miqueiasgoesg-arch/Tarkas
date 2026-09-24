$p = Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'electron.exe' -and $_.CommandLine -like '*Projeto-Tarkas*' -and $_.CommandLine -notlike '*--type=*' }
Write-Output ("TARKAS_ROOTS=" + $p.Count)
$p | ForEach-Object { Write-Output ($_.ProcessId.ToString() + " " + $_.CommandLine) }
