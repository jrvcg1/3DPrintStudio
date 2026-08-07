import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { AppUser } from '../types/user';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  authError: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Backwards compatibility alias for AdminPanel
export const useAdminAuth = useAuth;

/**
 * Creates or updates user in Firestore 'users' collection.
 * Preserves existing roles ('admin' or 'user').
 * Default role for new users is 'user'.
 */
const syncUserToFirestore = async (user: User): Promise<AppUser> => {
  const now = new Date().toISOString();
  const fallbackProfile: AppUser = {
    uid: user.uid,
    displayName: user.displayName || 'Cliente',
    email: user.email || '',
    photoURL: user.photoURL || '',
    provider: 'google',
    role: 'user',
    createdAt: now,
    lastLoginAt: now,
    orderCount: 0
  };

  if (!db || !isFirebaseConfigured) return fallbackProfile;

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // First signup — store user profile with default role 'user'
      await setDoc(userRef, fallbackProfile);
      return fallbackProfile;
    } else {
      // Existing user — update last login timestamp but retain existing role
      const existing = snap.data() as AppUser;
      const updated: AppUser = {
        ...existing,
        displayName: user.displayName || existing.displayName,
        photoURL: user.photoURL || existing.photoURL,
        lastLoginAt: now
      };
      await setDoc(userRef, { lastLoginAt: now }, { merge: true });
      return updated;
    }
  } catch (e) {
    console.warn('Error syncing user profile to Firestore:', e);
    return fallbackProfile;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Subscribe to auth state — auto-logins user if previously authenticated
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await syncUserToFirestore(firebaseUser);
        setAppUser(profile);
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    if (!auth) {
      setAuthError('Firebase Auth no está configurado.');
      return;
    }
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setAuthError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
    }
  };

  const logout = async (): Promise<void> => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Logout error:', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      appUser,
      loading,
      authError,
      isAdmin: appUser?.role === 'admin',
      isAuthenticated: !!user,
      signInWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Re-export AuthProvider as AdminAuthProvider for legacy imports
export const AdminAuthProvider = AuthProvider;
