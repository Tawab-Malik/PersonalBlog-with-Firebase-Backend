"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { auth } from "../../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

interface ForgotPasswordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function ForgotPasswordPopup({ isOpen, onClose, onSwitchToLogin }: ForgotPasswordPopupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      // Show success message
      setSuccess(true);
      setEmail("");
      
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      
      // Handle specific Firebase errors
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === "auth/user-not-found") {
          setError("No account found with this email address. Please check your email or sign up.");
        } else if (error.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else if (error.code === "auth/network-request-failed") {
          setError("Network error. Please check your internet connection and try again.");
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

  const handleBackToLogin = () => {
    setSuccess(false);
    setEmail("");
    setError("");
    onSwitchToLogin();
  };

  const handleClose = () => {
    setSuccess(false);
    setEmail("");
    setError("");
    onClose();
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
              onClick={handleClose}
              className="absolute top-6 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {success ? "Check Your Email" : "Reset Password"}
              </h2>
              <p className="text-gray-600">
                {success 
                  ? "We've sent you a password reset link" 
                  : "Enter your email to receive a password reset link"
                }
              </p>
            </div>

            {!success ? (
              <>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      disabled={loading}
                    />
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
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>

                {/* Back to Login */}
                <div className="text-center mt-6">
                  <button
                    onClick={handleBackToLogin}
                    className="text-primary hover:text-primary-600 cursor-pointer font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Reset Link Sent!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>. 
                    Please check your email and click the link to reset your password.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleBackToLogin}
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
                    >
                      Back to Login
                    </button>
                    <button
                      onClick={() => setSuccess(false)}
                      className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Send Another Link
                    </button>
                  </div>
                </motion.div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Didn&apos;t receive the email?</strong> Check your spam folder or try again with a different email address.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 