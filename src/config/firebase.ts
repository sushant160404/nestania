import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Works in both Node.js (server.ts via tsx) and browser (Vite inlines VITE_* vars)
const env = typeof import.meta !== 'undefined' && import.meta.env
  ? import.meta.env
  : process.env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL || env.FIREBASE_DATABASE_URL,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if config is valid (browser context with Vite env vars)
let app: any = null;
let database: Database | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    console.log('Firebase initializing with:', {
      context: typeof import.meta !== 'undefined' ? 'Browser (Vite)' : 'Server (Node.js)',
      apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL
    });
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('Firebase config incomplete - running without Firebase integration');
  }
} catch (error) {
  console.warn('Firebase initialization failed - running without Firebase integration', error);
}

export { database, auth, storage };

// Analytics only in browser
let analytics: any = null;
if (typeof window !== 'undefined' && app) {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { analytics };
export default app;
