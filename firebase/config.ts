import { initializeApp, getApps } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug: Log environment variables
// console.log('Environment Variables Check:', {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
// });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing environment variables:', missingEnvVars);
    
    // In development, use fallback values instead of throwing error
    if (process.env.NODE_ENV === 'development') {
        console.warn('Using fallback values for development...');
        firebaseConfig.apiKey = firebaseConfig.apiKey || "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g";
        firebaseConfig.authDomain = firebaseConfig.authDomain || "blogpost-d89c5.firebaseapp.com";
        firebaseConfig.projectId = firebaseConfig.projectId || "blogpost-d89c5";
        firebaseConfig.storageBucket = firebaseConfig.storageBucket || "blogpost-d89c5.appspot.com";
        firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || "852997789368";
        firebaseConfig.appId = firebaseConfig.appId || "1:852997789368:web:8405a4be0f6ec7c8d9864d";
    } else {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
}

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
const provider = new GoogleAuthProvider();
export { provider };
