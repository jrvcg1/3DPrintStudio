import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, ShieldCheck, Box, RefreshCw, Download, Settings,
  Eye, EyeOff, Save, CheckCircle2, AlertTriangle, Layers, MessageSquare,
  Sparkles, Image as ImageIcon, Phone, Users, Mail, Calendar, Clock, UserX, Crown, LogOut,
  ShoppingBag, Check, CreditCard, Package, Truck, ArrowRight, Filter, MapPin, Globe
} from 'lucide-react';
import { ADMIN_PASSWORD } from '../../config/admin';
import { Product, ProductColor, getProductSku } from '../../types/product';
import { Category } from '../../types/category';
import { BusinessConfig } from '../../types/config';
import { Order, OrderStatus } from '../../types/order';
import { AppUser } from '../../types/user';
import { getUsers, deleteUserProfile, updateUserRole } from '../../services/userService';
import { subscribeAllOrders, updateOrderStatus } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { MakerWorldImportModal } from './MakerWorldImportModal';
import { MakerWorldBrowserModal } from './MakerWorldBrowserModal';
import { OrderChatModal } from '../orders/OrderChatModal';

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
  orders: initialOrders,
  onSaveProduct,
  onDeleteProduct,
  onSaveConfig,
  onSaveCategory,
  onResetDemoData
}) => {
  const { showToast } = useToast();
  const { user, appUser, loading: authLoading, authError, isAdmin, signInWithGoogle, logout } = useAdminAuth();

  // Component states
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'config' | 'categories' | 'users'>('orders');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMakerWorldOpen, setIsMakerWorldOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);
  const [browserTitle, setBrowserTitle] = useState<string | undefined>(undefined);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [configForm, setConfigForm] = useState<BusinessConfig>(config);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');

  // Real-time Orders & Chat state
  const [liveOrders, setLiveOrders] = useState<Order[]>(initialOrders || []);
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [chatOrder, setChatOrder] = useState<Order | null>(null);

  // Users management state
  const [users, setUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => { setConfigForm(config); }, [config]);

  // Subscribe to live orders when Admin panel is active
  useEffect(() => {
    if (isAdmin) {
      const unsubscribe = subscribeAllOrders((data) => {
        setLiveOrders(data);
      });
      return unsubscribe;
    }
  }, [isAdmin]);

  // Load users when tab is selected
  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      setUsersLoading(true);
      getUsers().then(data => {
        setUsers(data);
        setUsersLoading(false);
      }).catch(() => setUsersLoading(false));
    }
  }, [activeTab, isAdmin]);

  // --- Auth loading screen ---
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // --- Not logged in: show Google Sign-In ---
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 rounded-3xl border border-white/20 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
            <h2 className="text-xl font-black text-white">Panel de Administración</h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Acceso restringido. Inicia sesión con tu cuenta de administrador.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm transition-all active:scale-95 shadow-xl"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continuar con Google</span>
          </button>

          {authError && (
            <p className="text-xs text-red-400 text-center">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  // --- Logged in but NOT admin ---
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-card p-8 rounded-3xl border border-red-500/20 max-w-md w-full shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Acceso denegado</h2>
            <p className="text-xs text-slate-400 mt-2">
              Tu cuenta <span className="text-white font-bold">{appUser?.email || user.email}</span> no tiene permisos de administrador.
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
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
      price: 9.95,
      category: categories[0]?.slug || 'figuras',
      images: ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'],
      material: 'PLA Premium Ecológico',
      printTime: '4h 30m',
      layerHeight: '0.16mm',
      dimensions: '10 x 10 x 12 cm',
      weightGrams: 85,
      colors: [
        { name: 'Negro Mate', hex: '#1E293B' },
        { name: 'Blanco Seda', hex: '#F8FAFC' },
        { name: 'Cian Neón', hex: '#06B6D4' }
      ],
      isCustomizable: true,
      inStock: true,
      stock: 10,
      isActive: true,
      rating: 5.0,
      reviewCount: 1,
      makerworldId: '',
      designer: '3D Studio'
    });
    setIsFormOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsFormOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const finalProduct: Product = {
      id: editingProduct.id || 'prod-' + Date.now(),
      sku: editingProduct.sku || '3D-' + Math.floor(100 + Math.random() * 900),
      name: editingProduct.name,
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: editingProduct.description || '',
      longDescription: editingProduct.longDescription || editingProduct.description || '',
      price: editingProduct.price || 9.95,
      category: editingProduct.category || categories[0]?.slug || 'figuras',
      images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : ['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80'],
      material: editingProduct.material || 'PLA Premium',
      printTime: editingProduct.printTime || '3-5h',
      colors: editingProduct.colors || [{ name: 'Estándar', hex: '#3B82F6' }],
      isCustomizable: editingProduct.isCustomizable ?? true,
      inStock: editingProduct.inStock ?? true,
      stock: editingProduct.stock ?? 10,
      isActive: editingProduct.isActive ?? true,
      rating: editingProduct.rating || 5.0,
      reviewCount: editingProduct.reviewCount || 1,
      makerworldId: editingProduct.makerworldId || '',
      designer: editingProduct.designer || '3D Studio'
    };

    onSaveProduct(finalProduct);
    setIsFormOpen(false);
    showToast('Producto guardado correctamente', 'success');
  };

  const handleSaveConfigForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(configForm);
    showToast('Configuración del negocio actualizada', 'success');
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast('Estado del pedido actualizado y correo de notificación enviado', 'success');
  };

  // Filtered orders list
  const filteredOrders = liveOrders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const pendingApprovalCount = liveOrders.filter(o => o.status === 'pending_approval').length;
  const totalUnreadAdminMessages = liveOrders.reduce((acc, o) => acc + (o.unreadAdminMessagesCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="glass-card p-6 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-900/20 via-slate-900 to-blue-900/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-400 p-[1px]">
            <div className="w-full h-full bg-[#0A0D14] rounded-[15px] flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Panel de Control <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">Administrador</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Gestiona los pedidos de la web, mensajes en tiempo real, notificaciones por email y Bizum.
            </p>
          </div>
        </div>

        {/* Admin user info + logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            {appUser?.photoURL && (
              <img src={appUser.photoURL} alt={appUser.displayName} className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-400/50" />
            )}
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-white leading-none">{appUser?.displayName}</p>
              <p className="text-[10px] text-purple-300 flex items-center gap-0.5"><Crown className="w-2.5 h-2.5" /> Admin</p>
            </div>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="ml-1 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
            activeTab === 'orders'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-amber-400" />
          <span>Pedidos Web ({liveOrders.length})</span>
          {pendingApprovalCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] animate-pulse">
              {pendingApprovalCount} nuevos
            </span>
          )}
          {totalUnreadAdminMessages > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] animate-pulse flex items-center gap-0.5">
              <MessageSquare className="w-2.5 h-2.5" /> {totalUnreadAdminMessages}
            </span>
          )}
        </button>

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

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Usuarios {users.length > 0 ? `(${users.length})` : ''}</span>
        </button>
      </div>

      {/* TAB: ORDERS MANAGER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-bold mr-1">
              <Filter className="w-3.5 h-3.5" /> Filtrar:
            </span>
            {[
              { id: 'all', label: `Todos (${liveOrders.length})` },
              { id: 'pending_approval', label: `🟡 Pendientes Aceptación (${liveOrders.filter(o => o.status === 'pending_approval').length})` },
              { id: 'pending_payment', label: `💳 Pendientes Pago (${liveOrders.filter(o => o.status === 'pending_payment').length})` },
              { id: 'in_production', label: `⚙️ En Fabricación (${liveOrders.filter(o => o.status === 'in_production').length})` },
              { id: 'completed_pending_delivery', label: `📦 Listo Entrega (${liveOrders.filter(o => o.status === 'completed_pending_delivery').length})` },
              { id: 'delivered', label: `🚚 Entregados (${liveOrders.filter(o => o.status === 'delivered').length})` },
              { id: 'received', label: `✅ Recibidos (${liveOrders.filter(o => o.status === 'received').length})` },
              { id: 'cancelled', label: `❌ Cancelados (${liveOrders.filter(o => o.status === 'cancelled').length})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  orderFilter === f.id
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Table List (1 row per order) */}
          {filteredOrders.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-sm font-bold text-slate-300">No hay pedidos en este estado</p>
              <p className="text-xs text-slate-500">
                Los clientes que realicen un pedido desde la web o la app aparecerán aquí en tiempo real.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      <th className="p-4">Pedido / Fecha</th>
                      <th className="p-4">Cliente & Contacto</th>
                      <th className="p-4">Productos 3D</th>
                      <th className="p-4 text-right">Importe Total</th>
                      <th className="p-4 text-center">Estado</th>
                      <th className="p-4 text-right">Acciones / Gestión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map(ord => {
                      const unreadAdminCount = ord.unreadAdminMessagesCount || 0;
                      return (
                        <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                          {/* Nº Pedido & Fecha */}
                          <td className="p-4 align-top whitespace-nowrap">
                            <div className="font-mono text-sm font-black text-amber-300">
                              {ord.orderNumber}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-1">
                              {new Date(ord.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* Cliente & Contacto */}
                          <td className="p-4 align-top min-w-[200px]">
                            <div className="font-extrabold text-white text-xs">{ord.userName}</div>
                            <div className="text-slate-400 text-[11px] truncate max-w-[200px]">{ord.userEmail}</div>
                            {ord.contactPhone && (
                              <div className="text-cyan-300 font-mono font-bold text-[11px] mt-1">
                                📞 {ord.contactPhone}
                              </div>
                            )}
                            {ord.shippingAddress && (
                              <div className="text-slate-300 text-[11px] truncate max-w-[220px] mt-0.5">
                                📍 {ord.shippingAddress}
                              </div>
                            )}
                          </td>

                          {/* Productos 3D */}
                          <td className="p-4 align-top min-w-[240px]">
                            <div className="space-y-2">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2.5 bg-white/5 p-2 rounded-xl border border-white/5">
                                  {item.productImage && (
                                    <img src={item.productImage} alt="" className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10 shrink-0" />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="font-bold text-white text-xs truncate">{item.productName}</p>
                                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                                      <span>x<strong className="text-white">{item.quantity}</strong></span>
                                      {item.selectedColor && (
                                        <span className="px-1 py-0.2 rounded bg-slate-800 border border-white/10 text-cyan-300">
                                          {item.selectedColor}
                                        </span>
                                      )}
                                      {item.customText && (
                                        <span className="px-1 py-0.2 rounded bg-slate-800 border border-white/10 text-purple-300 uppercase">
                                          "{item.customText}"
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Importe Total */}
                          <td className="p-4 align-top text-right whitespace-nowrap">
                            <div className="text-base font-black text-amber-300">
                              {ord.totalAmount.toFixed(2)}€
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {ord.shippingCost > 0 ? `+${ord.shippingCost}€ envío` : 'Envío Gratis'}
                            </div>
                          </td>

                          {/* Estado */}
                          <td className="p-4 align-top text-center whitespace-nowrap">
                            <AdminStatusBadge status={ord.status} />
                          </td>

                          {/* Acciones / Gestión */}
                          <td className="p-4 align-top text-right whitespace-nowrap space-y-2">
                            <button
                              onClick={() => setChatOrder(ord)}
                              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all relative"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Chat Cliente</span>
                              {unreadAdminCount > 0 && (
                                <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px]">
                                  {unreadAdminCount}
                                </span>
                              )}
                            </button>

                            {ord.status === 'pending_approval' && (
                              <button
                                onClick={() => handleStatusChange(ord.id, 'pending_payment')}
                                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] shadow flex items-center justify-center gap-1 active:scale-95 transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aceptar Pedido</span>
                              </button>
                            )}

                            {ord.status === 'pending_payment' && (
                              <button
                                onClick={() => handleStatusChange(ord.id, 'in_production')}
                                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-[11px] shadow flex items-center justify-center gap-1 active:scale-95 transition-all"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>Confirmar Pago</span>
                              </button>
                            )}

                            {ord.status === 'in_production' && (
                              <button
                                onClick={() => handleStatusChange(ord.id, 'completed_pending_delivery')}
                                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[11px] shadow flex items-center justify-center gap-1 active:scale-95 transition-all"
                              >
                                <Package className="w-3.5 h-3.5" />
                                <span>Listo Entrega</span>
                              </button>
                            )}

                            {ord.status === 'completed_pending_delivery' && (
                              <button
                                onClick={() => handleStatusChange(ord.id, 'delivered')}
                                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-[11px] shadow flex items-center justify-center gap-1 active:scale-95 transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Marcar Entregado</span>
                              </button>
                            )}

                            {ord.status !== 'cancelled' ? (
                              <button
                                onClick={() => {
                                  if (confirm(`¿Estás seguro de que deseas cancelar el pedido ${ord.orderNumber}?`)) {
                                    handleStatusChange(ord.id, 'cancelled');
                                  }
                                }}
                                className="w-full py-1.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-all mt-1"
                                title="Cancelar pedido y notificar al cliente"
                              >
                                <X className="w-3.5 h-3.5 text-rose-400" />
                                <span>Cancelar Pedido</span>
                              </button>
                            ) : (
                              <div className="text-[11px] font-bold text-rose-400 text-center py-1">
                                ❌ Cancelado
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

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
                          {p.makerWorldUrl && (
                            <button
                              onClick={() => {
                                setBrowserUrl(p.makerWorldUrl || null);
                                setBrowserTitle(p.name);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all"
                              title="Abrir modelo en navegador MakerWorld integrado"
                            >
                              <Globe className="w-3.5 h-3.5 text-purple-400" />
                              <span>MakerWorld</span>
                            </button>
                          )}
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
                Número de Teléfono para Bizum y Pedidos (con prefijo):
              </label>
              <input
                type="text"
                value={configForm.whatsappNumber}
                onChange={e => setConfigForm({ ...configForm, whatsappNumber: e.target.value })}
                placeholder="Ej: 34600000000"
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-emerald-500/30 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono font-bold"
              />
              <span className="text-[11px] text-emerald-300/80 block">
                📱 Este número se le mostrará al cliente para realizar el pago por Bizum una vez aceptado su pedido.
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

      {/* TAB 5: USERS MANAGER */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-violet-400" />
                Usuarios Registrados
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Clientes que han iniciado sesión con Google en la tienda web o app móvil.
              </p>
            </div>
            <button
              onClick={() => { setUsersLoading(true); getUsers().then(d => { setUsers(d); setUsersLoading(false); }); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
          </div>

          {usersLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Cargando usuarios...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white/10 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-sm font-bold text-slate-300">Aún no hay usuarios registrados</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((u) => (
                <div
                  key={u.uid}
                  className="glass-card p-5 rounded-3xl border border-white/10 space-y-4 hover:border-violet-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    {u.photoURL ? (
                      <img src={u.photoURL} alt={u.displayName} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-lg font-black text-white">
                        {u.displayName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{u.displayName || 'Sin nombre'}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                          Google
                        </span>
                        {u.role === 'admin' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{u.email || 'Sin email'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span>Registrado: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const newRole = u.role === 'admin' ? 'user' : 'admin';
                        const msg = newRole === 'admin'
                          ? `¿Hacer administrador a ${u.displayName}?`
                          : `¿Quitar permisos de administrador a ${u.displayName}?`;
                        if (!confirm(msg)) return;
                        await updateUserRole(u.uid, newRole);
                        setUsers(prev => prev.map(x => x.uid === u.uid ? { ...x, role: newRole } : x));
                        showToast(newRole === 'admin' ? `${u.displayName} ahora es administrador` : `Permisos retirados a ${u.displayName}`, 'success');
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-purple-300'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>{u.role === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}</span>
                    </button>

                    <button
                      onClick={async () => {
                        if (!confirm(`¿Eliminar el perfil de ${u.displayName}?`)) return;
                        await deleteUserProfile(u.uid);
                        setUsers(prev => prev.filter(x => x.uid !== u.uid));
                        showToast('Perfil de usuario eliminado', 'success');
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <label className="text-xs font-bold text-slate-300 block mb-1">Enlace de MakerWorld (Opcional):</label>
                <input
                  type="text"
                  value={editingProduct.makerWorldUrl || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, makerWorldUrl: e.target.value })}
                  placeholder="https://makerworld.com/en/models/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono focus:outline-none focus:border-cyan-400"
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

      {/* REAL-TIME ORDER CHAT MODAL */}
      <OrderChatModal
        isOpen={!!chatOrder}
        order={chatOrder}
        onClose={() => setChatOrder(null)}
      />

      {/* EMBEDDED MAKERWORLD BROWSER MODAL */}
      <MakerWorldBrowserModal
        isOpen={!!browserUrl}
        url={browserUrl}
        productName={browserTitle}
        onClose={() => setBrowserUrl(null)}
      />
    </div>
  );
};

/* ─── Admin Status Badge Component ─── */
const AdminStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'pending_approval':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
          🟡 Pendiente Aceptación
        </span>
      );
    case 'pending_payment':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40">
          💳 Pendiente Pago (Bizum)
        </span>
      );
    case 'in_production':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
          ⚙️ En Fabricación
        </span>
      );
    case 'completed_pending_delivery':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
          📦 Listo para Entrega
        </span>
      );
    case 'delivered':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
          🚚 Entregado
        </span>
      );
    case 'received':
      return (
        <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          ✅ Recibido por Cliente
        </span>
      );
    default:
      return null;
  }
};
