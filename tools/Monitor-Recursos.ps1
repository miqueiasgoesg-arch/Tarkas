param(
  [string]$ProjectRoot = (Split-Path $PSScriptRoot -Parent),
  [int]$PromptTokens = 0,
  [int]$CompletionTokens = 0
)
$logs = Join-Path $ProjectRoot 'logs'
New-Item -ItemType Directory -Force -Path $logs | Out-Null
$os = Get-CimInstance Win32_OperatingSystem
$cpu = Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average
$driveName = (Get-Item $ProjectRoot).PSDrive.Name
$drive = Get-PSDrive -Name $driveName
$usedRam = [math]::Round(($os.TotalVisibleMemorySize-$os.FreePhysicalMemory)/1MB,2)
$totalRam = [math]::Round($os.TotalVisibleMemorySize/1MB,2)
$row = [pscustomobject]@{
  timestamp=(Get-Date).ToString('o')
  cpuPercent=[math]::Round($cpu.Average,1)
  ramUsedGB=$usedRam
  ramTotalGB=$totalRam
  diskFreeGB=[math]::Round($drive.Free/1GB,2)
  promptTokens=$PromptTokens
  completionTokens=$CompletionTokens
  totalTokens=($PromptTokens+$CompletionTokens)
}
$line = $row | ConvertTo-Json -Compress
Add-Content -Path (Join-Path $logs 'usage.jsonl') -Value $line -Encoding UTF8
$row | Format-List
