import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { Order, OrderItem } from '../../types/order';
import { Review } from '../../types/faq';
import { addReview } from '../../services/firebaseService';
import { updateDoc, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../config/firebase';

interface RatingModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSuccess: (review: Review) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  order,
  onClose,
  onSuccess
}) => {
  if (!isOpen || !order) return null;

  const firstItem: OrderItem = order.items[0] || {
    productId: 'custom',
    productSku: '3D-CUSTOM',
    productName: 'Pieza 3D Personalizada',
    productImage: '',
    unitPrice: order.totalAmount,
    quantity: 1,
    totalPrice: order.totalAmount
  };

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const newReview: Review = {
        id: 'rev-' + Date.now(),
        userName: order.userName || 'Cliente 3D',
        userAvatar: '',
        rating,
        comment,
        date: 'Hace un momento',
        productName: firstItem.productName,
        verifiedPurchase: true
      };

      // Add to reviews collection
      await addReview(newReview);

      // Mark order as reviewed in Firestore
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, 'orders', order.id), {
            userReviewSubmitted: true
          });
        } catch (e) {
          console.warn('Error updating order review status:', e);
        }
      }

      setSubmitted(true);
      onSuccess(newReview);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden animate-slideUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white">¡Gracias por tu valoración!</h3>
            <p className="text-xs text-slate-300">
              Tu opinión ha sido añadida a la tienda y nos ayuda a seguir mejorando.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-white">Valorar tu Pedido</h2>
              <p className="text-xs text-slate-400">
                ¿Qué te ha parecido la calidad de <span className="text-white font-bold">{firstItem.productName}</span>?
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-300">
                {rating === 5 ? '¡Excelente! 🌟' : rating === 4 ? 'Muy Bueno 👍' : rating === 3 ? 'Aceptable 🙂' : 'Regular 😐'}
              </span>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="text-xs font-extrabold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Tu Opinión / Comentario:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu experiencia con la pieza 3D, tiempo de entrega o calidad del acabado..."
                rows={3}
                required
                className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Publicando...' : 'Publicar Valoración'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
