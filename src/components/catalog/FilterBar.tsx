import React from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, Sparkles, Check } from 'lucide-react';
import { Category } from '../../types/category';
import { ProductFilterOptions } from '../../types/product';

interface FilterBarProps {
  categories: Category[];
  filters: ProductFilterOptions;
  onFilterChange: (newFilters: Partial<ProductFilterOptions>) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  return (
    <div className="w-full glass-card p-5 rounded-3xl space-y-4 border border-white/10 shadow-xl">
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={e => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Buscar llaveros, figuras, organizadores o regalos..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-400 text-sm font-medium transition-all focus:outline-none"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ searchQuery: '' })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onFilterChange({ category: '' })}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            filters.category === ''
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          Todas las categorías
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onFilterChange({ category: cat.slug })}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filters.category === cat.slug
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Controls: Price, Customizable, SortBy */}
      <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-medium">Ordenar por:</span>
          <select
            value={filters.sortBy}
            onChange={e => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400 font-semibold"
          >
            <option value="featured">Destacados primero</option>
            <option value="popularity">Más populares</option>
            <option value="price-asc">Precio: de menor a mayor</option>
            <option value="price-desc">Precio: de mayor a menor</option>
            <option value="newest">Más recientes</option>
          </select>
        </div>

        {/* Checkbox customizable */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 font-medium">
          <input
            type="checkbox"
            checked={filters.customizableOnly}
            onChange={e => onFilterChange({ customizableOnly: e.target.checked })}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
          />
          <span>Sólo personalizables</span>
        </label>

        {/* Reset button if filters active */}
        {(filters.category || filters.searchQuery || filters.customizableOnly || filters.sortBy !== 'featured') && (
          <button
            onClick={onResetFilters}
            className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};
