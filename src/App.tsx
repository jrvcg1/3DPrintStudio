import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';
import { Loader } from './components/common/Loader';
import { WebLoginScreen } from './components/auth/WebLoginScreen';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { MyOrdersModal } from './components/orders/MyOrdersModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { LegalPage, PrivacyPage } from './pages/LegalPage';
import { Product } from './types/product';
import { Category } from './types/category';
import { BusinessConfig } from './types/config';
import { Review, FAQItem } from './types/faq';
import { Order } from './types/order';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CONFIG,
  INITIAL_FAQS,
  INITIAL_REVIEWS
} from './services/mockData';
import {
  getProducts,
  getCategories,
  getBusinessConfig,
  getFAQs,
  getReviews,
  getOrders,
  saveProduct,
  deleteProduct,
  saveBusinessConfig,
  saveCategory,
  addReview,
  resetToMockData,
  subscribeProducts,
  subscribeCategories,
  subscribeBusinessConfig
} from './services/firebaseService';

export const AppContent: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [guestMode, setGuestMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Navigation State
  const [currentTab, setCurrentTab] = useState('home');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

  // Sync data asynchronously
  const syncData = async () => {
    try {
      const [prods, cats, conf, fqs, revs, ords] = await Promise.all([
        getProducts(),
        getCategories(),
        getBusinessConfig(),
        getFAQs(),
        getReviews(),
        getOrders()
      ]);
      if (prods && prods.length > 0) setProducts(prods);
      if (cats && cats.length > 0) setCategories(cats);
      if (conf) setConfig(conf);
      if (fqs && fqs.length > 0) setFaqs(fqs);
      if (revs && revs.length > 0) setReviews(revs);
      if (ords) setOrders(ords);
    } catch (e) {
      console.warn('Error sincronizando datos:', e);
    }
  };

  useEffect(() => {
    syncData();

    // Realtime subscribers for instant catalog updates across all devices & APK
    const unsubProds = subscribeProducts((liveProducts) => {
      setProducts(liveProducts);
    });

    const unsubCats = subscribeCategories((liveCats) => {
      setCategories(liveCats);
    });

    const unsubConfig = subscribeBusinessConfig((liveConfig) => {
      if (liveConfig) setConfig(liveConfig);
    });

    return () => {
      unsubProds();
      unsubCats();
      unsubConfig();
    };
  }, []);

  const handleNavigate = (tab: string, categoryFilter?: string) => {
    setCurrentTab(tab);
    if (categoryFilter !== undefined) {
      setCatalogCategoryFilter(categoryFilter);
    } else if (tab !== 'catalog') {
      setCatalogCategoryFilter('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handlers para el Panel de Administración
  const handleSaveProduct = async (p: Product) => {
    await saveProduct(p);
    await syncData();
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    await syncData();
  };

  const handleSaveConfig = async (newConfig: BusinessConfig) => {
    await saveBusinessConfig(newConfig);
    setConfig(newConfig);
  };

  const handleSaveCategory = async (cat: Category) => {
    await saveCategory(cat);
    await syncData();
  };

  const handleAddReview = async (rev: Review) => {
    await addReview(rev);
    setReviews(prev => [rev, ...prev]);
  };

  const handleResetDemoData = async () => {
    resetToMockData();
    await syncData();
  };

  // Step 1: Checking previous Firebase session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center">
        <Loader text="Verificando sesión previa..." />
      </div>
    );
  }

  // Step 2: If user is NOT logged in and has NOT chosen guest mode, show Login/Signup screen
  if (!isAuthenticated && !guestMode) {
    return <WebLoginScreen onContinueAsGuest={() => setGuestMode(true)} />;
  }

  // Step 3: Loading shop data fallback
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center">
        <Loader text="Cargando 3D Print Studio..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-[#0A0D14] bg-[#0A0D14] text-slate-100">
      {/* Header */}
      <Header
        config={config}
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => handleNavigate('catalog')}
        onOpenLogin={() => setGuestMode(false)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            reviews={reviews}
            faqs={faqs}
            config={config}
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
            onAddReview={handleAddReview}
          />
        )}

        {currentTab === 'catalog' && (
          <CatalogPage
            products={products}
            categories={categories}
            config={config}
            initialCategory={catalogCategoryFilter}
            onSelectProduct={setSelectedProduct}
          />
        )}

        {(currentTab === 'process' || currentTab === 'faqs') && (
          <HomePage
            products={products}
            categories={categories}
            reviews={reviews}
            faqs={faqs}
            config={config}
            onNavigate={handleNavigate}
            onSelectProduct={setSelectedProduct}
            onAddReview={handleAddReview}
          />
        )}

        {currentTab === 'admin' && (
          <AdminPanel
            products={products}
            categories={categories}
            config={config}
            orders={orders}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onSaveConfig={handleSaveConfig}
            onSaveCategory={handleSaveCategory}
            onResetDemoData={handleResetDemoData}
          />
        )}

        {currentTab === 'legal' && <LegalPage />}
        {currentTab === 'privacy' && <PrivacyPage />}
      </main>

      {/* Footer */}
      <Footer config={config} onNavigate={handleNavigate} />

      {/* Floating WhatsApp CTA Button */}
      <FloatingWhatsAppButton whatsappNumber={config.whatsappNumber} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        config={config}
        onClose={() => setSelectedProduct(null)}
        onOrderSuccess={(newOrder) => {
          setSelectedProduct(null);
          setIsMyOrdersOpen(true);
        }}
        onRequireAuth={() => {
          setSelectedProduct(null);
          setGuestMode(false);
        }}
      />

      {/* My Orders Modal */}
      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        onAddReview={handleAddReview}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
