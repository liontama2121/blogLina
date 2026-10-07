# CLAUDE.md — Portafolio web de Lina Marcela Pérez

Portafolio premium one-page (secciones ancladas) para **Lina Marcela Pérez Villegas**,
periodista digital de entretenimiento y creadora de contenido. Doble objetivo: empleo en
medios + cierre de trabajos con marcas.

---

## Stack

- **Astro 6** (sitio estático) + **Tailwind v4** (vía PostCSS) + **Anime.js v4** (animaciones).
- **i18n** ES/EN propio (JSON + toggle cliente con `localStorage`).
- Deploy: **Cloudflare Pages** (build `npm run build`, salida `dist/`, sin adapter SSR).

> Tailwind v4 se carga con `@tailwindcss/postcss` (ver `postcss.config.mjs`), **no** con el
> plugin de Vite: el `@tailwindcss/vite` actual es incompatible con el rolldown-vite de Astro 6.

---

## Comandos

```bash
npm run dev              # servidor local (http://localhost:4321)
npm run build            # manifest → astro build → check de tamaños (<24MB)
npm run preview          # sirve dist/ localmente
npm run media:optimize   # comprime/poster (si hay ffmpeg) + descarta >24MB
npm run media:manifest   # regenera src/data/media.json
```

### Orden correcto al actualizar medios
1. `npm run media:optimize`  → comprime, genera posters y **descarta los >24 MB** (deja `scripts/medios-descartados.txt`).
2. `npm run media:manifest`  → genera `src/data/media.json` solo con lo que sobrevivió.
3. `npm run build`           → falla si algún asset en `dist/` supera 24 MB.

`npm run build` ya ejecuta los pasos 2 y 3 (no el 1: la optimización es manual porque
requiere ffmpeg y puede tardar).

---

## Estructura

```
blogLina/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── media/
│       ├── tiktok/            # reels TikTok (moda, lifestyle, hauls, GRWM) 9:16
│       ├── video_entrevista/  # entrevistas en set/streaming
│       ├── video/             # trabajo de campo (conciertos, alfombras) — VACÍA por ahora
│       ├── image/             # fotos con artistas / retratos
│       ├── logos/             # logos de medios (La FM, La Mega, RCN, RTVC)
│       └── <tipo>/poster/     # posters (primer frame) generados por ffmpeg
├── scripts/
│   ├── generate-media-manifest.mjs   # escanea public/media → src/data/media.json
│   ├── optimize-media.sh             # comprime + descarta >24MB
│   ├── check-asset-sizes.mjs         # guard de build (<24MB)
│   └── medios-descartados.txt        # log de videos excluidos por tamaño (subir a R2)
├── src/
│   ├── components/   # ReelCard, MediaGrid, PhotoGallery, MediaLogoCard,
│   │                 # SectionTitle, PageMasthead, ContactClose, InterviewPlayer, WhatsAppFloat,
│   │                 # LangToggle, SocialLinks, Header, Footer
│   ├── data/         # site.ts (constantes), media.ts (helpers) + media.json (generado)
│   ├── i18n/         # es.json, en.json, index.ts
│   ├── layouts/      # BaseLayout.astro (head, SEO, fonts, scripts cliente)
│   ├── pages/        # multi-página: index, quien-soy, por-que-contratarme,
│   │                 #              entrevistas, logros, estadisticas
│   ├── scripts/      # reveal.ts, reel.ts, player.ts, i18n-client.ts (cliente)
│   └── styles/       # global.css (tokens + utilidades)
├── _descartados-media/   # videos >24MB movidos aquí (NO se despliegan)
├── astro.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## Diseño (tabloide editorial, solo rosa + blanco hueso)

Definido en `src/styles/global.css` como `@theme` → utilidades Tailwind (`bg-rosa`, `text-rosa-ink`, etc.).
**Solo dos familias de color**: rosa (de pastel a tinta profunda) y blanco hueso. El texto oscuro
(`tinta`) es el rosa más oscuro. No introducir otros tonos.

| Token | Hex | Uso |
|---|---|---|
| `hueso` / `hueso-2` | `#F5EFE6` / `#EBE3D6` | fondo base / bloques |
| `rosa-soft` / `rosa` / `rosa-deep` | `#FAE3E9` / `#F4C3D0` / `#E896AE` | campos rosa |
| `rosa-ink` | `#8E2C4D` | acentos, links (AA) |
| `tinta` / `tinta-suave` | `#2C1219` / `#5E4148` | texto, botón primario, banda de números |

