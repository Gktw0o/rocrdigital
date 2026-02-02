Add-Type -AssemblyName System.Drawing

function Create-IconPng {
    param([int]$size, [string]$path)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::FromArgb(0, 183, 255))
    $fontSize = [Math]::Floor($size * 0.55)
    $font = New-Object System.Drawing.Font('Arial', $fontSize, [System.Drawing.FontStyle]::Bold)
    $brush = [System.Drawing.Brushes]::White
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $size, $size)
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $g.DrawString('R', $font, $brush, $rect, $sf)
    $g.Dispose()
    $font.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$iconsDir = Join-Path $PSScriptRoot 'icons'
if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

Create-IconPng -size 32 -path (Join-Path $iconsDir '32x32.png')
Create-IconPng -size 128 -path (Join-Path $iconsDir '128x128.png')
Create-IconPng -size 256 -path (Join-Path $iconsDir '128x128@2x.png')
Create-IconPng -size 256 -path (Join-Path $iconsDir 'icon.png')

# Create .ico from the 256px PNG
$bmp256 = New-Object System.Drawing.Bitmap((Join-Path $iconsDir 'icon.png'))
$hIcon = $bmp256.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$fs = [System.IO.File]::Create((Join-Path $iconsDir 'icon.ico'))
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmp256.Dispose()

# Create a dummy .icns (macOS) - just copy the PNG as placeholder
Copy-Item (Join-Path $iconsDir 'icon.png') (Join-Path $iconsDir 'icon.icns')

Write-Host 'All icons generated successfully'
