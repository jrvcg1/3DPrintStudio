import React, { useState, useMemo } from 'react';
import { FilterBar } from '../components/catalog/FilterBar';
import { ProductCard } from '../components/catalog/ProductCard';
import { Product, ProductFilterOptions } from '../types/product';
import { Category } from '../types/category';
import { BusinessConfig } from '../types/config';
import { Box, Sparkles, AlertCircle } from 'lucide-react';

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
  config: BusinessConfig;
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  categories,
  config,
  initialCategory = '',
  onSelectProduct
}) => {
  const [filters, setFilters] = useState<ProductFilterOptions>({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 100,
    color: '',
    customizableOnly: false,
    searchQuery: '',
    sortBy: 'featured'
  });

  const handleFilterChange = (newFilters: Partial<ProductFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 100,
      color: '',
      customizableOnly: false,
      searchQuery: '',
      sortBy: 'featured'
    });
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;

      // Category match
      if (filters.category && p.category !== filters.category) {
        return false;
      }

      // Search query match
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchName = p.name.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        const matchCat = p.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      // Customizable only match
      if (filters.customizableOnly && !p.isCustomizable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'featured') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      if (filters.sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [products, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
          Catálogo de Impresión 3D
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Explora nuestros <span className="text-gradient">Modelos & Diseños</span>
        </h1>
        <p className="text-sm text-slate-400">
          Selecciona tu modelo favorito, personaliza el color y solicítalo al instante por WhatsApp.
        </p>
      </div>

      {/* Filter Component */}
      <FilterBar
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              whatsappNumber={config.whatsappNumber}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-white/10">
          <AlertCircle className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">No se encontraron productos</h3>
          <p className="text-xs text-slate-400">
            Intenta cambiar la palabra de búsqueda o seleccionar otra categoría.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs"
          >
            Limpiar todos los filtros
          </button>
        </div>
      )}
    </div>
  );
};
