import React, { useState } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { buildWhatsAppGeneralUrl } from '../../services/whatsappService';

interface FloatingWhatsAppButtonProps {
  whatsappNumber: string;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({ whatsappNumber }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const url = buildWhatsAppGeneralUrl(whatsappNumber);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* Interactive Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#0E131F] text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/30 text-xs font-medium backdrop-blur-xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>¿Dudas o pedidos? ¡Chatea conmigo!</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        <MessageSquare className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
      </a>
    </div>
  );
};
