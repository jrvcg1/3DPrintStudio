import React from 'react';
import { Box, Heart, MessageSquare, ShieldCheck, ExternalLink, Instagram, Youtube, Sparkles } from 'lucide-react';
import { BusinessConfig } from '../../types/config';

interface FooterProps {
  config: BusinessConfig;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate }) => {
  return (
    <footer className="w-full bg-[#07090E] border-t border-white/10 pt-16 pb-12 text-slate-400 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0A0D14] rounded-[11px] flex items-center justify-center">
                  <Box className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                3D Print <span className="text-gradient">Studio</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Estudio de impresión 3D de alta precisión. Diseñamos e imprimimos figuras, organizadores, llaveros y regalos personalizados con pasión y acabado profesional.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 border border-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {config.tiktokUrl && (
                <a
                  href={config.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 border border-white/10 transition-colors"
                  aria-label="TikTok"
                >
                  <Sparkles className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navegación</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-cyan-400 transition-colors">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('process')} className="hover:text-cyan-400 transition-colors">
                  Cómo Pedir por WhatsApp
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faqs')} className="hover:text-cyan-400 transition-colors">
                  Preguntas Frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categorías Popular</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
                  Dragones & Articulados
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
                  Organizadores de Escritorio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
                  Llaveros Nombres 3D
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-cyan-400 transition-colors">
                  Accesorios Gaming
                </button>
              </li>
            </ul>
          </div>

          {/* Pedidos & Garantía */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Atención & Pedidos</h3>
            <p className="text-sm leading-relaxed mb-4 text-slate-400">
              ¿Tienes dudas o quieres un diseño personalizado a medida? Chatea con nosotros por WhatsApp en cualquier momento.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Pedidos abiertos vía WhatsApp
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} 3D Print Studio. Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 transition-colors">
              Política de Privacidad
            </button>
            <button onClick={() => onNavigate('legal')} className="hover:text-slate-300 transition-colors">
              Aviso Legal
            </button>
            <button onClick={() => onNavigate('admin')} className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
