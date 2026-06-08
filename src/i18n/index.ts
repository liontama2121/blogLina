import es from './es.json';
import en from './en.json';

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];
export const DEFAULT_LANG: Lang = 'es';

const dict = { es, en } as const;

/** Diccionario completo de un idioma (para inyectar al cliente). */
export function getDict(lang: Lang) {
  return dict[lang] ?? dict[DEFAULT_LANG];
}

/** Acceso por ruta de puntos: t(es, 'hero.role'). */
export function t(lang: Lang, path: string): string {
  const obj: any = getDict(lang);
  const val = path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
  return typeof val === 'string' ? val : path;
}

/** Ambos diccionarios serializados (para el switch de idioma en cliente). */
export const ALL_DICTS = { es, en };
