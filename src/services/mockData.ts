import { Product } from '../types/product';
import { Category } from '../types/category';
import { FAQItem, Review } from '../types/faq';
import { BusinessConfig } from '../types/config';

export const INITIAL_CONFIG: BusinessConfig = {
  storeName: '3D Print Studio',
  whatsappNumber: '34600000000', // Modificable en el panel de administración
  welcomeMessage: '¡Hola! Bienvenidos a 3D Print Studio. Haz tu pedido online con seguimiento en tiempo real.',
  announcementBanner: '🚀 ¡Envío gratis en todos los pedidos de más de 30€! Piezas impresas con PLA 100% Biodegradable.',
  showAnnouncementBanner: true,
  isStoreActive: true,
  currencySymbol: '€',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  landingPageConfig: {
    showHeroSection: true,
    heroBadgeText: '🖨️ Servicio de Impresión 3D Profesional & Personalizado',
    heroTitle: 'Impresión 3D de Alta Precisión & Diseños a Medida',
    heroSubtitle: 'Damos vida a tus ideas con materiales biodegradables de máxima calidad. Explora nuestro catálogo o encarga piezas personalizadas con seguimiento en vivo.',
    heroImageUrl: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80',
    heroPrimaryCtaText: 'Explorar Catálogo',
    showHeroPrimaryCta: true,
    heroSecondaryCtaText: 'Encargo por MakerWorld',
    showHeroSecondaryCta: true,
    showFeaturesSection: true,
    featuresTitle: '¿Por qué elegir 3D Print Studio?',
    featuresSubtitle: 'Calidad profesional, personalización total y entregas ultra rápidas.',
    showCatalogSection: true,
    catalogTitle: 'Explora Nuestro Catálogo 3D',
    showMakerWorldSection: true,
    makerWorldTitle: 'Importa tus Modelos desde MakerWorld',
    makerWorldSubtitle: 'Pega la URL de cualquier diseño de MakerWorld y lo imprimimos para ti con la máxima precisión.',
    makerWorldBannerUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1000&q=80',
    showFaqsSection: true,
    faqsTitle: 'Preguntas Frecuentes',
    showReviewsSection: true,
    reviewsTitle: 'Lo que dicen nuestros clientes',
    showFooterSection: true,
    footerTagline: 'Servicio profesional de impresión 3D a medida.'
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-llaveros',
    name: 'Llaveros',
    slug: 'llaveros',
    iconName: 'Key',
    description: 'Llaveros personalizados, logos, iniciales y diseños pop articulados.',
  },
  {
    id: 'cat-organizadores',
    name: 'Organizadores',
    slug: 'organizadores',
    iconName: 'Box',
    description: 'Soportes de escritorio, organizadores de cables y soportes para mandos.',
  },
  {
    id: 'cat-figuras',
    name: 'Figuras',
    slug: 'figuras',
    iconName: 'Sparkles',
    description: 'Dragones articulados, personajes, coleccionables y minihéroes.',
  },
  {
    id: 'cat-decoracion',
    name: 'Decoración',
    slug: 'decoracion',
    iconName: 'Home',
    description: 'Lámparas litofanía, maceteros geométricos y arte moderno de pared.',
  },
  {
    id: 'cat-accesorios',
    name: 'Accesorios',
    slug: 'accesorios',
    iconName: 'Smartphone',
    description: 'Fundas, soportes para móvil/tablet y accesorios cotidianos.',
  },
  {
    id: 'cat-juegos',
    name: 'Juegos',
    slug: 'juegos',
    iconName: 'Gamepad2',
    description: 'Puzzles 3D, fidget toys, laberintos y juegos de mesa personalizados.',
  },
  {
    id: 'cat-personalizados',
    name: 'Personalizados',
    slug: 'personalizados',
    iconName: 'Wrench',
    description: 'Proyectos a medida, nombres 3D, logotipos e impresiones bajo demanda.',
  },
  {
    id: 'cat-regalos',
    name: 'Regalos',
    slug: 'regalos',
    iconName: 'Gift',
    description: 'Detalles únicos para cumpleaños, eventos y ocasiones especiales.',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: '3D-101',
    name: 'Dragón Articulado Cyber',
    slug: 'dragon-articulado-cyber',
    description: 'Dragón con diseño articulado flexible sin necesidad de ensamblaje. Movimiento ultra suave y acabado sedoso.',
    longDescription: 'Impreso en una sola pieza con tecnología de capas finas (0.16mm). Cada escama y articulación se mueve libremente. Ideal para coleccionistas, alivio del estrés o decoración futurista de escritorio.',
    price: 14.99,
    category: 'figuras',
    images: [
      'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Azul Eléctrico Silk', hex: '#3B82F6' },
      { name: 'Cian Neón', hex: '#06B6D4' },
      { name: 'Morado Galaxia', hex: '#8B5CF6' },
      { name: 'Negro Mate', hex: '#111827' }
    ],
    printTime: '5 horas',
    material: 'PLA Premium Silk Biodegradable',
    isCustomizable: true,
    isFeatured: true,
    isActive: true,
    stock: 12,
    popularity: 98,
    dimensions: '22 x 6 x 4 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    sku: '3D-102',
    name: 'Soporte Hexagonal para Mandos (PS5 / Xbox)',
    slug: 'soporte-hexagonal-mandos',
    description: 'Soporte de diseño futurista con patrón de panal para guardar tus mandos con elegancia y seguridad.',
    longDescription: 'Diseño geométrico optimizado para la máxima estabilidad. Incluye almohadillas antideslizantes integradas y canal inferior para conectar el cable de carga sin retirar el mando.',
    price: 18.50,
    category: 'organizadores',
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Negro Obsidian', hex: '#0A0D14' },
      { name: 'Azul Cyber', hex: '#2563EB' },
      { name: 'Gris Titanio', hex: '#4B5563' }
    ],
    printTime: '7 horas',
    material: 'PETG Alta Resistencia',
    isCustomizable: false,
    isFeatured: true,
    isActive: true,
    stock: 8,
    popularity: 92,
    dimensions: '15 x 12 x 14 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    sku: '3D-103',
    name: 'Llavero Nombre 3D Personalizado',
    slug: 'llavero-nombre-3d-personalizado',
    description: 'Tu nombre o palabra favorita impresa en 3D con tipografía moderna y combinación de 2 colores.',
    longDescription: 'Elige tu texto (hasta 10 caracteres) y tus dos colores preferidos. Ligero, duradero y resistente al uso diario. Incluye anilla metálica de acero inoxidable.',
    price: 4.99,
    category: 'llaveros',
    images: [
      'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Azul & Blanco', hex: '#3B82F6' },
      { name: 'Cian & Negro', hex: '#06B6D4' },
      { name: 'Morado & Rosa', hex: '#8B5CF6' }
    ],
    printTime: '45 mins',
    material: 'PLA Eco-Friendly',
    isCustomizable: true,
    isFeatured: true,
    isActive: true,
    stock: 50,
    popularity: 105,
    dimensions: '7 x 2.5 x 0.6 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Macetero Geométrico Voronoi',
    slug: 'macetero-geometrico-voronoi',
    description: 'Maceta decorativa con patrón orgánico Voronoi. Aporta un toque arquitectónico a cualquier espacio.',
    longDescription: 'Diseñado por computador usando algoritmos Voronoi. Cuenta con sistema interno de drenaje y plato recogedor de agua invisible.',
    price: 16.00,
    category: 'decoracion',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Blanco Marmolado', hex: '#F3F4F6' },
      { name: 'Verde Menta Silk', hex: '#10B981' },
      { name: 'Negro Antracita', hex: '#1F2937' }
    ],
    printTime: '6 horas',
    material: 'PLA Reciclado Premium',
    isCustomizable: false,
    isFeatured: false,
    isActive: true,
    stock: 15,
    popularity: 84,
    dimensions: '12 x 12 x 10 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Fidget Spinner Inercial "Gear Shift"',
    slug: 'fidget-spinner-gear-shift',
    description: 'Juego de engranajes planetarios interconectados. Giro hipnótico de alta precisión.',
    longDescription: 'Construido con rodamientos de precisión de bajo rozamiento. Al girarlo, 6 mini engranajes se mueven en sincronía perfecta.',
    price: 9.99,
    category: 'juegos',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Cian Neón', hex: '#06B6D4' },
      { name: 'Morado Eléctrico', hex: '#8B5CF6' }
    ],
    printTime: '2 horas',
    material: 'PLA Tough',
    isCustomizable: false,
    isFeatured: false,
    isActive: true,
    stock: 20,
    popularity: 76,
    dimensions: '7 x 7 x 1.5 cm',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Soporte Ajustable Móvil / Tablet',
    slug: 'soporte-ajustable-movil-tablet',
    description: 'Soporte plegable con 5 ángulos de inclinación. Cabe en el bolsillo y soporta hasta tablets de 11".',
    longDescription: 'Mecanismo de bisagra impresa directa. Súper resistente y compacto para llevar al instituto, oficina o de viaje.',
    price: 7.50,
    category: 'accesorios',
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Negro Mate', hex: '#111827' },
      { name: 'Azul Cobalto', hex: '#1D4ED8' }
    ],
    printTime: '1.5 horas',
    material: 'PETG Flex-Tough',
    isCustomizable: false,
    isFeatured: true,
    isActive: true,
    stock: 25,
    popularity: 91,
    dimensions: '10 x 6 x 1 cm',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: '¿Cómo hago un pedido?',
    answer: 'Es facilísimo: explora nuestro catálogo, elige el producto y color que te guste, pulsa en "Pedir" y confirma tus datos. Tu pedido quedará guardado en tu cuenta y podrás ver su estado en tiempo real.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: '¿Qué plástico o material utilizáis?',
    answer: 'Utilizamos PLA (Ácido Poliláctico) de alta pureza 100% biodegradable y orgánico derivado del maíz, además de PETG para piezas que requieren resistencia extrema.',
    category: 'impresion'
  },
  {
    id: 'faq-3',
    question: '¿Puedo pedir algo que no esté en la tienda?',
    answer: '¡Por supuesto! Si tienes un archivo 3D (STL, OBJ) o una idea en mente, escríbenos por WhatsApp y te hacemos un presupuesto personalizado gratis.',
    category: 'personalizaciones'
  },
  {
    id: 'faq-4',
    question: '¿Cuánto tarda en imprimirse y entregarse mi pedido?',
    answer: 'La mayoría de productos se imprimen en 2 a 6 horas. Los pedidos locales se entregan en 24-48h tras finalizar la impresión.',
    category: 'envios'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Mateo R.',
    comment: '¡El dragón articulado es una pasada! El movimiento es súper fluido y el color azul brillante impresiona.',
    rating: 5,
    productName: 'Dragón Articulado Cyber',
    date: 'Hace 2 días',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Lucía G.',
    comment: 'Pedí 3 llaveros con los nombres de mis amigos para un regalo y quedaron espectaculares. Calidad de 10.',
    rating: 5,
    productName: 'Llavero Nombre 3D Personalizado',
    date: 'Hace 1 semana',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Carlos M.',
    comment: 'Atención al cliente de 10 por WhatsApp. El soporte para el mando de PS5 queda impecable en el escritorio.',
    rating: 5,
    productName: 'Soporte Hexagonal para Mandos',
    date: 'Hace 2 semanas',
    verified: true
  }
];
