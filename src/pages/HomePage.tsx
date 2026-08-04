import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { ProcessSection } from '../components/home/ProcessSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { FAQSection } from '../components/home/FAQSection';
import { ProductCard } from '../components/catalog/ProductCard';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Review, FAQItem } from '../types/faq';
import { BusinessConfig } from '../types/config';
import { Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { buildWhatsAppGeneralUrl } from '../services/whatsappService';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  faqs: FAQItem[];
  config: BusinessConfig;
  onNavigate: (tab: string, filterCategory?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddReview: (review: Review) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  reviews,
  faqs,
  config,
  onNavigate,
  onSelectProduct,
  onAddReview
}) => {
  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <HeroSection
        onExploreCatalog={() => onNavigate('catalog')}
        onOpenWhatsApp={() => window.open(buildWhatsAppGeneralUrl(config.whatsappNumber), '_blank')}
      />

      {/* 2. Categorías */}
      <CategoriesSection
        categories={categories}
        onSelectCategory={slug => onNavigate('catalog', slug)}
      />

      {/* 3. Productos Destacados */}
      {featuredProducts.length > 0 && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                Impresiones Populares
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Productos <span className="text-gradient">Destacados</span>
              </h2>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <span>Ver todos los modelos ({products.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                whatsappNumber={config.whatsappNumber}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Proceso de Compra */}
      <ProcessSection />

      {/* 5. Banner CTA Personalizado */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-900/30 via-slate-900 to-purple-900/30">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 inline-block">
              ¿Tienes un archivo STL o idea propia?
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white">
              Hacemos realidad tus proyectos a medida en 3D
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Envíanos la foto, plano o modelo 3D que quieras imprimir y te damos presupuesto instantáneo sin compromiso.
            </p>
          </div>

          <a
            href={buildWhatsAppGeneralUrl(config.whatsappNumber, '¡Hola! Tengo una idea / archivo STL propio para imprimir en 3D.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all shrink-0"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Consultar Proyecto a Medida</span>
          </a>
        </div>
      </section>

      {/* 6. Opiniones */}
      <ReviewsSection reviews={reviews} onAddReview={onAddReview} />

      {/* 7. Preguntas Frecuentes */}
      <FAQSection faqs={faqs} />
    </div>
  );
};
