// scripts/uploadPosts.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import postData from "../../data/postData.json"; // ✅ Adjust path based on your project
// import { Post } from "../types/post"; // ✅ Optional: if you're using TypeScript type checking

const firebaseConfig = {
    apiKey: "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g",
    authDomain: "blogpost-d89c5.firebaseapp.com",
    projectId: "blogpost-d89c5",
    storageBucket: "blogpost-d89c5.appspot.com",
    messagingSenderId: "852997789368",
    appId: "1:852997789368:web:8405a4be0f6ec7c8d9864d",
    measurementId: "G-0HZKQ744BH"
};

// ✅ Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadPosts() {
    const postsRef = collection(db, "posts");

    for (const post of postData) {
        try {
            const postRef = doc(postsRef, String(post.id));
            await setDoc(postRef, post);
            console.log(`✅ Uploaded: ${post.title}`);
        } catch (error) {
            console.error(`❌ Failed to upload ${post.title}:`, error);
        }
    }

    console.log("🎉 All posts uploaded!");
}

uploadPosts();
