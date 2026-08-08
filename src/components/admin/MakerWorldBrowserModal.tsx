import React, { useState } from 'react';
import { Globe, X, ExternalLink, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';

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
  const [iframeKey, setIframeKey] = useState(0);

  if (!isOpen || !url) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-6xl h-[92vh] glass-card rounded-3xl border border-cyan-500/30 shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        
        {/* Browser Top Navigation Bar */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-bold text-white ml-2 hidden sm:inline truncate max-w-[200px]">
              {productName ? `MakerWorld - ${productName}` : 'Navegador MakerWorld'}
            </span>
          </div>

          {/* URL Address Bar */}
          <div className="flex-1 max-w-2xl flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate flex-1 select-all">{url}</span>
            
            <button
              onClick={handleCopyUrl}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Recargar página"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all"
              title="Abrir en pestaña independiente"
            >
              <span className="hidden sm:inline">Pestaña Nueva</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Cerrar navegador"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Viewport Frame */}
        <div className="flex-1 bg-slate-950 relative">
          <iframe
            key={iframeKey}
            src={url}
            title={`MakerWorld Product Page - ${productName || ''}`}
            className="w-full h-full border-0 bg-white"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
};
