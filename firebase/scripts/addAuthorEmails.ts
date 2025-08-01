import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";

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

export async function addAuthorEmails() {
    console.log("Adding author emails to posts...");
    
    try {
        // Get all posts
        const postsSnapshot = await getDocs(collection(db, "posts"));
        let updatedCount = 0;
        let skippedCount = 0;

        for (const postDoc of postsSnapshot.docs) {
            const postData = postDoc.data();
            
            console.log(`\nChecking post: "${postData.title}"`);
            console.log("Post data:", {
                hasAuthor: !!postData.author,
                authorType: typeof postData.author,
                authorData: postData.author,
                hasUserId: !!postData.userId,
                userId: postData.userId
            });

            // Check if post has author but no email
            if (postData.author && typeof postData.author === 'object' && !postData.author.email) {
                try {
                    let authorEmail = "";

                    // Try to get email from user document if userId exists
                    if (postData.userId) {
                        console.log(`Looking for user document with userId: ${postData.userId}`);
                        
                        const userDoc = await getDocs(query(
                            collection(db, "users"),
                            where("uid", "==", postData.userId)
                        ));

                        if (!userDoc.empty) {
                            const userData = userDoc.docs[0].data();
                            authorEmail = userData.email || "";
                            console.log(`Found user email: ${authorEmail}`);
                        } else {
                            console.log(`No user document found for userId: ${postData.userId}`);
                        }
                    }

                    // If no email found, use a default email based on author name
                    if (!authorEmail) {
                        const authorName = postData.author.name || "Anonymous";
                        authorEmail = `${authorName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
                        console.log(`Using default email: ${authorEmail}`);
                    }

                    // Update post with author email
                    await updateDoc(doc(db, "posts", postDoc.id), {
                        "author.email": authorEmail
                    });
                    
                    console.log(`✅ Updated post "${postData.title}" with author email: ${authorEmail}`);
                    updatedCount++;
                } catch (error) {
                    console.error(`❌ Error updating post "${postData.title}":`, error);
                    skippedCount++;
                }
            } else if (postData.author && postData.author.email) {
                console.log(`ℹ️ Post "${postData.title}" already has author email: ${postData.author.email}`);
                skippedCount++;
            } else {
                console.log(`⚠️ Post "${postData.title}" has no author structure`);
                skippedCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`✅ Updated: ${updatedCount} posts`);
        console.log(`⚠️ Skipped: ${skippedCount} posts`);
        
        return { updated: updatedCount, skipped: skippedCount };
    } catch (error) {
        console.error("❌ Error adding author emails:", error);
        throw error;
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    addAuthorEmails()
        .then((result) => {
            console.log(`\n🎉 Script completed successfully!`);
            console.log(`Updated ${result.updated} posts, skipped ${result.skipped} posts`);
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Script failed:", error);
            process.exit(1);
        });
} 