import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  X,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  CreditCard,
  Star,
  AlertCircle,
  Copy,
  Check,
  MessageSquare
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/order';
import { useAuth } from '../../context/AuthContext';
import { subscribeUserOrders, updateOrderStatus } from '../../services/orderService';
import { RatingModal } from './RatingModal';
import { OrderChatModal } from './OrderChatModal';
import { Review } from '../../types/faq';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview?: (review: Review) => void;
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  onAddReview
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedBizum, setCopiedBizum] = useState<string | null>(null);
  const [ratingOrder, setRatingOrder] = useState<Order | null>(null);
  const [chatOrder, setChatOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isOpen || !user?.uid) return;
    const unsubscribe = subscribeUserOrders(user.uid, (data) => {
      setOrders(data);
    });
    return unsubscribe;
  }, [isOpen, user?.uid]);

  if (!isOpen) return null;

  const handleConfirmReceived = async (orderId: string) => {
    if (confirm('¿Confirmas que has recibido tu pedido correctamente?')) {
      await updateOrderStatus(orderId, 'received');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBizum(id);
    setTimeout(() => setCopiedBizum(null), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="w-full max-w-2xl max-h-[90vh] glass-card rounded-3xl border border-white/15 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Mis Pedidos 3D</h2>
                <p className="text-xs text-slate-400">Estado en tiempo real de tus compras y chat directo</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: List of Orders */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-base font-bold text-slate-300">No tienes pedidos realizados aún</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explora el catálogo y realiza tu primer encargo de piezas 3D personalizadas.
                </p>
              </div>
            ) : (
              orders.map((ord) => {
                const unreadCount = ord.unreadClientMessagesCount || 0;
                return (
                  <div
                    key={ord.id}
                    className="glass-card rounded-3xl p-5 border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all shadow-lg"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-cyan-300 px-2.5 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
                            {ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(ord.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setChatOrder(ord)}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs font-bold transition-all relative"
                          title="Consultar dudas o enviar mensajes"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Mensajes</span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] animate-pulse">
                              {unreadCount}
                            </span>
                          )}
                        </button>

                        <StatusBadge status={ord.status} />
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-3">
                      {ord.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-white/5">
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold">3D</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-white text-xs truncate">{item.productName}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span>Cant: <strong className="text-white">{item.quantity}</strong></span>
                              {item.selectedColor && (
                                <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-white/10 text-cyan-300">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                              {item.customText && (
                                <span className="px-1.5 py-0.2 rounded bg-slate-800 border border-white/10 text-purple-300 uppercase">
                                  Texto: "{item.customText}"
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-white">{item.totalPrice.toFixed(2)}€</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment / Status Step Action Box */}
                    <StatusActionBox
                      order={ord}
                      copiedBizum={copiedBizum}
                      onCopy={copyToClipboard}
                      onConfirmReceived={handleConfirmReceived}
                      onOpenRating={(o) => setRatingOrder(o)}
                    />

                    {/* Footer Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-slate-400">Total (Envío: {ord.shippingCost > 0 ? `${ord.shippingCost}€` : 'Gratis'}):</span>
                      <span className="text-base font-black text-white">{ord.totalAmount.toFixed(2)}€</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Rating & Review Modal */}
      <RatingModal
        isOpen={!!ratingOrder}
        order={ratingOrder}
        onClose={() => setRatingOrder(null)}
        onSuccess={(review) => {
          if (onAddReview) onAddReview(review);
          setOrders(prev => prev.map(o => o.id === ratingOrder?.id ? { ...o, userReviewSubmitted: true } : o));
        }}
      />

      {/* Real-time Order Chat Modal */}
      <OrderChatModal
        isOpen={!!chatOrder}
        order={chatOrder}
        onClose={() => setChatOrder(null)}
      />
    </>
  );
};

/* ─── Status Badge Component ─── */
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'pending_approval':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Pendiente Aceptación
        </span>
      );
    case 'pending_payment':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 animate-pulse">
          <CreditCard className="w-3.5 h-3.5" /> Pendiente Pago
        </span>
      );
    case 'in_production':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-purple-400" /> En Fabricación
        </span>
      );
    case 'completed_pending_delivery':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-indigo-400" /> Listo Entrega
        </span>
      );
    case 'delivered':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-teal-400" /> Entregado
        </span>
      );
    case 'received':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recibido
        </span>
      );
    case 'cancelled':
      return (
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5" /> Cancelado
        </span>
      );
    default:
      return null;
  }
};

