#!/bin/bash
# ============================================================
#  BUJUTSU — Generador de galería (Mac)
#
#  QUÉ HACE:
#   1) Toma tus fotos organizadas por categoría.
#   2) Las optimiza (convierte a JPG y reduce a 1600px de ancho).
#   3) Las copia a assets/img/gallery/ con nombres limpios.
#   4) Genera automáticamente js/gallery-data.js con sus tags.
#
#  CÓMO USARLO:
#   1) Junto a este archivo crea una carpeta llamada  fotos-galeria
#   2) Dentro, una subcarpeta por categoria (el nombre = el tag). Ej:
#        fotos-galeria/BJJ/
#        fotos-galeria/Muay Thai/
#        fotos-galeria/MMA/
#        fotos-galeria/Ninos/
#        fotos-galeria/Eventos/
#      y mete las fotos (jpg, png o heic) en cada una.
#   3) Doble clic en este archivo (la 1a vez: clic derecho > Abrir).
# ============================================================

cd "$(dirname "$0")"
SRC="fotos-galeria"
OUT="assets/img/gallery"
DATA="js/gallery-data.js"
MAXW=1600

if [ ! -d "$SRC" ]; then
  echo "No encontre la carpeta '$SRC'."
  echo "Crea una carpeta llamada  fotos-galeria  junto a este script,"
  echo "con subcarpetas por categoria (BJJ, Muay Thai, Eventos, ...) y las fotos dentro."
  read -p "Enter para salir"; exit 1
fi

mkdir -p "$OUT"

# limpiar solo las fotos generadas antes (deja intactas las demas del sitio)
rm -f "$OUT"/*.jpg 2>/dev/null

{
  echo "/* Generado por generar-galeria.command — no editar a mano. */"
  echo "const PHOTOS = ["
} > "$DATA"

slug() {
  echo "$1" | tr '[:upper:]' '[:lower:]' \
    | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null \
    | tr -cs 'a-z0-9' '-' | sed 's/^-*//; s/-*$//'
}

total=0
for dir in "$SRC"/*/ ; do
  [ -d "$dir" ] || continue
  tag=$(basename "$dir")
  s=$(slug "$tag")
  n=0
  for img in "$dir"*.jpg "$dir"*.jpeg "$dir"*.png "$dir"*.JPG "$dir"*.JPEG "$dir"*.PNG "$dir"*.heic "$dir"*.HEIC; do
    [ -e "$img" ] || continue
    n=$((n+1)); total=$((total+1))
    dest="$OUT/${s}-${n}.jpg"
    # convertir a JPG y redimensionar con sips (incluido en macOS; convierte HEIC)
    sips -s format jpeg "$img" --out "$dest" >/dev/null 2>&1 || cp "$img" "$dest"
    sips -Z $MAXW "$dest" >/dev/null 2>&1
    echo "  { src: \"assets/img/gallery/${s}-${n}.jpg\", tags: [\"${tag}\"], alt: \"${tag} ${n}\" }," >> "$DATA"
    echo "  + ${s}-${n}.jpg"
  done
done

echo "];" >> "$DATA"

echo ""
echo "======================================================"
echo "  Listo: $total fotos procesadas."
echo "  Datos generados en: $DATA"
echo "  Fotos copiadas en:  $OUT"
echo "  Abre galeria.html para verlas. Luego sube los cambios."
echo "======================================================"
read -p "Enter para salir"
