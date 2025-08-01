import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import { firebaseConfig } from "../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function autoUpdateAuthorEmails() {
  console.log("🔄 Automatically updating post author emails from Firebase users...");
  
  try {
    // Step 1: Get all registered users from Firebase
    console.log("📋 Fetching registered users...");
    const usersSnapshot = await getDocs(collection(db, "users"));
    const registeredUsers = new Map<string, string>(); // name -> email
    
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.email && userData.displayName) {
        registeredUsers.set(userData.displayName.toLowerCase(), userData.email);
        console.log(`👤 Found user: ${userData.displayName} -> ${userData.email}`);
      }
    });
    
    console.log(`✅ Found ${registeredUsers.size} registered users\n`);
    
    // Step 2: Get all posts and update author emails
    console.log("📝 Updating post author emails...");
    const postsSnapshot = await getDocs(collection(db, "posts"));
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      const authorName = postData.author?.name;
      
      if (authorName && registeredUsers.has(authorName.toLowerCase())) {
        const realEmail = registeredUsers.get(authorName.toLowerCase())!;
        const currentEmail = postData.author?.email;
        
        if (currentEmail !== realEmail) {
          console.log(`🔄 Updating post "${postData.title}":`);
          console.log(`   Author: ${authorName}`);
          console.log(`   Old email: ${currentEmail || 'undefined'}`);
          console.log(`   New email: ${realEmail}`);
          
          await updateDoc(doc(db, "posts", postDoc.id), {
            "author.email": realEmail
          });
          
          updatedCount++;
          console.log(`✅ Updated successfully\n`);
        } else {
          console.log(`ℹ️ Post "${postData.title}" already has correct email: ${realEmail}`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️ Skipping post "${postData.title}" - no registered user found for author: ${authorName || 'undefined'}`);
        skippedCount++;
      }
    }
    
    console.log("📊 Summary:");
    console.log(`✅ Updated: ${updatedCount} posts`);
    console.log(`⚠️ Skipped: ${skippedCount} posts`);
    console.log(`👤 Registered users found: ${registeredUsers.size}`);
    console.log("\n🎉 Script completed successfully!");
    
    // Show registered users for reference
    console.log("\n📋 Registered users:");
    registeredUsers.forEach((email, name) => {
      console.log(`   ${name} -> ${email}`);
    });
    
  } catch (error) {
    console.error("❌ Error updating emails:", error);
  }
}

// Run the script
if (require.main === module) {
  autoUpdateAuthorEmails().then(() => {
    console.log("Script finished");
    process.exit(0);
  }).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
} 