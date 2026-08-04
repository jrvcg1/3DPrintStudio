import React, { useState } from 'react';
import { Star, CheckCircle, PlusCircle, User, MessageSquare } from 'lucide-react';
import { Review } from '../../types/faq';
import { useToast } from '../../context/ToastContext';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: author.trim(),
      comment: comment.trim(),
      rating,
      date: 'Reciente',
      verified: true
    };

    onAddReview(newRev);
    showToast('¡Muchas gracias por tu valoración!', 'success');
    setAuthor('');
    setComment('');
    setModalOpen(false);
  };

  return (
    <section className="py-20 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
              Clientes Satisfechos
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Opiniones de <span className="text-gradient">Nuestra Comunidad</span>
            </h2>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition-all"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Dejar mi opinión</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between space-y-4 hover:border-cyan-400/30 transition-colors"
            >
              {/* Stars & Verified */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5" /> Comprador Verificado
                  </span>
                )}
              </div>

              {/* Comment text */}
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Author Info */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{rev.author}</span>
                <span className="text-slate-500">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-card p-6 rounded-3xl border border-white/20 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Añadir tu Opinión</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tu Nombre:</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={e => setAuthor(e.target.value)}
                  placeholder="Ej: Laura M."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Valoración (Estrellas):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tu Experiencia / Comentario:</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="¿Qué tal quedó tu producto impreso en 3D?"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-md"
                >
                  Publicar Opinión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
