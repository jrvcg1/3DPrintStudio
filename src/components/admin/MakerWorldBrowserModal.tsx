import React, { useState } from 'react';
import { Globe, X, ExternalLink, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface MakerWorldBrowserModalProps {
  isOpen: boolean;
  url: string | null;
  productName?: string;
  onClose: () => void;
}

export const MakerWorldBrowserModal: React.FC<MakerWorldBrowserModalProps> = ({
  isOpen,
  url,
  productName,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !url) return null;

  const modelIdMatch = url.match(/\/models\/(\d+)/);
  const modelId = modelIdMatch ? modelIdMatch[1] : null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPopup = () => {
    window.open(url, 'MakerWorldViewer', 'width=1280,height=850,scrollbars=yes,resizable=yes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-4xl glass-card rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        
        {/* Top Navigation Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-bold text-white ml-2 hidden sm:inline truncate max-w-[220px]">
              {productName ? `MakerWorld - ${productName}` : 'Navegador MakerWorld'}
            </span>
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-xl flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/10 text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate flex-1 select-all">{url}</span>
            
            <button
              onClick={handleCopyUrl}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPopup}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
              title="Abrir ventana flotante"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Ventana Emergente</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Content Area */}
        <div className="p-8 bg-slate-950 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-[1px] shadow-2xl">
            <div className="w-full h-full bg-[#0A0D14] rounded-[23px] flex items-center justify-center">
              <Globe className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>
          </div>

          <div className="max-w-lg space-y-2">
            <h3 className="text-xl font-black text-white">
              {productName || 'Modelo de MakerWorld'}
            </h3>
            {modelId && (
              <p className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full inline-block border border-purple-500/20">
                Modelo ID: #{modelId}
              </p>
            )}
            <p className="text-xs text-slate-400 leading-relaxed pt-2">
              Debido a las políticas de seguridad oficiales de MakerWorld (<code className="text-amber-300">X-Frame-Options: SAMEORIGIN</code>), el servidor de MakerWorld impide incrustar la web en marcos dentro de otras páginas.
            </p>
          </div>

          {/* Action Card */}
          <div className="w-full max-w-md glass-card p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-purple-950/20 shadow-xl">
            <p className="text-xs font-bold text-slate-200">
              Selecciona cómo deseas visualizar el modelo:
            </p>

            <div className="space-y-3">
              <button
                onClick={handleOpenPopup}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:scale-102 text-white font-black text-xs shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir en Ventana Emergente (Flotante)</span>
              </button>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Abrir en Nueva Pestaña del Navegador</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
