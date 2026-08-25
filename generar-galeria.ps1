# ============================================================
#  BUJUTSU - Generador de galeria (Windows / PowerShell)
#  Renombra + optimiza (max 1600px) + genera js/gallery-data.js
#  No se ejecuta directo: usa  generar-galeria-windows.bat  (doble clic).
# ============================================================
$ErrorActionPreference = 'Continue'
Set-Location -Path $PSScriptRoot

$src  = 'fotos-galeria'
$out  = 'assets/img/gallery'
$data = 'js/gallery-data.js'
$maxw = 1600

if (-not (Test-Path $src)) {
  Write-Host ""
  Write-Host "No encontre la carpeta 'fotos-galeria'." -ForegroundColor Yellow
  Write-Host "Crea una carpeta llamada  fotos-galeria  junto a este script,"
  Write-Host "con una subcarpeta por categoria (BJJ, Muay Thai, Eventos, ...) y las fotos dentro."
  Read-Host "Enter para salir"; exit
}

New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem -Path (Join-Path $out '*.jpg') -ErrorAction SilentlyContinue | Remove-Item -Force

Add-Type -AssemblyName System.Drawing

function Slug([string]$s) {
  $s = $s.ToLower()
  $map = @{ 'á'='a';'à'='a';'ä'='a';'â'='a';'é'='e';'è'='e';'ë'='e';'í'='i';'ì'='i';'ï'='i';
            'ó'='o';'ò'='o';'ö'='o';'ú'='u';'ù'='u';'ü'='u';'ñ'='n' }
  foreach ($k in $map.Keys) { $s = $s -replace $k, $map[$k] }
  $s = $s -replace '[^a-z0-9]+','-'
  return $s.Trim('-')
}

function Save-Resized($inPath, $outPath, $maxw) {
  try {
    $img = [System.Drawing.Image]::FromFile($inPath)
    $w = $img.Width; $h = $img.Height
    if ($w -gt $maxw) { $nw = $maxw; $nh = [int]($h * $maxw / $w) } else { $nw = $w; $nh = $h }
    $bmp = New-Object System.Drawing.Bitmap $nw, $nh
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $g.Dispose(); $bmp.Dispose(); $img.Dispose()
    return $true
  } catch { return $false }
}

$lines = @()
$lines += "/* Generado por generar-galeria (Windows). No editar a mano. */"
$lines += "const PHOTOS = ["

$total = 0; $skipped = 0
foreach ($dir in Get-ChildItem -Path $src -Directory) {
  $tag = $dir.Name
  $s = Slug $tag
  $n = 0
  $files = Get-ChildItem -LiteralPath $dir.FullName -File |
           Where-Object { $_.Extension -match '(?i)\.(jpg|jpeg|png|heic)$' } |
           Sort-Object Name
  foreach ($f in $files) {
    $n++
    $dest = Join-Path $out "$s-$n.jpg"
    $ok = Save-Resized $f.FullName $dest $maxw
    if (-not $ok) {
      Write-Host ("  ! No pude convertir: " + $f.Name + " (si es HEIC, exportala como JPG)") -ForegroundColor Yellow
      $skipped++; $n--; continue
    }
    $lines += "  { src: ""assets/img/gallery/$s-$n.jpg"", tags: [""$tag""], alt: ""$tag $n"" },"
    $total++
    Write-Host ("  + $s-$n.jpg")
  }
}
$lines += "];"
$lines -join "`n" | Set-Content -Encoding UTF8 -Path $data

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host ("  Listo: $total fotos procesadas. Omitidas: $skipped")
Write-Host "  Datos generados en: $data"
Write-Host "  Fotos copiadas en:  $out"
Write-Host "  Abre galeria.html para verlas. Luego sube los cambios."
Write-Host "======================================================" -ForegroundColor Green
Read-Host "Enter para salir"
