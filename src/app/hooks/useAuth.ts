import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { auth, db } from "../../../firebase/config";
import { adminEmails } from "../../../firebase/constants/adminEmails";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  
  const isAdmin = user?.email ? adminEmails.includes(user.email.toLowerCase()) : false;
  
  // Create or update user record in Firestore
  useEffect(() => {
    const createUserRecord = async () => {
      if (user && user.uid) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            // Create new user record
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || "Anonymous",
              photoURL: user.photoURL || "",
              isAdmin: isAdmin,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              postCount: 0
            });
          } else {
            // Update user data including displayName and email
            await setDoc(userRef, {
              displayName: user.displayName || user.email?.split('@')[0] || "Anonymous",
              email: user.email,
              photoURL: user.photoURL || "",
              lastLogin: new Date().toISOString()
            }, { merge: true });
          }
        } catch (error) {
          console.error("Error creating/updating user record:", error);
        }
      }
    };

    if (user) {
      createUserRecord();
    }
  }, [user, isAdmin]);
  
  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated: !!user
  };
}; 