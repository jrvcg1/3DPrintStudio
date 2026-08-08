import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Order } from '../types/order';
import { BusinessConfig } from '../types/config';
import { FAQItem, Review } from '../types/faq';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CONFIG,
  INITIAL_FAQS,
  INITIAL_REVIEWS
} from './mockData';

// Local Storage Keys for offline / fallback mode
const STORAGE_KEYS = {
  PRODUCTS: '3d_studio_products',
  CATEGORIES: '3d_studio_categories',
  CONFIG: '3d_studio_config',
  FAQS: '3d_studio_faqs',
  REVIEWS: '3d_studio_reviews',
  ORDERS: '3d_studio_orders',
};

// Helper: Local Storage Storage Layer
const getLocalData = <T>(key: string, defaultVal: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultVal;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
};

// Seed Local Data if Empty
export const initializeDataStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setLocalData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
    setLocalData(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
    setLocalData(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    setLocalData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setLocalData(STORAGE_KEYS.ORDERS, []);
  }
};

// Execute initialization
initializeDataStorage();

/* ==========================================================================
   PRODUCTS SERVICE
   ========================================================================== */
export const getProducts = async (): Promise<Product[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      if (snapshot.empty) {
        setLocalData(STORAGE_KEYS.PRODUCTS, []);
        return [];
      }
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      return prods.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } catch (error) {
      console.warn('Firebase query failed, using local storage fallback:', error);
    }
  }
  return getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
};

export const subscribeProducts = (callback: (products: Product[]) => void) => {
  if (!db || !isFirebaseConfigured) {
    const local = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    callback(local);
    return () => {};
  }

  const colRef = collection(db, 'products');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        setLocalData(STORAGE_KEYS.PRODUCTS, []);
        callback([]);
        return;
      }
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      prods.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      setLocalData(STORAGE_KEYS.PRODUCTS, prods);
      callback(prods);
    },
    (err) => {
      console.warn('Realtime products subscription warning:', err);
      const local = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
      callback(local);
    }
  );
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
};

export const saveProduct = async (product: Product): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      console.warn('Failed to save product in Firebase, falling back to local storage:', e);
    }
  }
  const products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const existingIdx = products.findIndex(p => p.id === product.id);
  if (existingIdx >= 0) {
    products[existingIdx] = product;
  } else {
    products.unshift(product);
  }
  setLocalData(STORAGE_KEYS.PRODUCTS, products);
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Failed to delete product in Firebase:', e);
    }
  }
  const products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const filtered = products.filter(p => p.id !== id);
  setLocalData(STORAGE_KEYS.PRODUCTS, filtered);
};

/* ==========================================================================
   CATEGORIES SERVICE
   ========================================================================== */
export const getCategories = async (): Promise<Category[]> => {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      }
    } catch (e) {
      console.warn('Firebase categories fetch failed:', e);
    }
  }
  return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
};

export const subscribeCategories = (callback: (categories: Category[]) => void) => {
  if (!db || !isFirebaseConfigured) {
    const local = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    callback(local);
    return () => {};
  }

  const colRef = collection(db, 'categories');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        const local = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
        callback(local);
        return;
      }
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setLocalData(STORAGE_KEYS.CATEGORIES, cats);
      callback(cats);
    },
    (err) => {
      console.warn('Realtime categories subscription warning:', err);
      const local = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      callback(local);
    }
  );
};

export const saveCategory = async (category: Category): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (e) {
      console.warn('Firebase category save failed:', e);
    }
  }
  const categories = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  const existingIdx = categories.findIndex(c => c.id === category.id);
  if (existingIdx >= 0) {
    categories[existingIdx] = category;
  } else {
    categories.push(category);
  }
  setLocalData(STORAGE_KEYS.CATEGORIES, categories);
};

/* ==========================================================================
   BUSINESS CONFIG SERVICE
   ========================================================================== */
export const getBusinessConfig = async (): Promise<BusinessConfig> => {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'config', 'general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as BusinessConfig;
      }
    } catch (e) {
      console.warn('Firebase config fetch failed:', e);
    }
  }
  return getLocalData<BusinessConfig>(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
};

export const saveBusinessConfig = async (config: BusinessConfig): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'config', 'general'), config);
    } catch (e) {
      console.warn('Firebase config save failed:', e);
    }
  }
  setLocalData(STORAGE_KEYS.CONFIG, config);
};

/* ==========================================================================
   FAQS & REVIEWS SERVICE
   ========================================================================== */
export const getFAQs = async (): Promise<FAQItem[]> => {
  return getLocalData<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
};

export const getReviews = async (): Promise<Review[]> => {
  return getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
};

export const addReview = async (review: Review): Promise<void> => {
  const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  reviews.unshift(review);
  setLocalData(STORAGE_KEYS.REVIEWS, reviews);
};

/* ==========================================================================
   ORDERS SERVICE
   ========================================================================== */
export const getOrders = async (): Promise<Order[]> => {
  return getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
};

export const logOrder = async (order: Order): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (e) {
      console.warn('Firebase order log failed:', e);
    }
  }
  const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
  orders.unshift(order);
  setLocalData(STORAGE_KEYS.ORDERS, orders);
};

export const resetToMockData = (): void => {
  setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setLocalData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  setLocalData(STORAGE_KEYS.CONFIG, INITIAL_CONFIG);
  setLocalData(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  setLocalData(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  setLocalData(STORAGE_KEYS.ORDERS, []);
};
