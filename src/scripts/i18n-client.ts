/** Toggle ES/EN en cliente: intercambia textos [data-i18n], persiste en localStorage. */
type Dict = Record<string, any>;

function getByPath(obj: Dict, path: string): unknown {
  return path.split('.').reduce<any>((acc, k) => (acc == null ? acc : acc[k]), obj);
}

function applyLang(dicts: Record<string, Dict>, lang: string) {
  const d = dicts[lang] ?? dicts.es;
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const path = el.dataset.i18n!;
    const val = getByPath(d, path);
    if (typeof val === 'string') el.textContent = val;
  });

  // Atributos traducibles: data-i18n-attr="aria-label:reel.play"
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr!.split(';').forEach((pair) => {
      const [attr, path] = pair.split(':');
      if (!attr || !path) return;
      const val = getByPath(d, path.trim());
      if (typeof val === 'string') el.setAttribute(attr.trim(), val);
    });
  });

  // Estado visual del toggle
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((btn) => {
    const active = btn.dataset.langBtn === lang;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('lang-active', active);
  });
}

export function initI18n() {
  const dataEl = document.getElementById('i18n-data');
  if (!dataEl) return;
  let dicts: Record<string, Dict>;
  try {
    dicts = JSON.parse(dataEl.textContent || '{}');
  } catch {
    return;
  }

  let current = 'es';
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'es' || saved === 'en') current = saved;
  } catch {}

  // Aplica si difiere del render por defecto (es).
  if (current !== 'es') applyLang(dicts, current);
  // Marca el botón activo aunque sea ES.
  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((btn) => {
    const active = btn.dataset.langBtn === current;
    btn.setAttribute('aria-pressed', String(active));
    btn.classList.toggle('lang-active', active);
  });

  document.querySelectorAll<HTMLElement>('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn!;
      current = lang;
      try {
        localStorage.setItem('lang', lang);
      } catch {}
      applyLang(dicts, lang);
    });
  });
}
