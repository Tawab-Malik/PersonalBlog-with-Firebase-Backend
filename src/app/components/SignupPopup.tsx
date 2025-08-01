"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
import { auth, db, provider } from "../../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { adminEmails } from "../../../firebase/constants/adminEmails";
import { Button } from "@heroui/react";
import Link from "next/link";
import { useEffect } from "react";

interface SignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupPopup({ isOpen, onClose, onSwitchToLogin }: SignupPopupProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            alert("Admin account created successfully! You can now access the admin panel.");
          } else {
            alert("Account created successfully! Welcome to our blog!");
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
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // Show different message for admin vs regular user
      const isAdmin = adminEmails.includes(user.email?.toLowerCase() || "");
      if (isAdmin) {
        alert("Admin account created successfully! You can now access the admin panel.");
      } else {
        alert("Account created successfully! Welcome to our blog!");
      }

    } catch (error: unknown) {
      console.error("Google signup error:", error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === "auth/popup-closed-by-user") {
          setError("Signup cancelled. Please try again.");
        } else if (error.code === "auth/popup-blocked") {
          setError("Popup blocked by browser. Please allow popups and try again.");
        } else if (error.code === "auth/unauthorized-domain") {
          setError("This domain is not authorized for Google login. Please contact support.");
        } else if (error.code === "auth/network-request-failed") {
          setError("Network error. Please check your internet connection and try again.");
        } else {
          setError(`Signup failed: ${error.code}. Please try again.`);
        }
      } else {
        setError("Google signup failed. Please try again.");
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
    if (!formData.username.trim()) {
      setError("Username is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update profile with username
      await updateProfile(user, {
        displayName: formData.username,
      });

      // Check if user is admin
      const isAdmin = adminEmails.includes(formData.email.toLowerCase());

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        createdAt: new Date().toISOString(),
        profileImage: "",
        bio: "",
        isAdmin: isAdmin,
      });

      // Close popup and show success message
      onClose();
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // Show different message for admin vs regular user
      if (isAdmin) {
        alert("Admin account created successfully! You can now access the admin panel.");
      } else {
        alert("Account created successfully! Welcome to our blog!");
      }

    } catch (error: unknown) {
      console.error("Signup error:", error);
      
      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === "auth/email-already-in-use") {
          setError("Email is already registered. Please try logging in.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError("کچھ غلط ہو گیا ہے۔ براہ کرم دوبارہ کوشش کریں۔");
      }
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Our Community</h2>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            {/* Google Sign In Button */}
            <Button
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white border-2 h-auto border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
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
            </Button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="relative">
                <User className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>

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

              {/* Confirm Password Field */}
              <div className="relative">
                <Lock className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Switch to Login */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Button
                  onClick={onSwitchToLogin}
                  className="text-primary bg-transparent hover:text-primary-600 font-semibold transition-colors"
                >
                  Sign in here
                </Button>
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}