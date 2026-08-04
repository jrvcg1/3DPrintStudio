import React from 'react';
import { Key, Box, Sparkles, Home, Smartphone, Gamepad2, Wrench, Gift, ArrowRight } from 'lucide-react';
import { Category } from '../../types/category';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Key,
  Box,
  Sparkles,
  Home,
  Smartphone,
  Gamepad2,
  Wrench,
  Gift
};

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory
}) => {
  return (
    <section className="py-16 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
            Explora las Colecciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Categorías <span className="text-gradient">Populares</span>
          </h2>
          <p className="text-sm text-slate-400">
            Desde llaveros con nombres personalizados hasta organizadores de escritorio y figuras coleccionables.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(cat => {
            const IconComponent = ICON_MAP[cat.iconName] || Box;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className="group text-left glass-card p-6 rounded-3xl border border-white/10 hover:border-cyan-400/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden"
              >
                {/* Background Subtle Gradient */}
                <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-gradient-to-br from-blue-500/10 to-cyan-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
