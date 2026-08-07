import React, { useState } from 'react';
import { X, Clock, Layers, ShieldCheck, Check, Sparkles, Plus, Minus, ShoppingBag, MessageSquare } from 'lucide-react';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { BusinessConfig } from '../../types/config';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { Order } from '../../types/order';

interface ProductDetailModalProps {
  product: Product | null;
  config: BusinessConfig;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onRequireAuth: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  config,
  onClose,
  onOrderSuccess,
  onRequireAuth
}) => {
  if (!product) return null;

  const { isAuthenticated, appUser, user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0
      ? product.colors[0].name
      : product.customizationOptions?.colorOptions?.[0] || 'Estándar'
  );
  const [customText, setCustomText] = useState('');
  const [ordering, setOrdering] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'];

  const productSku = getProductSku(product);
  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const shippingCost = subtotal >= (config.freeShippingThreshold || 30) ? 0 : (config.shippingCost || 3.95);
  const totalAmount = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      onRequireAuth();
      return;
    }

    setOrdering(true);
    try {
      const orderId = 'ord-' + Date.now();
      const orderNumber = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        userId: user.uid,
        userName: appUser?.displayName || user.displayName || 'Cliente 3D',
        userEmail: appUser?.email || user.email || '',
        items: [
          {
            productId: product.id,
            productSku,
            productName: product.name,
            productImage: images[0],
            unitPrice,
            quantity,
            selectedColor,
            customText: customText.trim() || undefined,
            totalPrice: subtotal
          }
        ],
        subtotal,
        shippingCost,
        totalAmount,
        status: 'pending_approval',
        bizumPhone: config.whatsappNumber || config.phone || '34600000000',
        createdAt: new Date().toISOString()
      };

      await createOrder(newOrder);
      onOrderSuccess(newOrder);
      onClose();
    } catch (err) {
      console.error('Error placing web order:', err);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl glass-card rounded-3xl overflow-hidden shadow-2xl border border-white/20 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-slate-900/80 text-slate-400 hover:text-white border border-white/10 hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Gallery */}
          <div className="p-6 bg-slate-900/50 flex flex-col justify-between gap-4 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isFeatured && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Destacado
                </span>
              )}
            </div>

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

          {/* Right Column: Customization & Order Form */}
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
              </div>

              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {product.name}
              </h2>

              {/* Price & Quantity Calculation */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {unitPrice.toFixed(2)}€
                </span>
                <span className="text-xs text-slate-400">/ unidad (IVA incl.)</span>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Impresión</span>
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

              {/* Customization: Color selector */}
              {(product.colors && product.colors.length > 0) || (product.customizationOptions?.colorOptions && product.customizationOptions.colorOptions.length > 0) ? (
                <div className="mt-4">
                  <label className="text-xs font-extrabold uppercase text-slate-300 tracking-wider block mb-2">
                    Color deseado: <span className="text-cyan-400 font-bold">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(product.colors?.map(c => c.name) || product.customizationOptions?.colorOptions || ['Estándar']).map(colName => (
                      <button
                        key={colName}
                        type="button"
                        onClick={() => setSelectedColor(colName)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === colName
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-2 ring-cyan-500/30'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {colName}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Customization: Text input */}
              {(product.isCustomizable || product.customizationOptions?.allowsText) && (
                <div className="mt-4">
                  <label className="text-xs font-extrabold uppercase text-slate-300 tracking-wider block mb-1.5">
                    Texto personalizado a grabar (Opcional):
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="Ej: MARÍA, iniciales o dedicatoria..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-bold uppercase"
                  />
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-white block uppercase tracking-wider">Número de copias:</span>
                  <span className="text-[11px] text-slate-400">Selecciona cuántas piezas deseas pedir</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black text-white w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Subtotal ({quantity} {quantity === 1 ? 'unidad' : 'unidades'}):</span>
                  <span className="font-bold text-white">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Envío:</span>
                  <span className="font-bold text-emerald-400">{shippingCost === 0 ? '¡Gratis!' : `${shippingCost.toFixed(2)}€`}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20 font-black text-sm text-white">
                  <span>Total Pedido:</span>
                  <span className="text-cyan-300 text-base">{totalAmount.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={handlePlaceOrder}
                disabled={ordering}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{ordering ? 'Procesando pedido...' : 'Realizar Pedido en la Web'}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                El pedido pasará a revisión del admin. Pago por Bizum tras aceptación.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
