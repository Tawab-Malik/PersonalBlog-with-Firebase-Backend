import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Map of fake emails to real emails
const emailMapping: { [key: string]: string } = {
  "tawab.malikx@example.com": "tchannar5@gmail.com", // آپ کا actual email
  "tawab.neo@example.com": "tchannar5@gmail.com",    // آپ کا actual email
  "sara.coder@example.com": "sara.coder@gmail.com",  // Sara کا actual email - یہاں actual email لکھیں
  "ali.developer@example.com": "ali.developer@gmail.com", // Ali کا actual email - یہاں actual email لکھیں
  "malik@example.com": "malik@gmail.com" // Malik کا actual email - یہاں actual email لکھیں
};

export async function updateToRealEmails() {
  console.log("Updating post author emails to real emails...");
  
  try {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    let updatedCount = 0;
    let skippedCount = 0;

    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      
      if (postData.author?.email && emailMapping[postData.author.email]) {
        const oldEmail = postData.author.email;
        const newEmail = emailMapping[oldEmail];
        
        console.log(`🔄 Updating post "${postData.title}":`);
        console.log(`   Old email: ${oldEmail}`);
        console.log(`   New email: ${newEmail}`);
        
        await updateDoc(doc(db, "posts", postDoc.id), {
          "author.email": newEmail
        });
        
        updatedCount++;
        console.log(`✅ Updated successfully\n`);
      } else {
        console.log(`⚠️ Skipping post "${postData.title}" - no mapping for email: ${postData.author?.email || 'undefined'}`);
        skippedCount++;
      }
    }

    console.log("📊 Summary:");
    console.log(`✅ Updated: ${updatedCount} posts`);
    console.log(`⚠️ Skipped: ${skippedCount} posts`);
    console.log("\n🎉 Script completed successfully!");
    
  } catch (error) {
    console.error("❌ Error updating emails:", error);
  }
}

// Run the script
if (require.main === module) {
  updateToRealEmails().then(() => {
    console.log("Script finished");
    process.exit(0);
  }).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
} 