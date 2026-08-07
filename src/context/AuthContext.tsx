import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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

    // Handle redirect result for browsers where popup was blocked
    getRedirectResult(auth)
      .then(result => { if (result?.user) syncUserToFirestore(result.user); })
      .catch(e => console.warn('Redirect result (safe to ignore):', e));

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
      setAuthError('Firebase Auth no está configurado. Comprueba las variables VITE_FIREBASE_*.');
      return;
    }
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-In error code:', err.code, err.message);

      if (err.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setAuthError(`El dominio "${currentDomain}" no está autorizado en Firebase Console -> Authentication -> Settings -> Authorized domains.`);
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('Google Sign-In no está habilitado en Firebase Console -> Authentication -> Sign-in method.');
      } else if (
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/operation-not-supported-in-this-environment' ||
        err.code === 'auth/cancelled-popup-request'
      ) {
        try {
          await signInWithRedirect(auth, provider);
        } catch {
          setAuthError('No se pudo abrir la ventana de Google. Permite las ventanas emergentes en tu navegador.');
        }
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Inicio de sesión cancelado al cerrar la ventana.');
      } else {
        setAuthError(`Error de autenticación (${err.code || 'desconocido'}). Revisa la consola de Firebase.`);
      }
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
