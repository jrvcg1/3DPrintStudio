import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Check, ShieldCheck, Mail, Phone, MapPin, Truck, Sparkles } from 'lucide-react';
import { Product, getProductSku } from '../../types/product';
import { BusinessConfig } from '../../types/config';
import { Order } from '../../types/order';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  product: Product | null;
  quantity: number;
  selectedColor: string;
  customText: string;
  config: BusinessConfig;
  userDefaultName: string;
  userDefaultEmail: string;
  onClose: () => void;
  onConfirm: (contactDetails: { userName: string; userEmail: string; contactPhone: string; shippingAddress: string }) => Promise<void> | void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  product,
  quantity,
  selectedColor,
  customText,
  config,
  userDefaultName,
  userDefaultEmail,
  onClose,
  onConfirm
}) => {
  const [userName, setUserName] = useState(userDefaultName || '');
  const [userEmail, setUserEmail] = useState(userDefaultEmail || '');
  const [contactPhone, setContactPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserName(userDefaultName || userDefaultEmail?.split('@')[0] || 'Cliente');
      setUserEmail(userDefaultEmail || '');
    }
  }, [isOpen, userDefaultName, userDefaultEmail]);

  if (!isOpen || !product) return null;

  const productSku = getProductSku(product);
  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const shippingCost = subtotal >= (config.freeShippingThreshold || 30) ? 0 : (config.shippingCost || 3.95);
  const totalAmount = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = userName.trim() || userDefaultName || userDefaultEmail?.split('@')[0] || 'Cliente';
    const emailToUse = userEmail.trim() || userDefaultEmail || 'cliente@3dprintstudio.es';

    setSubmitting(true);
    try {
      await onConfirm({
        userName: nameToUse,
        userEmail: emailToUse,
        contactPhone: contactPhone.trim(),
        shippingAddress: shippingAddress.trim()
      });
    } catch (err) {
      console.error('Error submitting order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6 relative overflow-hidden animate-slideUp my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg">
            <ShoppingBag className="w-7 h-7 text-cyan-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white">Confirmar Encargo 3D</h2>
          <p className="text-xs text-slate-300">
            Revisa los detalles de tu pieza y confirma los datos de notificación y envío.
          </p>
        </div>

        {/* Product Order Summary Box */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3 text-xs">
          <div className="flex items-center gap-3">
            {product.images && product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-14 h-14 rounded-xl object-cover ring-1 ring-cyan-400/40 shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400">3D</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {productSku}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400 truncate">{product.category}</span>
              </div>
              <h3 className="font-extrabold text-white text-sm truncate">{product.name}</h3>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Color: <strong className="text-cyan-300">{selectedColor}</strong> · Copias: <strong className="text-white">{quantity}</strong>
              </p>
              {customText && (
                <p className="text-purple-300 text-[11px] font-bold uppercase mt-0.5">
                  Grabado: "{customText}"
                </p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal piezas ({quantity}):</span>
              <span className="font-bold text-white">{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Envío ({shippingCost === 0 ? 'Gratis > 30€' : 'Estándar 24/48h'}):</span>
              <span className="font-bold text-emerald-400">{shippingCost === 0 ? '¡Gratis!' : `${shippingCost.toFixed(2)}€`}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/10 font-black text-sm text-white">
              <span>Total Final:</span>
              <span className="text-cyan-300 text-base">{totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>

        {/* Contact & Delivery Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-extrabold uppercase tracking-wider block mb-1">Nombre Completo:</label>
              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-300 font-extrabold uppercase tracking-wider block mb-1">Correo Notificaciones:</label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-extrabold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Teléfono WhatsApp:
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="Ej: 600000000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-300 font-extrabold uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Dirección de Entrega:
              </label>
              <input
                type="text"
                value={shippingAddress}
                onChange={e => setShippingAddress(e.target.value)}
                placeholder="Calle, número, piso y ciudad..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            📧 Al confirmar, recibirás notificaciones por correo electrónico con cada cambio de estado de tu pedido.
          </p>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10"
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'Guardando pedido...' : 'Confirmar y Enviar Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
