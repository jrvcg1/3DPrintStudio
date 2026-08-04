import { collection, getDocs, deleteDoc, doc, setDoc, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { AppUser } from '../types/user';

export const getUsers = async (): Promise<AppUser[]> => {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AppUser);
  } catch (e) {
    console.warn('Error fetching users:', e);
    return [];
  }
};

export const updateUserRole = async (uid: string, role: 'admin' | 'user'): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    await setDoc(doc(db, 'users', uid), { role }, { merge: true });
  } catch (e) {
    console.warn('Error updating user role:', e);
  }
};

export const deleteUserProfile = async (uid: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (e) {
    console.warn('Error deleting user profile:', e);
  }
};
