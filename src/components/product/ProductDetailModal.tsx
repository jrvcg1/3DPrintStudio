import React, { useState, useEffect, useRef } from 'react';
import { X, Clock, Layers, ShieldCheck, Check, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { BusinessConfig } from '../../types/config';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/orderService';
import { Order } from '../../types/order';
import { OrderConfirmationModal } from '../orders/OrderConfirmationModal';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  config: BusinessConfig;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onRequireAuth?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  product,
  config,
  onClose,
  onOrderSuccess,
  onRequireAuth
}) => {
  if (!product) return null;

  const { isAuthenticated, appUser, user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0
      ? product.colors[0].name
      : product.customizationOptions?.colorOptions?.[0] || 'Estándar'
  );
  const [customText, setCustomText] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setSelectedColor(
        product.colors && product.colors.length > 0
          ? product.colors[0].name
          : product.customizationOptions?.colorOptions?.[0] || 'Estándar'
      );
      setQuantity(1);
      setCustomText('');
      setActiveImageIndex(0);
      modalRef.current?.focus();
    }
  }, [isOpen, product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'];

  const productSku = getProductSku(product);
  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const shippingCost = subtotal >= (config.freeShippingThreshold || 30) ? 0 : (config.shippingCost || 3.95);
  const totalAmount = subtotal + shippingCost;

  const handleOpenConfirm = () => {
    if (!isAuthenticated || !user) {
      onRequireAuth();
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirmOrder = async (contactDetails: { userName: string; userEmail: string; contactPhone: string; shippingAddress: string }) => {
    if (!user) return;
    setOrdering(true);
    try {
      const orderId = 'ord-' + Date.now();
      const orderNumber = '#ORD-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: orderId,
        orderNumber,
        userId: user.uid,
        userName: contactDetails.userName,
        userEmail: contactDetails.userEmail,
        contactPhone: contactDetails.contactPhone,
        shippingAddress: contactDetails.shippingAddress,
        items: [
          {
            productId: product.id,
            productSku,
            productName: product.name,
            productImage: images[0],
            unitPrice,
            quantity,
            selectedColor,
            customText: customText.trim() || '',
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
      setShowConfirmModal(false);
      onOrderSuccess(newOrder);
      onClose();
    } catch (err) {
      console.error('Error placing web order:', err);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div 
          ref={modalRef}
          tabIndex={-1}
          className="relative w-full max-w-4xl max-h-[90vh] glass-card rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-slideUp outline-none"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-white/10 backdrop-blur-md transition-colors shadow-lg"
            title="Cerrar ventana (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Gallery Column */}
              <div className="p-6 bg-slate-950/40 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-inner group">
                  <img
                    src={images[activeImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300">
                    {productSku}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx ? 'border-cyan-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Column */}
              <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase text-cyan-400 tracking-wider">
                      {product.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Impresión: {product.printTime}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-2xl font-black text-white mt-2">
                    {unitPrice.toFixed(2)}€
                  </p>
                </div>

                {/* Product Description with 20-line scroll cap */}
                <div className="rounded-2xl p-3.5 bg-slate-900/60 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <span>Descripción del Producto</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-normal">Máx. 20 líneas</span>
                  </div>
                  <div className="max-h-[20lh] max-h-[380px] overflow-y-auto pr-2 text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-white/5">
                    {product.longDescription || product.description}
                  </div>
                </div>

                {/* Technical Specs Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Material:</span>
                    <span className="text-slate-200 font-semibold">{product.material}</span>
                  </div>
                  {product.dimensions && (
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Dimensiones:</span>
                      <span className="text-slate-200 font-semibold">{product.dimensions}</span>
                    </div>
                  )}
                </div>

                {/* Customization Controls */}
                <div className="glass-card p-4 rounded-2xl space-y-3.5 border border-cyan-500/20">
                  <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider">
                    Personaliza tu pieza 3D
                  </h4>

                  {/* Color selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1.5">Color de filamento:</label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map(c => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedColor(c.name)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                              selectedColor === c.name
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md scale-105'
                                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Text input */}
                  {product.isCustomizable && (
                    <div className="space-y-2">
                      {product.customTextFields && product.customTextFields.length > 0 ? (
                        product.customTextFields.map((field) => (
                          <div key={field.id} className="space-y-1">
                            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                              <span>{field.label}:</span>
                              {field.maxLength && (
                                <span className="text-[10px] text-slate-400 font-mono">Máx {field.maxLength} car.</span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={customText}
                              onChange={e => setCustomText(e.target.value)}
                              placeholder={field.placeholder || `Escribe ${field.label.toLowerCase()}...`}
                              maxLength={field.maxLength}
                              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-bold uppercase"
                            />
                          </div>
                        ))
                      ) : (
                        <div>
                          <label className="text-xs font-bold text-slate-300 block mb-1.5">
                            Texto grabado personalizado:
                          </label>
                          <input
                            type="text"
                            value={customText}
                            onChange={e => setCustomText(e.target.value)}
                            placeholder="Ej: MARÍA, iniciales o grabado..."
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-bold uppercase"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between glass-pill p-3 rounded-2xl">
                  <span className="text-xs font-bold text-slate-300">Número de copias:</span>
                  <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-black text-white w-5 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal piezas ({quantity}):</span>
                    <span className="font-bold text-white">{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Envío:</span>
                    <span className="font-bold text-emerald-400">{shippingCost === 0 ? 'Gratis (>30€)' : `${shippingCost.toFixed(2)}€`}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-white/10 font-black text-sm text-white">
                    <span>Total a pagar:</span>
                    <span className="text-cyan-300">{totalAmount.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleOpenConfirm}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-black text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Realizar Pedido en la Web</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ORDER CONFIRMATION MODAL */}
      <OrderConfirmationModal
        isOpen={showConfirmModal}
        product={product}
        quantity={quantity}
        selectedColor={selectedColor}
        customText={customText}
        config={config}
        userDefaultName={appUser?.displayName || user?.displayName || ''}
        userDefaultEmail={appUser?.email || user?.email || ''}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleFinalConfirmOrder}
      />
    </>
  );
};
