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

export async function fixPostAuthors() {
    console.log("Fixing post authors structure...");
    
    try {
        // Get all posts
        const postsSnapshot = await getDocs(collection(db, "posts"));
        let updatedCount = 0;
        let skippedCount = 0;

        for (const postDoc of postsSnapshot.docs) {
            const postData = postDoc.data();
            
            // Check if post needs author structure fix
            if (!postData.author || typeof postData.author !== 'object') {
                try {
                    // Create proper author structure
                    const authorData = {
                        name: postData.userName || postData.authorName || "Anonymous",
                        avatar: postData.authorAvatar || "/default-avatar.png",
                        email: postData.userEmail || postData.authorEmail || ""
                    };

                    // Update post with proper author structure
                    await updateDoc(doc(db, "posts", postDoc.id), {
                        author: authorData
                    });
                    
                    console.log(`✅ Fixed post "${postData.title}" with author structure:`, authorData);
                    updatedCount++;
                } catch (error) {
                    console.error(`❌ Error fixing post "${postData.title}":`, error);
                    skippedCount++;
                }
            } else if (postData.author && !postData.author.email && postData.userId) {
                try {
                    // Try to get user email from users collection
                    const userDoc = await getDocs(query(
                        collection(db, "users"),
                        where("uid", "==", postData.userId)
                    ));

                    if (!userDoc.empty) {
                        const userData = userDoc.docs[0].data();
                        const userEmail = userData.email;

                        if (userEmail) {
                            // Update post with author email
                            await updateDoc(doc(db, "posts", postDoc.id), {
                                "author.email": userEmail
                            });
                            console.log(`✅ Updated post "${postData.title}" with author email: ${userEmail}`);
                            updatedCount++;
                        } else {
                            console.log(`⚠️ No email found for user ${postData.userId} in post "${postData.title}"`);
                            skippedCount++;
                        }
                    } else {
                        console.log(`⚠️ No user document found for userId ${postData.userId} in post "${postData.title}"`);
                        skippedCount++;
                    }
                } catch (error) {
                    console.error(`❌ Error updating post "${postData.title}":`, error);
                    skippedCount++;
                }
            } else if (postData.author && postData.author.email) {
                console.log(`ℹ️ Post "${postData.title}" already has proper author structure`);
                skippedCount++;
            } else {
                console.log(`⚠️ Post "${postData.title}" has incomplete author structure`);
                skippedCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`✅ Updated: ${updatedCount} posts`);
        console.log(`⚠️ Skipped: ${skippedCount} posts`);
        
        return { updated: updatedCount, skipped: skippedCount };
    } catch (error) {
        console.error("❌ Error fixing post authors:", error);
        throw error;
    }
}

// Run the function if this script is executed directly
if (require.main === module) {
    fixPostAuthors()
        .then((result) => {
            console.log(`\n🎉 Script completed successfully!`);
            console.log(`Fixed ${result.updated} posts, skipped ${result.skipped} posts`);
            process.exit(0);
        })
        .catch((error) => {
            console.error("❌ Script failed:", error);
            process.exit(1);
        });
} 