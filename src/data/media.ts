import media from './media.json';
import { DESTACADAS, MEDIOS, ARTISTAS } from './site';

export type MediaItem = { tipo: string; src: string; poster: string; titulo: string; ratio: string };

const items = media as MediaItem[];

/** Codifica una ruta pública (espacios, #, acentos) sin tocar las ya codificadas. */
export const url = (p: string) => (/%[0-9A-F]{2}/i.test(p) ? p : p.split('/').map(encodeURIComponent).join('/'));

const decoded = (s: string) => {
  try { return decodeURIComponent(s); } catch { return s; }
};

export const byTipo = (tipo: string) => items.filter((m) => m.tipo === tipo);

/** Título legible: quita hashtags, emojis y espacios repetidos. */
export function cleanTitle(t: string) {
  return t
    .replace(/#\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Entrevistas destacadas en el orden de DESTACADAS, con su índice de i18n. */
export function destacadas() {
  const pool = byTipo('video_entrevista');
  return DESTACADAS.flatMap((frag, i) => {
    const it = pool.find((m) => decoded(m.src).includes(frag));
    return it ? [{ ...it, i18nIndex: i }] : [];
  });
}

/** Entrevistas no destacadas (para completar grillas sin repetir). */
export function restoEntrevistas() {
  const used = new Set(destacadas().map((d) => d.src));
  return byTipo('video_entrevista').filter((m) => !used.has(m.src));
}

/** Medios (site.ts MEDIOS) con su logo resuelto desde logos/ (por nombre; fallback por orden). */
export function mediosConLogo() {
  const logos = byTipo('logos');
  const has = (l: MediaItem, frags: readonly string[]) =>
    frags.some((f) => decoded(l.src).toLowerCase().includes(f.toLowerCase()));
  const otros = logos.filter((l) => !/rtvc/i.test(decoded(l.src)));
  let idx = 0;
  return MEDIOS.map((m) => {
    const isRtvc = /rtvc/i.test(m.nombre);
    const found = logos.find((l) => has(l, isRtvc ? ['rtvc'] : m.match));
    const logo = found ?? (isRtvc ? undefined : otros[idx++]);
    return {
      nombre: m.nombre,
      url: m.url,
      placeholder: 'placeholder' in m ? Boolean(m.placeholder) : false,
      logoSrc: logo ? url(logo.src) : undefined,
    };
  });
}

/** Fotos de ARTISTAS en su orden. */
export function fotosArtistas() {
  const pool = byTipo('image');
  return ARTISTAS.flatMap((frag) => pool.filter((m) => decoded(m.src).includes(frag)).slice(0, 1));
}
