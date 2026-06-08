#!/usr/bin/env node
/**
 * generate-media-manifest.mjs
 * Escanea public/media/{tiktok,video_entrevista,video,image,logos} y genera
 * src/data/media.json. Excluye los archivos listados en medios-descartados.txt
 * y los que no son del tipo esperado (p. ej. un .mp4 dentro de image/).
 *
 * Uso: node scripts/generate-media-manifest.mjs
 */
import { readdirSync, existsSync, statSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, parse, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const MEDIA_DIR = join(ROOT, 'public', 'media');
const OUT = join(ROOT, 'src', 'data', 'media.json');
const DISCARDED_LOG = join(__dirname, 'medios-descartados.txt');

const VIDEO_TYPES = ['tiktok', 'video_entrevista', 'video'];
const IMAGE_TYPES = ['image'];
const LOGO_TYPES = ['logos'];
const ALL_TYPES = [...VIDEO_TYPES, ...IMAGE_TYPES, ...LOGO_TYPES];

const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const POSTER_EXT = ['.jpg', '.jpeg', '.png', '.webp'];

// Ratio por defecto por tipo (sin ffprobe no detectamos dimensiones reales).
const DEFAULT_RATIO = {
  tiktok: '9:16',
  video: '9:16',
  video_entrevista: '9:16',
  image: 'auto',
  logos: 'auto',
};

/** Limpia un nombre de archivo a un título legible (editable luego por Lina). */
function inferTitle(base) {
  // Si parece hash/aleatorio o genérico, mejor dejar vacío.
  const cleaned = base.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const looksGeneric = /^(download|img|image|video|whatsapp|aq[a-z0-9]|[0-9a-f]{12,})/i.test(base);
  if (looksGeneric) return '';
  return cleaned;
}

function loadDiscarded() {
  const set = new Set();
  if (existsSync(DISCARDED_LOG)) {
    const lines = readFileSync(DISCARDED_LOG, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      // formato: ruta — duración — tamaño  (tomamos solo la ruta)
      const ruta = trimmed.split('—')[0].trim();
      if (ruta) set.add(ruta.replace(/\\/g, '/'));
    }
  }
  return set;
}

function findPoster(tipo, base) {
  const posterDir = join(MEDIA_DIR, tipo, 'poster');
  if (!existsSync(posterDir)) return null;
  for (const ext of POSTER_EXT) {
    const p = join(posterDir, base + ext);
    if (existsSync(p)) return `/media/${tipo}/poster/${base}${ext}`;
  }
  return null;
}

/** Busca un poster hermano con el mismo nombre base en la propia carpeta. */
function findSiblingPoster(tipo, dir, base) {
  for (const ext of POSTER_EXT) {
    const p = join(dir, base + ext);
    if (existsSync(p)) return `/media/${tipo}/${base}${ext}`;
  }
  return null;
}

const discarded = loadDiscarded();
const items = [];
let counts = {};

for (const tipo of ALL_TYPES) {
  const dir = join(MEDIA_DIR, tipo);
  counts[tipo] = 0;
  if (!existsSync(dir)) continue;

  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isFile()) continue; // ignora subcarpeta poster/
    const { name: base, ext } = parse(name);
    const e = ext.toLowerCase();
    const rel = `/media/${tipo}/${name}`;

    if (discarded.has(rel)) continue;

    const isVideoType = VIDEO_TYPES.includes(tipo);
    const isImageType = IMAGE_TYPES.includes(tipo) || LOGO_TYPES.includes(tipo);

    if (isVideoType) {
      if (!VIDEO_EXT.has(e)) {
        // p. ej. un poster suelto o imagen — lo ignoramos como item
        continue;
      }
      const poster = findPoster(tipo, base) || findSiblingPoster(tipo, dir, base);
      items.push({
        tipo,
        src: rel,
        poster: poster || '',
        titulo: inferTitle(base),
        ratio: DEFAULT_RATIO[tipo],
      });
      counts[tipo]++;
    } else if (isImageType) {
      if (!IMAGE_EXT.has(e)) continue; // descarta .mp4 dentro de image/
      items.push({
        tipo,
        src: rel,
        poster: '',
        titulo: inferTitle(base),
        ratio: DEFAULT_RATIO[tipo],
      });
      counts[tipo]++;
    }
  }
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(items, null, 2) + '\n', 'utf8');

console.log('✓ Manifiesto generado:', OUT);
for (const tipo of ALL_TYPES) {
  console.log(`  ${tipo.padEnd(16)} ${counts[tipo] ?? 0}`);
}
console.log(`  ${'TOTAL'.padEnd(16)} ${items.length}`);
if (discarded.size) console.log(`  (excluidos por tamaño: ${discarded.size})`);
