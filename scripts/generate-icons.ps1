Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

function ColorFromHex($hex, $alpha = 255) {
  $clean = $hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b)
}

function New-RoundedPath($x, $y, $w, $h, $r) {
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-IconBitmap($transparent = $false) {
  if ($transparent) {
    $bitmap = [System.Drawing.Bitmap]::new(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  } else {
    $bitmap = [System.Drawing.Bitmap]::new(512, 512, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  }

  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  return @($bitmap, $graphics)
}

function Draw-Mark($graphics, $includeBackground, $roundBackground) {
  $darkTop = ColorFromHex "#20362b"
  $darkBottom = ColorFromHex "#090d0b"
  $ink = ColorFromHex "#19211d"
  $cream = ColorFromHex "#fbfaf6" 245
  $gold = ColorFromHex "#d99d2b"
  $lightGold = ColorFromHex "#f5d27a"

  if ($includeBackground) {
    $rect = [System.Drawing.Rectangle]::new(0, 0, 512, 512)
    $bgBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($rect, $darkTop, $darkBottom, 135)
    if ($roundBackground) {
      $bgPath = New-RoundedPath 0 0 512 512 112
      $graphics.FillPath($bgBrush, $bgPath)
      $bgPath.Dispose()
    } else {
      $graphics.FillRectangle($bgBrush, $rect)
    }
    $bgBrush.Dispose()
  }

  $plateBrush = [System.Drawing.SolidBrush]::new($cream)
  $graphics.FillEllipse($plateBrush, 98, 98, 316, 316)
  $plateBrush.Dispose()

  $ringPen = [System.Drawing.Pen]::new($gold, 18)
  $graphics.DrawEllipse($ringPen, 128, 128, 256, 256)
  $ringPen.Dispose()

  $stickPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(215, $gold), 14)
  $stickPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $stickPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($stickPen, 132, 118, 388, 374)
  $stickPen.Dispose()

  $stickPen2 = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(198, $lightGold), 8)
  $stickPen2.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $stickPen2.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $graphics.DrawLine($stickPen2, 154, 96, 410, 352)
  $stickPen2.Dispose()

  $inkBrush = [System.Drawing.SolidBrush]::new($ink)
  foreach ($y in @(158, 217)) {
    foreach ($x in @(176, 235, 294)) {
      $cell = New-RoundedPath $x $y 42 42 10
      $graphics.FillPath($inkBrush, $cell)
      $cell.Dispose()
    }
  }

  $fontFamily = [System.Drawing.FontFamily]::new("Arial")
  $font = [System.Drawing.Font]::new($fontFamily, 60, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString("MM", $font, $inkBrush, [System.Drawing.RectangleF]::new(151, 274, 210, 86), $format)
  $format.Dispose()
  $font.Dispose()
  $fontFamily.Dispose()
  $inkBrush.Dispose()
}

function Resize-Save($source, $width, $height, $path, $transparent = $false) {
  if ($transparent) {
    $dest = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  } else {
    $dest = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  }

  $graphics = [System.Drawing.Graphics]::FromImage($dest)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($source, 0, 0, $width, $height)
  $dest.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $dest.Dispose()
}

$assetDir = Join-Path $root "assets"
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

$full = New-IconBitmap $false
Draw-Mark $full[1] $true $false
$full[0].Save((Join-Path $assetDir "app-icon-playstore.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$rounded = New-IconBitmap $false
Draw-Mark $rounded[1] $true $true
$rounded[0].Save((Join-Path $assetDir "app-icon-launcher-preview.png"), [System.Drawing.Imaging.ImageFormat]::Png)

$round = New-IconBitmap $true
$roundBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new([System.Drawing.Rectangle]::new(0, 0, 512, 512), (ColorFromHex "#20362b"), (ColorFromHex "#090d0b"), 135)
$round[1].FillEllipse($roundBrush, 0, 0, 512, 512)
$roundBrush.Dispose()
Draw-Mark $round[1] $false $false

$foreground = New-IconBitmap $true
Draw-Mark $foreground[1] $false $false

$densities = @{
  "mipmap-mdpi" = @{ legacy = 48; foreground = 108 }
  "mipmap-hdpi" = @{ legacy = 72; foreground = 162 }
  "mipmap-xhdpi" = @{ legacy = 96; foreground = 216 }
  "mipmap-xxhdpi" = @{ legacy = 144; foreground = 324 }
  "mipmap-xxxhdpi" = @{ legacy = 192; foreground = 432 }
}

foreach ($density in $densities.Keys) {
  $dir = Join-Path $root "android/app/src/main/res/$density"
  Resize-Save $rounded[0] $densities[$density].legacy $densities[$density].legacy (Join-Path $dir "ic_launcher.png") $false
  Resize-Save $round[0] $densities[$density].legacy $densities[$density].legacy (Join-Path $dir "ic_launcher_round.png") $true
  Resize-Save $foreground[0] $densities[$density].foreground $densities[$density].foreground (Join-Path $dir "ic_launcher_foreground.png") $true
}

$full[1].Dispose()
$full[0].Dispose()
$rounded[1].Dispose()
$rounded[0].Dispose()
$round[1].Dispose()
$round[0].Dispose()
$foreground[1].Dispose()
$foreground[0].Dispose()
