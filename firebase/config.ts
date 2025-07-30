import { initializeApp, getApps } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g",
    authDomain: "blogpost-d89c5.firebaseapp.com",
    projectId: "blogpost-d89c5",
    storageBucket: "blogpost-d89c5.appspot.com",
    messagingSenderId: "852997789368",
    appId: "1:852997789368:web:8405a4be0f6ec7c8d9864d",
    measurementId: "G-0HZKQ744BH"
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
const provider = new GoogleAuthProvider();
export { provider };
