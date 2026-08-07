import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAA_M9I2-eYhPgpx2sWgCYgFLtXZvVOuDA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dprintstudio-d37f1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dprintstudio-d37f1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dprintstudio-d37f1.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "760808426242",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:760808426242:web:ca38abf1f04327b71e901b"
};

export const isFirebaseConfigured = true;

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let auth: Auth | undefined;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
} catch (e) {
  console.warn('Firebase initialization error:', e);
}

export { app, db, storage, auth };
export default app;
