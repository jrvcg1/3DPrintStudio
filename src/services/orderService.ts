import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  arrayUnion
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Order, OrderStatus, OrderMessage } from '../types/order';
import { sendOrderStatusEmailNotification, sendNewMessageEmailNotification } from './emailService';

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
          // Send notification email
          sendOrderStatusEmailNotification(autoUpdated, 'received');
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
 * Create a new order in Firestore & send confirmation email
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

  // Send initial order confirmation email
  sendOrderStatusEmailNotification(order, 'pending_approval');
};

/**
 * Update order status with timestamp updates & dispatch email notification
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

  let targetOrder: Order | null = null;

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'orders', orderId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        targetOrder = { id: snap.id, ...snap.data() } as Order;
      }
      await updateDoc(ref, updates);
    } catch (e) {
      console.warn('Firebase order status update error:', e);
    }
  }

  const current = getLocalOrders();
  const idx = current.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    if (!targetOrder) targetOrder = current[idx];
    current[idx] = { ...current[idx], ...updates };
    setLocalOrders(current);
  }

  // Trigger Email Notification on Status Change
  if (targetOrder) {
    const updatedOrderObj = { ...targetOrder, ...updates };
    sendOrderStatusEmailNotification(updatedOrderObj, newStatus);
  }
};

/**
 * Send an in-app message / question on a specific order
 */
export const sendOrderMessage = async (
  orderId: string,
  senderId: string,
  senderName: string,
  senderRole: 'admin' | 'user',
  text: string
): Promise<void> => {
  if (!text.trim()) return;

  const now = new Date().toISOString();
  const newMessage: OrderMessage = {
    id: 'msg-' + Date.now(),
    orderId,
    senderId,
    senderName,
    senderRole,
    text: text.trim(),
    timestamp: now,
    isReadByClient: senderRole === 'user',
    isReadByAdmin: senderRole === 'admin'
  };

  let targetOrder: Order | null = null;

  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'orders', orderId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        targetOrder = { id: snap.id, ...snap.data() } as Order;
        const currentUnread = senderRole === 'admin'
          ? (targetOrder.unreadClientMessagesCount || 0) + 1
          : (targetOrder.unreadAdminMessagesCount || 0) + 1;

        await updateDoc(ref, {
          messages: arrayUnion(newMessage),
          ...(senderRole === 'admin'
            ? { unreadClientMessagesCount: currentUnread }
            : { unreadAdminMessagesCount: currentUnread })
        });
      }
    } catch (e) {
      console.warn('Error sending order message to Firestore:', e);
    }
  }

  // Local storage fallback
  const current = getLocalOrders();
  const idx = current.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    if (!targetOrder) targetOrder = current[idx];
    const msgs = current[idx].messages || [];
    msgs.push(newMessage);
    current[idx].messages = msgs;
    setLocalOrders(current);
  }

  // If Admin sent the message, dispatch Email Notification to client
  if (senderRole === 'admin' && targetOrder) {
    sendNewMessageEmailNotification(targetOrder, newMessage);
  }
};

/**
 * Mark messages as read by role (admin or client)
 */
export const markOrderMessagesAsRead = async (
  orderId: string,
  role: 'admin' | 'user'
): Promise<void> => {
  if (isFirebaseConfigured && db) {
    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, {
        ...(role === 'admin' ? { unreadAdminMessagesCount: 0 } : { unreadClientMessagesCount: 0 })
      });
    } catch (e) {
      console.warn('Error marking messages as read:', e);
    }
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
