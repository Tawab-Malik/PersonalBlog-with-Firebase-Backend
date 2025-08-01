"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { auth, provider } from "../../../firebase/config";
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { adminEmails } from "../../../firebase/constants/adminEmails";
interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export default function LoginPopup({ isOpen, onClose, onSwitchToSignup }: LoginPopupProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if device is mobile
  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  };

  // Handle redirect result on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          
          // Check if user document exists in Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            const isAdmin = adminEmails.includes(user.email?.toLowerCase() || "");
            await setDoc(doc(db, "users", user.uid), {
              username: user.displayName || user.email?.split('@')[0] || "User",
              email: user.email,
              createdAt: new Date().toISOString(),
              profileImage: user.photoURL || "",
              bio: "",
              isAdmin: isAdmin,
            });
          }

          // Show success message
          const isAdmin = adminEmails.includes(user.email?.toLowerCase() || "");
          if (isAdmin) {
            alert("Admin login successful! Welcome back!");
          } else {
            alert("Login successful! Welcome back!");
          }
        }
      } catch (error) {
        console.error("Redirect result error:", error);
      }
    };

    handleRedirectResult();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      // Use redirect method for mobile devices
      if (isMobile()) {
        await signInWithRedirect(auth, provider);
        return; // Redirect will happen, no need to continue
      }

      // Use popup method for desktop
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        const isAdmin = adminEmails.includes(user.email?.toLowerCase() || "");
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || user.email?.split('@')[0] || "User",
          email: user.email,
          createdAt: new Date().toISOString(),
          profileImage: user.photoURL || "",
          bio: "",
          isAdmin: isAdmin,
        });
      }

      // Close popup and show success message
      onClose();
      setFormData({
        email: "",
        password: "",
      });
      
      // Show different message for admin vs regular user
      const isAdmin = adminEmails.includes(user.email?.toLowerCase() || "");
      if (isAdmin) {
        alert("Admin login successful! Welcome back!");
      } else {
        alert("Login successful! Welcome back!");
      }

    } catch (error: unknown) {
      console.error("Google login error:", error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === "auth/popup-closed-by-user") {
          setError("Login cancelled. Please try again.");
        } else if (error.code === "auth/popup-blocked") {
          setError("Popup blocked by browser. Please allow popups and try again.");
        } else if (error.code === "auth/unauthorized-domain") {
          setError("This domain is not authorized for Google login. Please contact support.");
        } else if (error.code === "auth/network-request-failed") {
          setError("Network error. Please check your internet connection and try again.");
        } else {
          setError(`Login failed: ${error.code}. Please try again.`);
        }
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Close popup and show success message
      onClose();
      setFormData({
        email: "",
        password: "",
      });
      
      // You can add a toast notification here
      alert("Welcome back! You've successfully logged in.");

    } catch (error: unknown) {
      console.error("Login error:", error);
      
      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === "auth/user-not-found") {
          setError("No account found with this email. Please sign up first.");
        } else if (error.code === "auth/wrong-password") {
          setError("Incorrect password. Please try again.");
        } else if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many failed attempts. Please try again later.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 !backdrop-blur-xl flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full md:w-100 btn btn-light cursor-pointer flex justify-center border border-2  border-gray-300 text-secondary py-3 rounded-lg fw-semibold hover:bg-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed d-flex align-items-center justify-content-center gap-3 mb-4"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Switch to Signup */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-primary hover:text-primary-600 cursor-pointer font-semibold transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <button className="text-primary hover:text-primary-600 text-sm transition-colors">
                Forgot your password?
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 