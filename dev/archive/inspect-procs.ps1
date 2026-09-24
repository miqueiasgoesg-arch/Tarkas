Get-CimInstance Win32_Process |
  Where-Object { $_.Name -eq 'electron.exe' -and $_.CommandLine -like '*Projeto-Tarkas*' } |
  Select-Object ProcessId, ParentProcessId, CommandLine |
  Format-List