- Tipografía: **Bricolage Grotesque** condensada (eje `wdth` 75, mayúsculas) para títulos
  (`.display-mega/xl/lg/md`) + **Hanken Grotesk** para cuerpo.
- **Duotono**: envolver fotos/videos en `.duo` → se ven en rosa y recuperan color al hover
  (videos: al reproducir, clase `.playing`). Así cualquier foto respeta la paleta.
- Firmas: polaroids (`.polaroid`, var `--rot`), reproductor de entrevistas (`InterviewPlayer` +
  `scripts/player.ts`), credencial de prensa en el cierre (`ContactClose`), índice tipográfico,
  una sola marquesina de logos.
- Clases de componente en `@layer components` (si salen de ahí pisan utilidades como `hidden`).
- Forma: bloques y medios rectos; botones y chips en pill.
- Entrevistas destacadas: `DESTACADAS` en `site.ts` + títulos en `destacadas.items` (i18n).
  Fotos: `PHOTOS` y `ARTISTAS` en `site.ts`. Helpers de medios: `src/data/media.ts`.

---

## i18n (ES/EN)

- Strings en `src/i18n/es.json` y `en.json`. ES es el idioma por defecto (se renderiza en HTML).
- En el HTML, cada texto traducible lleva `data-i18n="ruta.de.clave"`.
- `src/scripts/i18n-client.ts` intercambia los textos al togglear y persiste en `localStorage`.
- Atributos traducibles: `data-i18n-attr="aria-label:reel.play"`.
- **Para agregar/editar textos:** edita ambos JSON con la misma estructura de claves.

---

## Cómo agregar nuevos videos / fotos

1. Copia los archivos a la carpeta correcta dentro de `public/media/`
   (`tiktok`, `video_entrevista`, `video`, `image`, `logos`).
   **Nombres solo ASCII** (letras, números, `-`, `_`, espacios): sin tildes, emojis ni `#`.
   Con esos caracteres `astro preview` (y a veces Cloudflare) responde 404 y el video no carga.
2. `npm run media:optimize` (comprime y genera posters si tienes ffmpeg; descarta >24 MB).
3. `npm run media:manifest` (o simplemente `npm run build`).
4. Edita `titulo` en `src/data/media.json` si quieres títulos bonitos (por defecto se infiere
   del nombre, o queda vacío para nombres tipo hash).

> **ffmpeg:** instálalo para comprimir videos y generar posters (`winget install Gyan.FFmpeg`
> o `choco install ffmpeg`). Sin ffmpeg, el script no comprime pero **igual descarta los >24 MB**.

---

## Reglas de tamaño (Cloudflare Pages)

- Límite duro de Cloudflare Pages: **25 MiB por archivo**. Umbral de seguridad: **24 MiB**.
- `optimize-media.sh` aplica escalera: compresión normal → re-render dirigido (2-pass, baja a
  720p) → si aún >24 MB, **descarta** y registra en `scripts/medios-descartados.txt`.
- `check-asset-sizes.mjs` corre tras el build y **falla** si algún archivo en `dist/` supera 24 MB.

### Videos descartados actualmente (sin ffmpeg, eran >24 MB)
Movidos a `_descartados-media/` y listados en `scripts/medios-descartados.txt`:
- `tiktok/Download (12).mp4` (43 MB), `tiktok/Download.mp4` (24.3 MB)
- `video_entrevista/#PaisDeLaBellezaXRTVC ...` (31.7 MB)
- `video_entrevista/#PaísDeLaBellezaXRTVC ... Rodadero ...` (35.9 MB)
- `video_entrevista/Rojo Carmesí- Juan Guile ...` (30.5 MB)
- `video_entrevista/🎤🐝 ...A La Mosca...` (26.4 MB)

