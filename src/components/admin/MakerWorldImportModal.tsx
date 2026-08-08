import React, { useState } from 'react';
import { Sparkles, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle, ArrowRight, X, Image as ImageIcon, Tag, Clock } from 'lucide-react';
import { Category } from '../../types/category';
import { Product } from '../../types/product';
import { fetchMakerWorldProduct, MakerWorldImportResult } from '../../services/makerworldService';
import { useToast } from '../../context/ToastContext';

interface MakerWorldImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onImportSuccess: (productDraft: Partial<Product>) => void;
}

export const MakerWorldImportModal: React.FC<MakerWorldImportModalProps> = ({
  isOpen,
  onClose,
  categories,
  onImportSuccess
}) => {
  const { showToast } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<MakerWorldImportResult | null>(null);
  const [customPrice, setCustomPrice] = useState<number>(11.99);

  if (!isOpen) return null;

  const handleExtract = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) {
      setError('Por favor, introduce un enlace de MakerWorld');
      return;
    }

    setError(null);
    setLoading(true);
    setExtractedData(null);

    try {
      const data = await fetchMakerWorldProduct(urlInput.trim(), categories);
      setExtractedData(data);
      showToast('¡Datos extraídos con éxito!', 'success');
    } catch (err: any) {
      setError(err.message || 'Error al importar datos de MakerWorld.');
      showToast('No se pudieron extraer los datos del modelo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToProduct = () => {
    if (!extractedData) return;

    const slug = extractedData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');

    const productDraft: Partial<Product> = {
      id: 'prod-mw-' + Date.now(),
      sku: '3D-' + (extractedData.modelId || Math.floor(1000 + Math.random() * 9000)),
      name: extractedData.title,
      slug: slug || 'producto-makerworld',
      description: extractedData.description,
      longDescription: extractedData.longDescription,
      price: customPrice,
      category: extractedData.suggestedCategorySlug,
      images: extractedData.images,
      makerWorldUrl: extractedData.modelUrl || urlInput.trim(),
      colors: [
        { name: 'Negro Mate', hex: '#111827' },
        { name: 'Blanco Nieve', hex: '#F9FAFB' },
        { name: 'Azul Neón', hex: '#2563EB' }
      ],
      printTime: extractedData.printTime,
      material: extractedData.material,
      isCustomizable: true,
      isFeatured: false,
      isActive: true,
      stock: 10,
      popularity: 60,
      createdAt: new Date().toISOString()
    };

    onImportSuccess(productDraft);
    onClose();
    // Reset modal state
    setUrlInput('');
    setExtractedData(null);
  };

  const handleSampleClick = () => {
    setUrlInput('https://makerworld.com/en/models/441051-names?from=search#profileId-346769');
  };

  const categoryObj = categories.find(c => c.slug === extractedData?.suggestedCategorySlug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl glass-card p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
            <div className="w-full h-full bg-[#0A0D14] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              Importador Rápido MakerWorld
            </h3>
            <p className="text-xs text-slate-400">
              Pega el enlace de un modelo 3D y extrae título, fotos, categoría y tiempos automáticamente.
            </p>
          </div>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleExtract} className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              URL del Modelo (makerworld.com):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://makerworld.com/en/models/441051-names..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 flex items-center gap-2 shrink-0 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extrayendo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extraer Datos</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick sample button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Prueba con un ejemplo:</span>
            <button
              type="button"
              onClick={handleSampleClick}
              className="text-[11px] text-cyan-400 hover:underline font-semibold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20"
            >
              Modelo 441051 (Nombres / Hogar & Decoración)
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Extracted Preview Card */}
        {extractedData && (
          <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-900/60 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Información Detectada
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ID: {extractedData.modelUrl.match(/\/models\/(\d+)/)?.[1]}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Cover Image Preview */}
              <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-950">
                <img
                  src={extractedData.images[0]}
                  alt={extractedData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-slate-200 font-bold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-cyan-400" />
                  <span>{extractedData.images.length} fotos</span>
                </div>
              </div>

              {/* Data Summary */}
              <div className="space-y-3 flex-1">
                <h4 className="text-base font-black text-white">{extractedData.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{extractedData.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {/* Spanish Translation Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    🇪🇸 Traducido al Español
                  </span>

                  {/* SKU Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-slate-200 border border-white/20">
                    Ref: #3D-{extractedData.modelId}
                  </span>

                  {/* Category Tag */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <Tag className="w-3 h-3 text-purple-400" />
                    Categoría: {categoryObj?.name || extractedData.suggestedCategorySlug}
                  </span>

                  {/* Print Time Tag */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Tiempo: {extractedData.printTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom Price Setting */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Establecer Precio de Venta en la Tienda (€):
                </label>
                <input
                  type="number"
                  step="0.50"
                  value={customPrice}
                  onChange={e => setCustomPrice(parseFloat(e.target.value) || 0)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-black text-base w-36 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="button"
                onClick={handleApplyToProduct}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 transition-all"
              >
                <span>Cargar en el Formulario de Producto</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
