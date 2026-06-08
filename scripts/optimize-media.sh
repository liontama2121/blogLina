#!/usr/bin/env bash
# optimize-media.sh
# Optimiza videos/imágenes en public/media y garantiza que ningún archivo
# supere el límite de Cloudflare Pages (25 MiB). Umbral de seguridad: 24 MiB.
#
# Escalera por video:
#   Paso 1  compresión normal (H.264 1080p ~1.5-2 Mbps, +faststart)  -> ≤24MB? listo
#   Paso 2  re-render dirigido por tamaño (2-pass, bitrate por duración, baja a 720p) -> ≤24MB? listo
#   Paso 3  si aún >24MB: descartar (mover a _descartados/) y registrar
#
# Sin ffmpeg: no comprime, pero igual chequea tamaños y descarta los >24MB.
#
# Uso: bash scripts/optimize-media.sh
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MEDIA="$ROOT/public/media"
DISCARD_DIR="$ROOT/_descartados-media"
LOG="$SCRIPT_DIR/medios-descartados.txt"

VIDEO_DIRS=(tiktok video_entrevista video)
IMAGE_DIRS=(image logos)

LIMIT_BYTES=$((24 * 1024 * 1024))   # 24 MiB umbral de seguridad
TARGET_MB=22                         # objetivo de re-render dirigido

mkdir -p "$DISCARD_DIR"
: > "$LOG"
{
  echo "# Medios descartados por superar 24 MiB (subir a R2 luego)."
  echo "# formato: ruta — duración — tamaño_final"
} >> "$LOG"

HAS_FFMPEG=0
if command -v ffmpeg >/dev/null 2>&1; then HAS_FFMPEG=1; fi

filesize() { stat -c%s "$1" 2>/dev/null || stat -f%z "$1" 2>/dev/null; }
duration() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1" 2>/dev/null | cut -d. -f1; }
human() { awk -v b="$1" 'BEGIN{printf "%.1f MB", b/1048576}'; }

pass1=0; pass2=0; discarded=0; kept_imgs=0; disc_imgs=0

discard_file() {
  local f="$1" rel="$2" dur="${3:-?}"
  local sz; sz=$(filesize "$f")
  mkdir -p "$DISCARD_DIR/$(dirname "$rel")"
  mv "$f" "$DISCARD_DIR/$rel"
  echo "/media/$rel — ${dur}s — $(human "$sz")" >> "$LOG"
  echo "   ✗ DESCARTADO (>24MB): $rel  [$(human "$sz")]"
}

echo "=== optimize-media.sh ==="
[ "$HAS_FFMPEG" -eq 1 ] && echo "ffmpeg: disponible" || echo "ffmpeg: NO disponible (solo chequeo de tamaño)"

