import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
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
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const syncUserToFirestore = async (user: User): Promise<AppUser> => {
  const now = new Date().toISOString();
  const fallbackProfile: AppUser = {
    uid: user.uid,
    displayName: user.displayName || 'Cliente',
    email: user.email || '',
    photoURL: user.photoURL || '',
    provider: user.providerData[0]?.providerId || 'google',
    role: user.email === 'jrvcg1@gmail.com' ? 'admin' : 'user',
    createdAt: now,
    lastLoginAt: now,
    orderCount: 0
  };

  if (!db || !isFirebaseConfigured) return fallbackProfile;

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, fallbackProfile);
      return fallbackProfile;
    } else {
      const existing = snap.data() as AppUser;
      const role = user.email === 'jrvcg1@gmail.com' ? 'admin' : (existing.role || 'user');
      const updated: AppUser = {
        ...existing,
        displayName: user.displayName || existing.displayName,
        photoURL: user.photoURL || existing.photoURL,
        role,
        lastLoginAt: now
      };
      await setDoc(userRef, { lastLoginAt: now, role }, { merge: true });
      return updated;
    }
  } catch (e) {
    console.warn('Error syncing user to Firestore:', e);
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

    try {
      setPersistence(auth, browserLocalPersistence).catch(() => {});
    } catch {
      // fallback
    }

    try {
      getRedirectResult(auth)
        .then(result => { if (result?.user) syncUserToFirestore(result.user); })
        .catch(err => console.info('Handled redirect check:', err?.message || 'No redirect pending'));
    } catch {
      // safe fallback
    }

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
    if (!auth) { setAuthError('Firebase Auth no está configurado.'); return; }
    setAuthError(null);

    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.warn('Google Sign-In error:', err?.code, err?.message);

      if (
        err?.code === 'auth/popup-blocked' ||
        err?.code === 'auth/operation-not-supported-in-this-environment' ||
        err?.code === 'auth/disallowed-useragent' ||
        err?.code === 'auth/unauthorized-domain'
      ) {
        setAuthError('Ventana emergente bloqueada por el navegador. Accede con Email/Contraseña.');
      } else if (err?.code === 'auth/cancelled-popup-request' || err?.code === 'auth/popup-closed-by-user') {
        setAuthError(null);
      } else {
        setAuthError('No se pudo acceder con Google. Usa el formulario de Email/Contraseña.');
      }
    }
  };

  const signInWithEmail = async (e: string, p: string): Promise<void> => {
    if (!auth) return;
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, e.trim(), p);
    } catch (err: any) {
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setAuthError('Email o contraseña incorrectos.');
      } else if (err?.code === 'auth/invalid-email') {
        setAuthError('El formato de email no es válido.');
      } else {
        setAuthError('Error al iniciar sesión con email.');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (e: string, p: string, name: string): Promise<void> => {
    if (!auth) return;
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, e.trim(), p);
      if (res.user) {
        await updateProfile(res.user, { displayName: name.trim() });
        await syncUserToFirestore(res.user);
      }
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setAuthError('Este email ya está registrado. Inicia sesión directamente.');
      } else if (err?.code === 'auth/weak-password') {
        setAuthError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setAuthError('Error al crear la cuenta.');
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      appUser,
      loading,
      authError,
      isAdmin: appUser?.role === 'admin' || appUser?.email === 'jrvcg1@gmail.com',
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