/* ─── Action Box per status ─── */
const StatusActionBox: React.FC<{
  order: Order;
  copiedBizum: string | null;
  onCopy: (text: string, id: string) => void;
  onConfirmReceived: (id: string) => void;
  onOpenRating: (order: Order) => void;
}> = ({ order, copiedBizum, onCopy, onConfirmReceived, onOpenRating }) => {
  if (order.status === 'pending_approval') {
    return (
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
        <p className="font-bold flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400" />
          El administrador está revisando tu pedido
        </p>
        <p className="text-[11px] text-slate-300 mt-1">
          Una vez aceptado, te mostraremos las instrucciones de pago por Bizum.
        </p>
      </div>
    );
  }

  if (order.status === 'pending_payment') {
    return (
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-2">
        <p className="font-bold text-white flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-blue-400" />
          ¡Pedido aceptado! Realiza el pago por Bizum
        </p>
        <div className="bg-slate-950/70 p-3 rounded-xl border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Teléfono Bizum:</span>
            <button
              onClick={() => onCopy(order.bizumPhone, order.id)}
              className="flex items-center gap-1 font-mono font-bold text-cyan-300 hover:underline"
            >
              +{order.bizumPhone}
              {copiedBizum === order.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Concepto / Referencia:</span>
            <span className="font-mono font-bold text-white">{order.orderNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Importe exacto:</span>
            <span className="font-black text-emerald-400">{order.totalAmount.toFixed(2)}€</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-300">
          Una vez realizado el Bizum, el administrador verificará el ingreso y pasará tu pedido a fabricación.
        </p>
      </div>
    );
  }

  if (order.status === 'in_production') {
    return (
      <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
        <p className="font-bold flex items-center gap-1.5">
          <Package className="w-4 h-4 text-purple-400" />
          Pago verificado · Pieza en impresión 3D
        </p>
        <p className="text-[11px] text-slate-300 mt-1">
          Estamos fabricando tu pedido con los más altos estándares de calidad.
        </p>
      </div>
    );
  }

  if (order.status === 'completed_pending_delivery') {
    return (
      <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
        <p className="font-bold flex items-center gap-1.5">
          <Truck className="w-4 h-4 text-indigo-400" />
          Impresión finalizada · En proceso de entrega
        </p>
        <p className="text-[11px] text-slate-300 mt-1">
          Tu producto está listo y empaquetado para ser entregado.
        </p>
      </div>
    );
  }

  if (order.status === 'delivered') {
    return (
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs space-y-3">
        <div>
          <p className="font-bold text-white flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-teal-400" />
            ¡Tu pedido ha sido entregado!
          </p>
          <p className="text-[11px] text-slate-300 mt-1">
            Por favor confirma que lo has recibido correctamente. (Se marcará como recibido automáticamente en 24h si no lo confirmas).
          </p>
        </div>

        <button
          onClick={() => onConfirmReceived(order.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirmar Recibido</span>
        </button>
      </div>
    );
  }

  if (order.status === 'received') {
    return (
      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
        <p className="font-bold text-emerald-300 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Pedido entregado y verificado como Recibido
        </p>
        {order.userReviewSubmitted ? (
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Gracias por publicar tu valoración sobre este producto.
          </p>
        ) : (
          <button
            onClick={() => onOpenRating(order)}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Valorar Producto</span>
          </button>
        )}
      </div>
    );
  }

  return null;
};
