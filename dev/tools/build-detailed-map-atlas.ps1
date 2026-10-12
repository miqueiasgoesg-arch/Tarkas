param(
  [ValidateRange(1,6)] [int] $Zoom = 3
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$target = Join-Path $root 'assets\maps'
$tileCount = [math]::Pow(2, $Zoom)
$tileSize = 256
$canvasSize = $tileCount * $tileSize

# Public cartography supplied by Tarkov.dev.  The ids deliberately match the
# calibration layers used by the tactical-marker renderer.
$maps = @(
  @{ Name = 'GroundZero'; Slug = 'ground-zero'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'groundzero/main_summer' },
    @{ Id = 'Second_Floor'; Path = 'groundzero/2nd' },
    @{ Id = 'Third_Floor'; Path = 'groundzero/3rd' },
    @{ Id = 'Underground_Level'; Path = 'groundzero/garage' }
  )},
  @{ Name = 'Customs'; Slug = 'customs'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'customs_0.16/main' },
    @{ Id = 'Second_Floor'; Path = 'customs_0.16/2nd' },
    @{ Id = 'Third_Floor'; Path = 'customs_0.16/3rd' },
    @{ Id = 'Underground_Level'; Path = 'customs_0.16/underground' }
  )},
  @{ Name = 'Factory'; Slug = 'factory'; Layers = @(
    @{ Id = 'Ground_Floor'; Path = 'factory/main' },
    @{ Id = 'Second_Floor'; Path = 'factory/2nd' },
    @{ Id = 'Third_Floor'; Path = 'factory/3rd' },
    @{ Id = 'Basement'; Path = 'factory/tunnels' }
  )},
  @{ Name = 'Interchange'; Slug = 'interchange'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'interchange/main' }
  )},
  @{ Name = 'Reserve'; Slug = 'reserve'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'reserve/main' },
    @{ Id = 'Bunkers'; Path = 'reserve/bunkers' }
  )},
  @{ Name = 'Shoreline'; Slug = 'shoreline'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'shoreline/main_summer' }
  )},
  @{ Name = 'Woods'; Slug = 'woods'; Layers = @(
    @{ Id = 'Ground_Level'; Path = 'woods/main_0.16' }
  )}
)

function Get-AtlasLayer([hashtable] $map, [hashtable] $layer) {
  $file = "$($map.Name)-$($layer.Id).png"
  $out = Join-Path $target $file
  $canvas = [System.Drawing.Bitmap]::new([int]$canvasSize, [int]$canvasSize)
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $downloaded = 0
  try {
    for ($x = 0; $x -lt $tileCount; $x++) {
      for ($y = 0; $y -lt $tileCount; $y++) {
        $uri = "https://assets.tarkov.dev/maps/$($layer.Path)/$Zoom/$x/$y.png"
        $temp = Join-Path ([System.IO.Path]::GetTempPath()) ("tarkas-map-" + [guid]::NewGuid().ToString() + '.png')
        try {
          Invoke-WebRequest -Uri $uri -OutFile $temp -UseBasicParsing -TimeoutSec 6
          $tile = [System.Drawing.Image]::FromFile($temp)
          $graphics.DrawImage($tile, $x * $tileSize, $y * $tileSize, $tileSize, $tileSize)
          $tile.Dispose()
          $downloaded++
        } catch {
          # Empty/missing outer tiles are transparent and do not invalidate the map.
        } finally {
          if (Test-Path $temp) { Remove-Item -LiteralPath $temp -Force }
        }
      }
    }
    if ($downloaded -eq 0) { throw "Nenhum tile disponível para $($map.Name) / $($layer.Id)" }
    $canvas.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "OK $file ($downloaded tiles)"
    return @{ id = $layer.Id; file = $file; hidden = ($layer.Id -ne $map.Layers[0].Id) }
  } finally {
    $graphics.Dispose()
    $canvas.Dispose()
  }
}

foreach ($map in $maps) {
  $layers = @($map.Layers | ForEach-Object { Get-AtlasLayer $map $_ })
  $manifest = [ordered]@{
    label = "$($map.Name) · planta tática detalhada"
    width = $canvasSize
    height = $canvasSize
    viewBox = "0 0 $canvasSize $canvasSize"
    layers = $layers
  }
  $manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $target "$($map.Name)-reference.json") -Encoding utf8
  Write-Host "Manifesto $($map.Name)-reference.json"
}
