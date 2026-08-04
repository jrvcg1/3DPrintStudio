import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AppUser } from '../types/user';

interface AdminAuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = (): AdminAuthContextType => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

const fetchUserProfile = async (user: User): Promise<AppUser | null> => {
  if (!db || !isFirebaseConfigured) return null;
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    return snap.exists() ? (snap.data() as AppUser) : null;
  } catch {
    return null;
  }
};

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser]         = useState<User | null>(null);
  const [appUser, setAppUser]   = useState<AppUser | null>(null);
  const [loading, setLoading]   = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser);
        setAppUser(profile);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) { setAuthError('Firebase Auth no configurado.'); return; }
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setAuthError('Error al iniciar sesión con Google.');
      console.error('Admin Google Sign-In error:', err);
    }
  };

  const logout = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return (
    <AdminAuthContext.Provider value={{
      user,
      appUser,
      loading,
      authError,
      isAdmin: appUser?.role === 'admin',
      signInWithGoogle,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
