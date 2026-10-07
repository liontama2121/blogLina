/** Datos de referencia fijos del sitio (no inventar otros). */
export const SITE = {
  nombre: 'Lina Marcela Pérez',
  nombreCompleto: 'Lina Marcela Pérez Villegas',
  whatsappNumero: '+57 316 0996970',
  whatsappUrl: 'https://wa.me/573160996970',
  instagramHandle: '@linamarcelapv',
  instagramUrl: 'https://www.instagram.com/linamarcelapv/',
  tiktokHandle: '@linamarcelavi',
  tiktokUrl: 'https://www.tiktok.com/@linamarcelavi',
  // PLACEHOLDER — reemplazar por el correo real de Lina
  email: 'hola@linamarcelaperez.com',
  // Hojas de vida (PDF) por idioma.
  cvEs: '/media/cv/CV-Lina-Marcela-Perez-ES.pdf',
  cvEn: '/media/cv/CV-Lina-Marcela-Perez-EN.pdf',
  // (compat) media kit por defecto = CV ES
  mediaKitUrl: '/media/cv/CV-Lina-Marcela-Perez-ES.pdf',
  // PLACEHOLDER — imagen de portada para Open Graph (poner la elegida en public/)
  ogImage: '/og-cover.jpg',
} as const;

/** Fotos elegidas para el diseño (rutas reales en public/media/image). */
export const PHOTOS = {
  // Portada: Lina con micrófono RCN
  hero: '/media/image/WhatsApp Image 2026-06-08 at 1.25.50 PM.jpeg',
  // Retrato secundario (micrófono RCN, camiseta)
  retrato: '/media/image/Imagen de WhatsApp 2024-11-22 a las 00.29.41_8f4bf0c6.jpg',
  // Set de RCN Noticias (horizontal)
  set: '/media/image/Imagen de WhatsApp 2024-11-21 a las 23.52.11_de268354.jpg',
  // Entrevista en La FM (horizontal)
  lafm: '/media/image/Imagen de WhatsApp 2024-11-21 a las 23.52.06_ca72c909.jpg',
  // Alfombra / evento
  evento: '/media/image/Imagen de WhatsApp 2024-11-21 a las 23.52.11_41ac4279.jpg',
} as const;

/** Fotos con artistas para la home (fragmentos de nombre en public/media/image). */
export const ARTISTAS = [
  '463824637_',
  '23.52.07_b3360f11',
  '23.52.11_41ac4279',
  '23.52.11_d7065494',
  '23.52.12_81b56ad6',
  '23.52.09_1b79f17f',
  '23.52.12_ffff671f',
  '23.52.08_554dc7e4',
] as const;

/** Entrevistas destacadas: fragmento del nombre de archivo → índice en i18n `destacadas.items`.
 *  El orden define el orden en la home (la primera es la principal). */
export const DESTACADAS = [
  'carlos-baez-rojo-carmesi',
  'oki-doki-rock',
  'theatron-barra-libre',
  'diana-dieppa',
  'festival-cordillera-gastos',
  'festival-cordillera-dia-uno',
] as const;

/** Estadísticas (datos reales provistos; "" = placeholder editable, se muestra como —). */
export const STATS = {
  tiktok: {
    handle: 'linamarcelavi',
    seguidores: '5.3K',
    likes: '145K',
    vistas_promedio: '',
    engagement: '',
  },
  instagram: {
    handle: 'linamarcelapv',
    seguidores: '',
    alcance_mensual: '',
    engagement: '',
  },
  audiencia: {
    edad_principal: '',
    genero: '',
    ciudades: '',
  },
} as const;

/** Logos de medios para la sección de redacción.
 *  Los archivos de logos/ se mapean por orden/nombre; ajustar `match` si cambian. */
export const MEDIOS = [
  {
    nombre: 'La FM',
    url: 'https://www.lafm.com.co/autores/lina-marcela-perez-villegas-254939',
    // intenta casar por nombre de archivo; fallback al orden en logos/
    match: ['lafm', 'la fm', 'image.png'],
  },
  {
    nombre: 'La Mega',
    url: 'https://www.lamega.com.co/autores/lina-marcela-perez-villegas',
    match: ['lamega', 'la mega', 'image (1).png'],
  },
  {
    nombre: 'RCN Radio',
    url: 'https://www.rcnradio.com/autores/lina-marcela-perez-villegas-303334',
    match: ['rcn', 'image (2).png'],
  },
  {
    nombre: 'RTVC',
    // PLACEHOLDER — URL pendiente (la añade Lina)
    url: '#',
    match: ['rtvc'],
    placeholder: true,
  },
] as const;