> Para recuperarlos: instala ffmpeg y vuelve a correr `npm run media:optimize` (los comprimirá
> y, si quedan ≤24 MB, los reincorporará desde `_descartados-media/` manualmente — muévelos de
> vuelta a `public/media/<tipo>/` antes de optimizar). O súbelos a R2 (ver más abajo).

---

## Deploy en Cloudflare Pages

- **Git:** conecta el repo en el dashboard. Build command `npm run build`, output dir `dist`,
  framework preset **Astro**.
- **Manual:** `npx wrangler pages deploy dist`.

### Fallback R2 para videos pesados (no implementado aún)
Los videos descartados pueden subirse a un bucket **R2 público** y referenciarse en el manifiesto
poniendo `src` con la URL de R2 en vez de `/media/...`. Pasos cuando tengas el bucket:
1. `npx wrangler r2 bucket create <nombre>` y hazlo público (custom domain o r2.dev).
2. Sube los archivos de `_descartados-media/`.
3. En `generate-media-manifest.mjs` añade un mapa nombre→URL R2 y emite esos items con `src` remoto.

> No implementar hasta tener el nombre del bucket.

---

## PLACEHOLDERS pendientes (reemplazar)

Ubicados en `src/data/site.ts` salvo indicación:

- **Email** de Lina → `SITE.email` (hoy `hola@linamarcelaperez.com`).
- **Media kit / CV (PDF)** → pon el PDF en `public/` y ajusta `SITE.mediaKitUrl`.
- **Imagen OG** → pon `public/og-cover.jpg` (1200×630) o cambia `SITE.ogImage`.
- **Fotos de portada** → `PHOTOS` en `src/data/site.ts` (póster del video hero, retrato, set, etc.).
- **URL de RTVC** → `MEDIOS` en `site.ts` (`url: '#'`, `placeholder: true`).
- **Mapeo logo↔medio** → en `logos/` los 3 archivos `image*.png` se asignan **por orden** a
  La FM / La Mega / RCN. Verifica que cada logo corresponde a su medio; si no, renombra los
  archivos (ej. `lafm.png`, `lamega.png`, `rcn.png`) — el script casa por nombre.
- **Estadísticas** → `STATS` en `src/data/site.ts`. Reales: TikTok 5.3K seguidores, 145K likes.
  Vacíos (vistas, engagement, IG, audiencia) se muestran como "En actualización"; complétalos ahí.
- **TikTok** → cuenta confirmada `@linamarcelavi` (`SITE.tiktokUrl` + `STATS.tiktok.handle`).
- **Dominio** → `site` en `astro.config.mjs` y la URL del sitemap en `robots.txt`.
- **Programa en vivo "XYZ"** → confirmar nombre real (aparece en `i18n/*.json`, clave `periodista.text`).

---

## Datos de referencia (fijos)

- Lina Marcela Pérez (Villegas) · Periodista digital de entretenimiento · Creadora de contenido · Inglés C1
- Medios: RCN Radio, La FM, La Mega · programa en vivo XYZ
- Instagram **@linamarcelapv** · TikTok **linasmemories_** · WhatsApp **+57 316 0996970**
- WhatsApp flotante y CTAs → `https://wa.me/573160996970`
- Footer: "Hecho con amor por JuanCode."

---

## Accesibilidad / rendimiento

- Videos `preload="none"` + poster, reproducción inline al click (`reel.ts`).
- Imágenes `loading="lazy"`, `alt` descriptivos, foco visible, `aria-label` en íconos.
- Animaciones respetan `prefers-reduced-motion` (todo se muestra estático si está activo).
- SEO: meta + Open Graph + Twitter card, sitemap (`@astrojs/sitemap`), `robots.txt`.
