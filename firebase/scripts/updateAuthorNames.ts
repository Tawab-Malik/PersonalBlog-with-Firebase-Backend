import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { firebaseConfig } from "../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Map fake names to registered names (based on actual registered users)
const nameMapping: { [key: string]: string } = {
  "Tawab Neo": "Tawab",
  "Tawab Malikx": "Tawab", 
  // Sara Coder and Ali Developer are not registered yet, so we'll skip them
  // When they register, we can update this mapping
};

export async function updateAuthorNames() {
  console.log("🔄 Updating post author names to match registered users...");
  
  try {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postData = postDoc.data();
      const currentName = postData.author?.name;
      
      if (currentName && nameMapping[currentName]) {
        const newName = nameMapping[currentName];
        
        console.log(`🔄 Updating post "${postData.title}":`);
        console.log(`   Old name: ${currentName}`);
        console.log(`   New name: ${newName}`);
        
        await updateDoc(doc(db, "posts", postDoc.id), {
          "author.name": newName
        });
        
        updatedCount++;
        console.log(`✅ Updated successfully\n`);
      } else {
        console.log(`⚠️ Skipping post "${postData.title}" - no mapping for name: ${currentName || 'undefined'}`);
        skippedCount++;
      }
    }
    
    console.log("📊 Summary:");
    console.log(`✅ Updated: ${updatedCount} posts`);
    console.log(`⚠️ Skipped: ${skippedCount} posts`);
    console.log("\n🎉 Script completed successfully!");
    
  } catch (error) {
    console.error("❌ Error updating names:", error);
  }
}

// Run the script
if (require.main === module) {
  updateAuthorNames().then(() => {
    console.log("Script finished");
    process.exit(0);
  }).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
} 