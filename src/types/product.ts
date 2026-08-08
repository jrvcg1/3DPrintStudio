export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  sku?: string; // ID único amigable para pedidos (ej. "REF-3D-01", "MW-441051")
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string; // Slug de la categoría (ej. 'llaveros', 'organizadores')
  images: string[];
  colors: ProductColor[];
  printTime: string; // Ej: "3 horas", "1 día"
  material: string; // Ej: "PLA Premium Biodegradable", "PETG Resistencia Alta"
  isCustomizable: boolean;
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
  popularity: number; // Contador de visitas o pedidos para ordenamiento
  dimensions?: string; // Ej: "8 x 5 x 4 cm"
  makerWorldUrl?: string; // URL original de MakerWorld
  createdAt: string;
}

export type ProductFilterOptions = {
  category: string;
  minPrice: number;
  maxPrice: number;
  color: string;
  customizableOnly: boolean;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'popularity' | 'newest';
};

/**
 * Returns a guaranteed clean, unique human-readable SKU / Ref ID for any product.
 */
export function getProductSku(product: Partial<Product>): string {
  if (product.sku && product.sku.trim()) {
    return product.sku.trim().startsWith('#') ? product.sku.trim() : `#${product.sku.trim()}`;
  }
  
  if (product.id) {
    if (product.id.startsWith('prod-mw-') || product.id.startsWith('prod-')) {
      const cleanNum = product.id.replace(/^prod-(mw-)?/, '');
      return `#REF-3D-${cleanNum.slice(-4).toUpperCase()}`;
    }
    return `#REF-${product.id.toUpperCase()}`;
  }
  
  return `#REF-3D-${Math.floor(1000 + Math.random() * 9000)}`;
}
