import { initializeApp, getApps } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "blogpost-d89c5.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "blogpost-d89c5",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "blogpost-d89c5.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "852997789368",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:852997789368:web:8405a4be0f6ec7c8d9864d",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0HZKQ744BH"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error('Failed to initialize Firebase. Please check your configuration.');
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider for better mobile support
provider.setCustomParameters({
  prompt: 'select_account',
  // Add mobile-specific parameters
  ux_mode: 'popup',
  // Force account selection
  access_type: 'offline'
});

// Add scopes if needed
provider.addScope('email');
provider.addScope('profile');

export { provider };
