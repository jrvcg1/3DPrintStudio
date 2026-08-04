import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, ShieldCheck, Box, RefreshCw, Download, Settings,
  Eye, EyeOff, Save, CheckCircle2, AlertTriangle, Layers, MessageSquare, Sparkles, Image as ImageIcon, Phone
} from 'lucide-react';
import { ADMIN_PASSWORD } from '../../config/admin';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { Category } from '../../types/category';
import { BusinessConfig } from '../../types/config';
import { Order } from '../../types/order';
import { useToast } from '../../context/ToastContext';
import { MakerWorldImportModal } from './MakerWorldImportModal';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  config: BusinessConfig;
  orders: Order[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onSaveConfig: (config: BusinessConfig) => void;
  onSaveCategory: (category: Category) => void;
  onResetDemoData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  config,
  orders,
  onSaveProduct,
  onDeleteProduct,
  onSaveConfig,
  onSaveCategory,
  onResetDemoData
}) => {
  const { showToast } = useToast();

  // ---- Admin authentication ----
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // Other component states (must be declared at top level to satisfy Rules of Hooks)
  const [activeTab, setActiveTab] = useState<'products' | 'config' | 'categories' | 'orders'>('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMakerWorldOpen, setIsMakerWorldOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [configForm, setConfigForm] = useState<BusinessConfig>(config);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');

  useEffect(() => {
    setConfigForm(config);
  }, [config]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      showToast('Acceso concedido', 'success');
    } else {
      showToast('Contraseña incorrecta', 'error');
    }
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleAuthSubmit} className="glass-card p-8 rounded-3xl border border-white/20 max-w-md w-full shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 mx-auto">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2 text-center">Acceso Administrador</h2>
          <p className="text-xs text-slate-400 text-center mb-6">Introduce la clave de acceso para gestionar la tienda.</p>
          <input
            type="password"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
            placeholder="Contraseña de administrador"
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white mb-4 focus:outline-none focus:border-cyan-400 text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    );
  }

  /* ==========================================================
     PRODUCT FORM HANDLERS
     ========================================================== */
  const handleOpenNewProduct = () => {
    setEditingProduct({
      id: 'prod-' + Date.now(),
      sku: '3D-' + Math.floor(100 + Math.random() * 900),
      name: '',
      slug: '',
      description: '',
      longDescription: '',
      price: 9.99,
      category: categories[0]?.slug || 'general',
      images: ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'],
      colors: [
        { name: 'Azul Eléctrico', hex: '#3B82F6' },
        { name: 'Negro Mate', hex: '#111827' }
      ],
      printTime: '3 horas',
      material: 'PLA Premium Biodegradable',
      isCustomizable: true,
      isFeatured: false,
      isActive: true,
      stock: 10,
      popularity: 50,
      createdAt: new Date().toISOString()
    });
    setIsFormOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsFormOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;

    const slug = editingProduct.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const finalProduct: Product = {
      id: editingProduct.id || 'prod-' + Date.now(),
      sku: editingProduct.sku || `3D-${Math.floor(100 + Math.random() * 900)}`,
      name: editingProduct.name,
      slug: slug || 'producto-3d',
      description: editingProduct.description || 'Producto 3D de alta calidad.',
      longDescription: editingProduct.longDescription || editingProduct.description || '',
      price: Number(editingProduct.price),
      category: editingProduct.category || categories[0]?.slug || 'general',
      images: editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'],
      colors: editingProduct.colors || [],
      printTime: editingProduct.printTime || '2 horas',
      material: editingProduct.material || 'PLA Ecológico',
      isCustomizable: editingProduct.isCustomizable ?? true,
      isFeatured: editingProduct.isFeatured ?? false,
      isActive: editingProduct.isActive ?? true,
      stock: Number(editingProduct.stock || 10),
      popularity: editingProduct.popularity || 50,
      createdAt: editingProduct.createdAt || new Date().toISOString()
    };

    onSaveProduct(finalProduct);
    showToast('¡Producto guardado con éxito!', 'success');
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  /* ==========================================================
     CONFIG HANDLERS
     ========================================================== */
  const handleSaveConfigForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(configForm);
    showToast('Configuración del negocio actualizada', 'success');
  };

  /* ==========================================================
     CSV EXPORT HANDLER
     ========================================================== */
  const handleExportCSV = () => {
    const headers = ['ID', 'Nombre', 'Precio', 'Categoria', 'Stock', 'Activo'];
    const rows = products.map(p => [p.id, `"${p.name}"`, p.price, p.category, p.stock, p.isActive ? 'SI' : 'NO']);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `productos_3d_studio_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Catálogo exportado a CSV', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner Teen-Friendly */}
      <div className="glass-card p-6 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-900/20 via-slate-900 to-blue-900/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#0A0D14] rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Panel de Control <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">Modo Emprendedor</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Diseñado para ser extremadamente fácil de usar. Gestiona tus productos, precios y WhatsApp en segundos.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setActiveTab('config')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm"
                title="Haz clic para modificar el teléfono de pedidos"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Teléfono de Pedidos: +{config.whatsappNumber}</span>
                <Edit className="w-3 h-3 ml-1 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Seguro que deseas restaurar los productos iniciales de ejemplo?')) {
                onResetDemoData();
                showToast('Datos de demostración restaurados', 'info');
              }
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span>Restaurar Muestra</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Productos ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'config'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Configuración Negocio</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'categories'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categorías ({categories.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white">Listado de Productos 3D</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsMakerWorldOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Importar de MakerWorld</span>
              </button>

              <button
                onClick={handleOpenNewProduct}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir Manualmente</span>
              </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-extrabold border-b border-white/10">
                  <tr>
                    <th className="p-4">Ref / ID</th>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Tiempo</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-cyan-300 text-xs">
                        <span className="px-2 py-1 rounded-lg bg-slate-800 border border-white/10">
                          {getProductSku(p)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-white flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <span className="block font-bold text-slate-100">{p.name}</span>
                          {p.isFeatured && (
                            <span className="text-[10px] text-cyan-400 font-extrabold uppercase">★ Destacado</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 capitalize text-slate-400">{p.category}</td>
                      <td className="p-4 font-black text-white text-sm">{p.price.toFixed(2)}€</td>
                      <td className="p-4 text-slate-400">{p.printTime}</td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            onSaveProduct({ ...p, isActive: !p.isActive });
                            showToast(p.isActive ? 'Producto deshabilitado' : 'Producto activado', 'info');
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            p.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{p.isActive ? 'Activo' : 'Oculto'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10"
                            title="Editar producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`¿Eliminar ${p.name}?`)) {
                                onDeleteProduct(p.id);
                                showToast('Producto eliminado', 'error');
                              }
                            }}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONFIG MANAGER */}
      {activeTab === 'config' && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            Configuración General del Negocio
          </h2>

          <form onSubmit={handleSaveConfigForm} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Nombre de la Tienda:</label>
              <input
                type="text"
                value={configForm.storeName}
                onChange={e => setConfigForm({ ...configForm, storeName: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <label className="text-xs font-bold uppercase text-emerald-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                Número de WhatsApp para Pedidos (con prefijo de país):
              </label>
              <input
                type="text"
                value={configForm.whatsappNumber}
                onChange={e => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                placeholder="Ej: 34600000000"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono font-bold"
              />
              <span className="text-[11px] text-emerald-300/80 block">
                📱 En este número recibirás los mensajes instantáneos de cada cliente cuando pulsen "Pedir por WhatsApp".
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Banner Promocional Superior:</label>
              <input
                type="text"
                value={configForm.announcementBanner || ''}
                onChange={e => setConfigForm({ ...configForm, announcementBanner: e.target.value })}
                placeholder="Ej: 🚀 Envíos gratis en pedidos mayores a 30€"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Categorías Actuales</h3>
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.description}</span>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {c.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Añadir Nueva Categoría</h3>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newCatName.trim()) return;
                const cat: Category = {
                  id: 'cat-' + Date.now(),
                  name: newCatName.trim(),
                  slug: newCatName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
                  iconName: 'Box',
                  description: newCatDescription.trim() || 'Categoría de productos 3D'
                };
                onSaveCategory(cat);
                setNewCatName('');
                setNewCatDescription('');
                showToast('Categoría creada', 'success');
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre de la Categoría:</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="Ej: Lámparas 3D"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descripción:</label>
                <input
                  type="text"
                  value={newCatDescription}
                  onChange={e => setNewCatDescription(e.target.value)}
                  placeholder="Ej: Iluminación y litofanías personalizadas"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-md"
              >
                Crear Categoría
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {isFormOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-card p-6 md:p-8 rounded-3xl border border-white/20 shadow-2xl my-8">
            <h3 className="text-xl font-black text-white mb-6">
              {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto 3D'}
            </h3>

            <form onSubmit={handleSaveProductForm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">ID Único / Ref:</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    placeholder="Ej: 3D-101"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Nombre del Producto:</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ej: Llavero Nombre 3D"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Precio (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Categoría:</label>
                  <select
                    value={editingProduct.category || categories[0]?.slug}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tiempo Estimado Impresión:</label>
                  <input
                    type="text"
                    value={editingProduct.printTime || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, printTime: e.target.value })}
                    placeholder="Ej: 4 horas"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">URL de la Foto Principal:</label>
                <input
                  type="text"
                  value={editingProduct.images ? editingProduct.images[0] : ''}
                  onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Descripción Breve:</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isCustomizable ?? true}
                    onChange={e => setEditingProduct({ ...editingProduct, isCustomizable: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500"
                  />
                  <span>Personalizable por el cliente</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured ?? false}
                    onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-500"
                  />
                  <span>Producto Destacado</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-sm shadow-md"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MAKERWORLD IMPORT MODAL */}
      <MakerWorldImportModal
        isOpen={isMakerWorldOpen}
        onClose={() => setIsMakerWorldOpen(false)}
        categories={categories}
        onImportSuccess={(draftProduct) => {
          setEditingProduct(draftProduct);
          setIsFormOpen(true);
        }}
      />
    </div>
  );
};