# ---------- VIDEOS ----------
for tipo in "${VIDEO_DIRS[@]}"; do
  dir="$MEDIA/$tipo"
  [ -d "$dir" ] || continue
  mkdir -p "$dir/poster"
  shopt -s nullglob
  for f in "$dir"/*.mp4 "$dir"/*.mov "$dir"/*.webm "$dir"/*.m4v; do
    [ -f "$f" ] || continue
    base="$(basename "${f%.*}")"
    rel="$tipo/$(basename "$f")"
    sz=$(filesize "$f")

    if [ "$HAS_FFMPEG" -eq 0 ]; then
      if [ "$sz" -gt "$LIMIT_BYTES" ]; then
        discard_file "$f" "$rel" "?"; discarded=$((discarded+1))
      else
        echo "   • OK (sin comprimir): $rel  [$(human "$sz")]"
        pass1=$((pass1+1))
      fi
      continue
    fi

    # --- con ffmpeg ---
    poster="$dir/poster/$base.jpg"
    [ -f "$poster" ] || ffmpeg -y -ss 00:00:01 -i "$f" -frames:v 1 -q:v 3 "$poster" >/dev/null 2>&1

    tmp="$dir/.opt-$base.mp4"
    # Paso 1: compresión normal
    ffmpeg -y -i "$f" -vf "scale=-2:'min(1080,ih)'" -c:v libx264 -preset slow -b:v 1800k \
      -maxrate 2200k -bufsize 4000k -c:a aac -b:a 128k -movflags +faststart "$tmp" >/dev/null 2>&1
    if [ -f "$tmp" ]; then mv "$tmp" "$f"; sz=$(filesize "$f"); fi

    if [ "$sz" -le "$LIMIT_BYTES" ]; then
      echo "   ✓ paso1: $rel  [$(human "$sz")]"; pass1=$((pass1+1)); continue
    fi

    # Paso 2: re-render dirigido por tamaño (2-pass)
    dur=$(duration "$f"); [ -z "$dur" ] && dur=0
    if [ "$dur" -gt 0 ]; then
      abr=128
      vbr=$(( (TARGET_MB * 8192 / dur) - abr ))
      [ "$vbr" -lt 300 ] && vbr=300
      for h in 1080 720; do
        ffmpeg -y -i "$f" -vf "scale=-2:'min($h,ih)'" -c:v libx264 -preset slow -b:v "${vbr}k" \
          -pass 1 -an -f mp4 /dev/null >/dev/null 2>&1
        ffmpeg -y -i "$f" -vf "scale=-2:'min($h,ih)'" -c:v libx264 -preset slow -b:v "${vbr}k" \
          -pass 2 -c:a aac -b:a "${abr}k" -movflags +faststart "$tmp" >/dev/null 2>&1
        if [ -f "$tmp" ]; then mv "$tmp" "$f"; sz=$(filesize "$f"); fi
        [ "$sz" -le "$LIMIT_BYTES" ] && break
      done
      rm -f "$dir"/ffmpeg2pass-*.log* "$ROOT"/ffmpeg2pass-*.log* 2>/dev/null
    fi

    if [ "$sz" -le "$LIMIT_BYTES" ]; then
      echo "   ✓ paso2 (re-render): $rel  [$(human "$sz")]"; pass2=$((pass2+1))
    else
      discard_file "$f" "$rel" "$dur"; discarded=$((discarded+1))
    fi
  done
  shopt -u nullglob
done

# ---------- IMÁGENES ----------
for tipo in "${IMAGE_DIRS[@]}"; do
  dir="$MEDIA/$tipo"
  [ -d "$dir" ] || continue
  shopt -s nullglob
  for f in "$dir"/*.jpg "$dir"/*.jpeg "$dir"/*.png "$dir"/*.webp; do
    [ -f "$f" ] || continue
    rel="$tipo/$(basename "$f")"
    sz=$(filesize "$f")
    if [ "$HAS_FFMPEG" -eq 1 ] && [ "$sz" -gt "$LIMIT_BYTES" ]; then
      tmp="$dir/.opt-$(basename "$f")"
      ffmpeg -y -i "$f" -vf "scale='min(2000,iw)':-2" -q:v 4 "$tmp" >/dev/null 2>&1
      [ -f "$tmp" ] && mv "$tmp" "$f" && sz=$(filesize "$f")
    fi
    if [ "$sz" -gt "$LIMIT_BYTES" ]; then
      discard_file "$f" "$rel" "img"; disc_imgs=$((disc_imgs+1))
    else
      kept_imgs=$((kept_imgs+1))
    fi
  done
  shopt -u nullglob
done

echo ""
echo "=== Resumen ==="
echo "  Videos paso1 (compresión normal): $pass1"
echo "  Videos paso2 (re-render dirigido): $pass2"
echo "  Videos descartados (>24MB):        $discarded"
echo "  Imágenes conservadas:              $kept_imgs"
echo "  Imágenes descartadas (>24MB):      $disc_imgs"
echo "  Log de descartados: $LOG"
[ "$discarded" -gt 0 ] || [ "$disc_imgs" -gt 0 ] && echo "  (Archivos descartados movidos a $DISCARD_DIR)"
exit 0
