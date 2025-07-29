import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/config";
import { adminEmails } from "../../../firebase/constants/adminEmails";

export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  
  const isAdmin = user?.email ? adminEmails.includes(user.email.toLowerCase()) : false;
  
  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated: !!user
  };
}; 