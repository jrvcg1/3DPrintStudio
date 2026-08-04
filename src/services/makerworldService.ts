import { Product } from '../types/product';
import { Category } from '../types/category';
import { translateToSpanish } from './translationService';

export interface MakerWorldImportResult {
  title: string;
  description: string;
  longDescription: string;
  images: string[];
  suggestedCategorySlug: string;
  printTime: string;
  material: string;
  tags: string[];
  rawCategoryNames: string[];
  modelUrl: string;
  modelId: string;
}

/**
 * Extracts the MakerWorld numeric model ID from various URL formats.
 * e.g. https://makerworld.com/en/models/441051-names?from=search#profileId-346769 -> 441051
 */
export function extractMakerWorldId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  // Match /models/123456 or /models/123456-slug
  const match = url.match(/\/models\/(\d+)/i);
  if (match && match[1]) {
    return match[1];
  }
  
  // Direct numeric string
  if (/^\d+$/.test(url.trim())) {
    return url.trim();
  }
  
  return null;
}

/**
 * Helper to strip HTML tags from MakerWorld summary HTML
 */
function cleanHtmlText(html: string): string {
  if (!html) return '';
  // Replace <p>, <br>, <li> with line breaks/spaces
  let text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  
  // Trim excessive newlines
  return text.split('\n').map(line => line.trim()).filter(Boolean).join('\n');
}

/**
 * Formats print prediction in seconds to human readable time string.
 * e.g. 1776 -> "30 min", 7200 -> "2 horas"
 */
function formatPrintTime(seconds?: number): string {
  if (!seconds || seconds <= 0) return '2 horas';
  
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = (minutes / 60).toFixed(1);
  return `${hours.endsWith('.0') ? hours.slice(0, -2) : hours} horas`;
}

/**
 * Maps MakerWorld category names (Decor, Household, etc.) to existing app category slugs.
 */
export function mapCategoryToAppSlug(makerCategories: string[], availableCategories: Category[]): string {
  const catNamesLower = makerCategories.map(c => c.toLowerCase());
  
  // Search rules
  const mappings: { keywords: string[]; slug: string }[] = [
    { keywords: ['decor', 'decoración', 'decoration', 'art', 'wall'], slug: 'decoracion' },
    { keywords: ['household', 'home', 'hogar', 'kitchen', 'bathroom'], slug: 'hogar' },
    { keywords: ['organizer', 'storage', 'organizadores', 'box', 'holder'], slug: 'organizadores' },
    { keywords: ['toy', 'game', 'juegos', 'puzzle', 'play'], slug: 'juegos' },
    { keywords: ['keychain', 'llaveros', 'keyring', 'key'], slug: 'llaveros' },
    { keywords: ['figure', 'statue', 'figuras', 'miniature', 'sculpture', 'character'], slug: 'figuras' },
    { keywords: ['accessory', 'accesorios', 'gadget', 'phone', 'stand'], slug: 'accesorios' },
    { keywords: ['gift', 'regalos', 'present'], slug: 'regalos' },
  ];

  for (const m of mappings) {
    if (catNamesLower.some(c => m.keywords.some(k => c.includes(k)))) {
      // Check if this slug exists in availableCategories
      const matchedCat = availableCategories.find(c => c.slug === m.slug);
      if (matchedCat) return matchedCat.slug;
    }
  }

  // Check direct name/slug match in availableCategories
  for (const name of catNamesLower) {
    const matchedCat = availableCategories.find(
      c => c.slug.toLowerCase().includes(name) || c.name.toLowerCase().includes(name)
    );
    if (matchedCat) return matchedCat.slug;
  }

  // Fallback to first available category slug or 'general'
  return availableCategories[0]?.slug || 'general';
}

/**
 * Fetches model metadata from MakerWorld API with CORS proxy fallbacks.
 */
export async function fetchMakerWorldProduct(url: string, availableCategories: Category[]): Promise<MakerWorldImportResult> {
  const modelId = extractMakerWorldId(url);
  if (!modelId) {
    throw new Error('URL de MakerWorld inválida. Asegúrate de incluir el enlace completo del modelo.');
  }

  const targetApiUrl = `https://makerworld.com/api/v1/design-service/design/${modelId}`;

  let json: any = null;

  // Try direct fetch first
  try {
    const res = await fetch(targetApiUrl, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      json = await res.json();
    }
  } catch (err) {
    // continue to proxy
  }

  // If direct fetch fails (e.g. CORS), try via CORS proxies
  if (!json || !json.title) {
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(targetApiUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetApiUrl)}`
    ];

    for (const proxyUrl of proxies) {
      try {
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const proxyData = await res.json();
          if (proxyData && (proxyData.title || proxyData.id)) {
            json = proxyData;
            break;
          }
        }
      } catch (e) {
        // continue to next proxy
      }
    }
  }

  if (!json || (!json.title && !json.id)) {
    throw new Error('No se pudo conectar a la API de MakerWorld. Verifica la URL e inténtalo de nuevo.');
  }

  // Extract raw text fields
  const rawTitle = json.title || 'Modelo MakerWorld ' + modelId;
  const rawSummary = json.summary || '';
  const cleanSummary = cleanHtmlText(rawSummary);

  // Translate automatically to Spanish
  let spanishTitle = rawTitle;
  let spanishSummary = cleanSummary;

  try {
    spanishTitle = await translateToSpanish(rawTitle);
    if (cleanSummary) {
      spanishSummary = await translateToSpanish(cleanSummary);
    }
  } catch (tErr) {
    console.warn('Auto translation fallback to original:', tErr);
  }

  // Extract images
  const images: string[] = [];
  if (json.coverUrl) {
    images.push(json.coverUrl);
  }

  // Additional images from designExtension or instances
  if (json.designExtension && Array.isArray(json.designExtension.design_pictures)) {
    json.designExtension.design_pictures.forEach((pic: any) => {
      const picUrl = typeof pic === 'string' ? pic : pic?.url || pic?.cover;
      if (picUrl && !images.includes(picUrl)) {
        images.push(picUrl);
      }
    });
  }

  if (Array.isArray(json.instances)) {
    json.instances.forEach((inst: any) => {
      if (inst.cover && !images.includes(inst.cover)) {
        images.push(inst.cover);
      }
    });
  }

  // If no images found, fallback placeholder
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80');
  }

  // Categories
  const rawCategoryNames: string[] = [];
  if (Array.isArray(json.categories)) {
    json.categories.forEach((cat: any) => {
      if (cat.name) rawCategoryNames.push(cat.name);
    });
  }

  const suggestedCategorySlug = mapCategoryToAppSlug(rawCategoryNames, availableCategories);

  // Print time from default instance or first instance
  let printSeconds = 0;
  if (Array.isArray(json.instances) && json.instances.length > 0) {
    const mainInst = json.instances.find((i: any) => i.id === json.defaultInstanceId) || json.instances[0];
    if (mainInst && mainInst.prediction) {
      printSeconds = mainInst.prediction;
    }
  }

  const printTime = formatPrintTime(printSeconds);

  // Extract tags
  const tags: string[] = Array.isArray(json.tags)
    ? json.tags.map((t: any) => (typeof t === 'string' ? t : t.name)).filter(Boolean)
    : [];

  return {
    title: spanishTitle,
    description: spanishSummary.slice(0, 160) || 'Diseño exclusivo impreso en 3D de alta calidad.',
    longDescription: spanishSummary,
    images,
    suggestedCategorySlug,
    printTime,
    material: 'PLA Premium Biodegradable',
    tags,
    rawCategoryNames,
    modelUrl: url,
    modelId
  };
}
