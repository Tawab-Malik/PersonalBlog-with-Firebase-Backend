import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDVRjC8NibHszqjfhyuQjpIeOdi6Sl2W7g",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "blogpost-d89c5.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "blogpost-d89c5",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "blogpost-d89c5.appspot.com",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "852997789368",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:852997789368:web:8405a4be0f6ec7c8d9864d",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0HZKQ744BH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createNotificationIndexes() {
    console.log("Creating notification indexes...");
    
    try {
        // This query will trigger the creation of the required composite index
        const notificationsQuery = query(
            collection(db, "notifications"),
            where("recipientEmail", "==", "test@example.com"),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        // Execute the query to trigger index creation
        const snapshot = await getDocs(notificationsQuery);
        console.log("Index creation triggered successfully");
        console.log("Found documents:", snapshot.size);
        
        return true;
    } catch (error: any) {
        if (error.message.includes("failed-precondition") && error.message.includes("index")) {
            console.log("Index creation URL:", error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)?.[0]);
            console.log("Please visit the above URL to create the required index manually");
            return false;
        } else {
            console.error("Error creating indexes:", error);
            return false;
        }
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    createNotificationIndexes()
        .then((success) => {
            if (success) {
                console.log("✅ Index creation completed successfully");
            } else {
                console.log("❌ Index creation failed - please create manually");
            }
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Error:", error);
            process.exit(1);
        });
} 