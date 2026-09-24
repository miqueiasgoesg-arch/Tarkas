$ErrorActionPreference='SilentlyContinue'
$pattern='Tarkas|Projeto-Tarkas'
'=== STARTUP ==='
Get-CimInstance Win32_StartupCommand | Where-Object { $_.Command -match $pattern -or $_.Name -match $pattern } | Select-Object Name,Command,Location | Format-List
'=== TASKS ==='
Get-ScheduledTask | Where-Object { $_.TaskName -match $pattern -or (($_.Actions | ForEach-Object {$_.Execute+' '+$_.Arguments}) -join ' ') -match $pattern } | Select-Object TaskName,TaskPath,State | Format-List
'=== SERVICES ==='
Get-CimInstance Win32_Service | Where-Object { $_.Name -match $pattern -or $_.DisplayName -match $pattern -or $_.PathName -match $pattern } | Select-Object Name,State,StartMode,PathName | Format-List
'=== PROCESSES ==='
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match $pattern -or $_.ExecutablePath -match $pattern } | Select-Object ProcessId,Name,CommandLine | Format-List
'=== RUN KEY ==='
$p=Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$p.PSObject.Properties | Where-Object { $_.Name -match $pattern -or [string]$_.Value -match $pattern } | Select-Object Name,Value | Format-List
'=== STARTUP FOLDER ==='
Get-ChildItem ([Environment]::GetFolderPath('Startup')) | Where-Object {$_.Name -match $pattern} | Select-Object FullName
