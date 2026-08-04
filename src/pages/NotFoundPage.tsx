import React from 'react';
import { Box, Home, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600 animate-spin blur-xl opacity-50" />
        <div className="relative w-20 h-20 bg-[#0A0D14] rounded-3xl border border-white/20 flex items-center justify-center shadow-2xl">
          <span className="text-3xl font-black text-cyan-400">404</span>
        </div>
      </div>

      <div className="max-w-md space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Modelo No Encontrado</h1>
        <p className="text-sm text-slate-400">
          La página o modelo 3D que buscas parece haber sido retocado en el slicer o cambiado de ubicación.
        </p>
      </div>

      <button
        onClick={onNavigateHome}
        className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Volver a la Página Principal</span>
      </button>
    </div>
  );
};
