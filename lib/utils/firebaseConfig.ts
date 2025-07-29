// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g",
    authDomain: "blogpost-d89c5.firebaseapp.com",
    projectId: "blogpost-d89c5",
    storageBucket: "blogpost-d89c5.appspot.com",
    messagingSenderId: "852997789368",
    appId: "1:852997789368:web:8405a4be0f6ec7c8d9864d",
    measurementId: "G-0HZKQ744BH"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: Initialize Analytics (only in browser)
if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

export { db, app };
