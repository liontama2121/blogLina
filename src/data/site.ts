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
