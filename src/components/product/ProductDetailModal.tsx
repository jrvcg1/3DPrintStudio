import React, { useState } from 'react';
import { X, Clock, Layers, ShieldCheck, MessageSquare, Check, Sparkles, Box, Info, Tag } from 'lucide-react';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { buildWhatsAppProductUrl } from '../../services/whatsappService';

interface ProductDetailModalProps {
  product: Product | null;
  whatsappNumber: string;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  whatsappNumber,
  onClose
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Estándar', hex: '#3B82F6' }
  );
  const [customNotes, setCustomNotes] = useState('');

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'];

  const productSku = getProductSku(product);
  const whatsappUrl = buildWhatsAppProductUrl(whatsappNumber, product, selectedColor, customNotes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar ventana de detalles"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Gallery */}
          <div className="p-6 bg-slate-900/50 flex flex-col justify-between gap-4 border-b md:border-b-0 md:border-r border-white/10">
            {/* Main Active Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Edición Destacada
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-cyan-400 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Order Customization */}
          <div className="p-6 md:p-8 flex flex-col justify-between gap-6 max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                    {product.category}
                  </span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono font-bold border border-white/10">
                    {productSku}
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Stock Disponible ({product.stock} unidades)
                </span>
              </div>

              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {product.name}
              </h2>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {product.price.toFixed(2)}€
                </span>
                <span className="text-xs text-slate-400">IVA incluido</span>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Tiempo Impresión</span>
                    <span className="text-xs font-semibold text-slate-200">{product.printTime}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Layers className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Material</span>
                    <span className="text-xs font-semibold text-slate-200">{product.material}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {product.longDescription || product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <label className="text-xs font-bold uppercase text-slate-300 tracking-wider block mb-2">
                    Elige el Color: <span className="text-cyan-400 font-extrabold">{selectedColor.name}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          selectedColor.name === col.name
                            ? 'bg-blue-600/20 border-blue-400 text-white ring-2 ring-blue-500'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization input field if custom product */}
              {product.isCustomizable && (
                <div className="mt-5">
                  <label className="text-xs font-bold uppercase text-slate-300 tracking-wider block mb-1.5">
                    Personalización / Texto a Grabar (Opcional):
                  </label>
                  <input
                    type="text"
                    value={customNotes}
                    onChange={e => setCustomNotes(e.target.value)}
                    placeholder="Ej: Nombre 'MARCO', iniciales o grabado especial..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}
            </div>

            {/* Action CTA Button */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 text-white font-extrabold text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.01] active:scale-95 transition-all"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Pedir este producto por WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Sin pagos online requeridos. Chatea directamente con el creador.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
