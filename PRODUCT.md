# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: colegas del medio (periodistas, editores, productores) y entrevistadores/reclutadores de medios que evalúan a Lina para un puesto o colaboración. Llegan desde un link compartido (CV, LinkedIn, WhatsApp), escanean rápido y deciden si vale la pena una entrevista.
Secundario: marcas que buscan host, UGC o cobertura.

## Product Purpose

Portafolio personal de Lina Marcela Pérez Villegas, periodista digital de entretenimiento y creadora de contenido bilingüe (inglés C1). Éxito = el visitante ve su trabajo en cámara (entrevistas, cobertura en vivo) en segundos y queda convencido de su nivel profesional; luego descarga el CV o la contacta.

## Positioning

Periodista con experiencia real en medios nacionales (RCN Radio, La FM, La Mega, RTVC) que además domina el formato de redes (TikTok/Reels) y trabaja en inglés: combina criterio editorial con presencia en cámara.

## Operating Context

- Se revisa en móvil (link por WhatsApp) y en desktop (proceso de selección).
- Acción clave: ver entrevistas/clips. Secundarias: descargar CV (ES/EN), contactar por WhatsApp/email.
- Bilingüe ES/EN con toggle cliente.

## Capabilities and Constraints

- Astro 6 estático + Tailwind v4 (PostCSS) + Anime.js v4. Deploy Cloudflare Pages, límite 24 MB por archivo.
- 6 rutas que se conservan: `/`, `/quien-soy/`, `/por-que-contratarme/`, `/entrevistas/`, `/logros/`, `/estadisticas/`.
- Medios desde `src/data/media.json` (generado). Videos con `preload="none"`/metadata, reproducción inline al click.
- No agregar dependencias sin consultar.

## Brand Commitments

- Paleta fijada por el cliente: solo rosa y blanco hueso (pedido explícito, 2026-10-06; reemplaza rosa + verde).
- Footer: "Hecho con amor por JuanCode."
- Handles: Instagram @linamarcelapv, TikTok @linamarcelavi, WhatsApp +57 316 0996970.

## Evidence on Hand

- Videos de entrevistas (`public/media/video_entrevista/`, 13), reels TikTok (11), fotos con artistas (`public/media/image/`, 18), video hero (`public/media/hero.mp4`).
- Logos de medios en `public/media/logos/` (La FM, La Mega, RCN, RTVC).
- CV PDF ES/EN en `public/media/cv/`.
- Estadísticas reales: TikTok 5.3K seguidores, 145K likes. Resto pendiente: no inventar.
- Email actual es placeholder; nombre del programa "XYZ" pendiente de confirmar.

## Product Principles

1. El trabajo en cámara es la prueba: mostrarlo antes que describirlo.
2. Profesional primero: un editor debe tomarla en serio en 5 segundos.
3. Solo datos reales; los vacíos se muestran como pendientes, nunca inventados.
4. Bilingüe de verdad: todo texto visible existe en ES y EN.

## Accessibility & Inclusion

WCAG AA en contraste (crítico con pasteles: texto nunca en pastel sobre pastel), foco visible, `prefers-reduced-motion` respetado, alt descriptivos.
