$me=$PID
$targets=Get-CimInstance Win32_Process | Where-Object { $_.ProcessId -ne $me -and ($_.CommandLine -match 'D:\\DESENVOLVIMENTO\\Projeto-Tarkas' -or $_.ExecutablePath -match 'D:\\DESENVOLVIMENTO\\Projeto-Tarkas') }
$targets | Sort-Object ProcessId -Descending | ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction Stop; "STOPPED $($_.ProcessId) $($_.Name)" } catch {} }
