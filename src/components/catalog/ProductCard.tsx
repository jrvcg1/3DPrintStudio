import React, { useState } from 'react';
import { Sparkles, Clock, Layers, ShoppingBag, Eye, Check, Tag } from 'lucide-react';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { buildWhatsAppProductUrl } from '../../services/whatsappService';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  onSelectProduct
}) => {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Estándar', hex: '#3B82F6' }
  );

  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=600&q=80';

  const productSku = getProductSku(product);
  const whatsappUrl = buildWhatsAppProductUrl(whatsappNumber, product, selectedColor);

  return (
    <div className="group relative glass-card rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/15 border border-white/10 hover:border-blue-500/40">
      
      {/* Top Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-900/40 cursor-pointer" onClick={() => onSelectProduct(product)}>
        {/* Main Image */}
        <img
          src={mainImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {product.isFeatured ? (
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Destacado
            </span>
          ) : <div />}

          <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-cyan-300 text-[10px] font-mono font-bold">
            {productSku}
          </span>
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-2">
            <Eye className="w-4 h-4 text-cyan-400" /> Ver Detalles 3D
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-bold text-cyan-400 text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{product.printTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Palette Selector */}
        {product.colors && product.colors.length > 0 && (
          <div>
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Color: <strong className="text-slate-200">{selectedColor.name}</strong>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map(col => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  title={col.name}
                  aria-label={`Seleccionar color ${col.name}`}
                  className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                    selectedColor.name === col.name
                      ? 'ring-2 ring-blue-500 scale-110 border-white'
                      : 'border-white/20 opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                >
                  {selectedColor.name === col.name && (
                    <Check className="w-3 h-3 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Precio</span>
            <span className="text-xl font-extrabold text-white">
              {product.price.toFixed(2)}€
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
