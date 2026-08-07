import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Order, OrderStatus } from '../types/order';

const LOCAL_STORAGE_ORDERS_KEY = '3d_studio_orders';

const getLocalOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setLocalOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving local orders:', e);
  }
};

/**
 * Checks all delivered orders and auto-transitions to 'received' if deliveredAt is > 24 hours ago.
 */
export const checkAndApplyAutoReceive24h = async (orders: Order[]): Promise<Order[]> => {
  const now = new Date().getTime();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  let updatedAny = false;

  const updatedOrders = await Promise.all(
    orders.map(async (ord) => {
      if (ord.status === 'delivered' && ord.deliveredAt) {
        const deliveredTime = new Date(ord.deliveredAt).getTime();
        if (now - deliveredTime >= TWENTY_FOUR_HOURS_MS) {
          const autoReceivedAt = new Date().toISOString();
          const autoUpdated: Order = {
            ...ord,
            status: 'received',
            receivedAt: autoReceivedAt
          };
          updatedAny = true;

          // Update in Firestore
          if (isFirebaseConfigured && db) {
            try {
              await updateDoc(doc(db, 'orders', ord.id), {
                status: 'received',
                receivedAt: autoReceivedAt
              });
            } catch (e) {
              console.warn('Auto-receive Firestore update error:', e);
            }
          }
          return autoUpdated;
        }
      }
      return ord;
    })
  );

  if (updatedAny) {
    setLocalOrders(updatedOrders);
  }

  return updatedOrders;
};

/**
 * Create a new order in Firestore
 */
export const createOrder = async (order: Order): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (e) {
      console.warn('Firebase order creation error, using local fallback:', e);
    }
  }
  const current = getLocalOrders();
  current.unshift(order);
  setLocalOrders(current);
};

/**
 * Update order status with timestamp updates
 */
export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus,
  notes?: string
): Promise<void> => {
  const now = new Date().toISOString();
  const updates: Partial<Order> = { status: newStatus };

  if (notes !== undefined) updates.notes = notes;

  if (newStatus === 'pending_payment') updates.acceptedAt = now;
  if (newStatus === 'in_production') updates.inProductionAt = now;
  if (newStatus === 'delivered') updates.deliveredAt = now;
  if (newStatus === 'received') updates.receivedAt = now;

  if (isFirebaseConfigured && db) {
    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
    } catch (e) {
      console.warn('Firebase order status update error:', e);
    }
  }

  const current = getLocalOrders();
  const idx = current.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...updates };
    setLocalOrders(current);
  }
};

/**
 * Real-time listener for all orders (Admin panel)
 */
export const subscribeAllOrders = (onUpdate: (orders: Order[]) => void): (() => void) => {
  if (!isFirebaseConfigured || !db) {
    const local = getLocalOrders();
    onUpdate(local);
    return () => {};
  }

  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      async (snap) => {
        const rawOrders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        const checkedOrders = await checkAndApplyAutoReceive24h(rawOrders);
        setLocalOrders(checkedOrders);
        onUpdate(checkedOrders);
      },
      (err) => {
        console.warn('Orders snapshot error:', err);
        onUpdate(getLocalOrders());
      }
    );
  } catch (e) {
    console.warn('Orders subscription error:', e);
    onUpdate(getLocalOrders());
    return () => {};
  }
};

/**
 * Real-time listener for a specific user's orders (Client My Orders view)
 */
export const subscribeUserOrders = (userId: string, onUpdate: (orders: Order[]) => void): (() => void) => {
  if (!isFirebaseConfigured || !db || !userId) {
    const local = getLocalOrders().filter(o => o.userId === userId);
    onUpdate(local);
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(
      q,
      async (snap) => {
        const rawOrders = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
        const checkedOrders = await checkAndApplyAutoReceive24h(rawOrders);
        onUpdate(checkedOrders);
      },
      (err) => {
        console.warn('User orders snapshot error:', err);
        const local = getLocalOrders().filter(o => o.userId === userId);
        onUpdate(local);
      }
    );
  } catch (e) {
    console.warn('User orders subscription error:', e);
    const local = getLocalOrders().filter(o => o.userId === userId);
    onUpdate(local);
    return () => {};
  }
};
