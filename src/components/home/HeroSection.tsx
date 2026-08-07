import React from 'react';
import { Box, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Zap, Layers, Award } from 'lucide-react';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenWhatsApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCatalog,
  onOpenWhatsApp
}) => {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-cyan-500/10 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-500/10 animate-float">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Estudio de Impresión 3D Personalizada</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Tus ideas cobradas en <span className="text-gradient">Realidad 3D</span> con precisión única.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Llaveros con tu nombre, figuras articuladas, organizadores de escritorio y regalos únicos hechos bajo demanda. <strong className="text-white">Haz tu pedido online y sigue su estado en tiempo real.</strong>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 hover:opacity-90 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 active:scale-95 transition-all group"
              >
                <span>Explorar Catálogo & Pedir</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 font-bold text-base backdrop-blur-md active:scale-95 transition-all"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Dudas por WhatsApp</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-slate-400 text-xs">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Envíos 24-48h</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                <span>PLA 100% Ecológico</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Award className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Valoración 4.9/5★</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md glass-card rounded-3xl p-6 border border-white/20 shadow-2xl space-y-6 overflow-hidden">
              {/* Glowing Aura */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />

              {/* Showcase Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group">
                <img
                  src="https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80"
                  alt="Dragón Articulado 3D"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">Dragón Cyber Articulado</span>
                    <span className="text-cyan-400 font-semibold">14.99€ · Impreso en 5 horas</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                    TOP VENTAS
                  </span>
                </div>
              </div>

              {/* Live Printing Counter Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                    <Box className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Impresoras 3D en Acción</span>
                    <span className="text-sm font-bold text-white">Capas de 0.16mm Precision</span>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
