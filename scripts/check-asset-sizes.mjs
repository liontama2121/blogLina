#!/usr/bin/env node
/**
 * check-asset-sizes.mjs
 * Falla el build si algún archivo en dist/ supera 24 MB (límite Cloudflare Pages: 25 MiB).
 * Se ejecuta después de `astro build`.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const LIMIT = 24 * 1024 * 1024;

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push({ full, size: st.size });
  }
  return acc;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.log('check-asset-sizes: no existe dist/ (omitido).');
  process.exit(0);
}

const offenders = files.filter((f) => f.size > LIMIT);
if (offenders.length) {
  console.error('\n✗ Assets que superan 24 MB (Cloudflare rechaza >25 MiB):');
  for (const f of offenders) {
    console.error(`   ${relative(DIST, f.full)}  ${(f.size / 1048576).toFixed(1)} MB`);
  }
  console.error('Corre `npm run media:optimize` para comprimir/descartar.\n');
  process.exit(1);
}
console.log(`✓ check-asset-sizes: ${files.length} archivos, ninguno >24 MB.`);
