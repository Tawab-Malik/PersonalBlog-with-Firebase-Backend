"use client";
import { useState } from "react";
import { auth } from "../../../../firebase/config";
import { 
    updateEmail, 
    updatePassword, 
    EmailAuthProvider, 
    reauthenticateWithCredential,
    sendPasswordResetEmail 
} from "firebase/auth";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    CheckCircle, 
    AlertCircle, 
    ArrowLeft,
    User,
    Shield,
    Bell
} from "lucide-react";
import Link from "next/link";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { useAuth } from "@/app/hooks/useAuth";

interface FormData {
    currentPassword: string;
    newEmail: string;
    newPassword: string;
    confirmPassword: string;
}

interface FormErrors {
    currentPassword?: string;
    newEmail?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
}

function SettingsPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        currentPassword: "",
        newEmail: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        if (formData.newEmail && formData.newEmail !== user?.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
                newErrors.newEmail = "Please enter a valid email address";
            }
        }

        // Password validation
        if (formData.newPassword) {
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = "Password must be at least 6 characters long";
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
                newErrors.newPassword = "Password must contain uppercase, lowercase, and number";
            }
        }

        // Confirm password validation
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Current password validation
        if ((formData.newEmail && formData.newEmail !== user?.email) || formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = "Current password is required to make changes";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccess("");

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            if (!user) {
                throw new Error("User not authenticated");
            }

            // Re-authenticate user if making changes
            if (formData.currentPassword) {
                const credential = EmailAuthProvider.credential(
                    user.email!,
                    formData.currentPassword
                );
                await reauthenticateWithCredential(user, credential);
            }

            // Update email
            if (formData.newEmail && formData.newEmail !== user.email) {
                await updateEmail(user, formData.newEmail);
                setSuccess("Email updated successfully!");
            }

            // Update password
            if (formData.newPassword) {
                await updatePassword(user, formData.newPassword);
                setSuccess(success ? "Email and password updated successfully!" : "Password updated successfully!");
            }

            // Reset form
            setFormData({
                currentPassword: "",
                newEmail: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error: unknown) {
            console.error("Error updating settings:", error);
            
            const errorMessage = error instanceof Error ? error.message : "An error occurred. Please try again.";
            const errorCode = (error as { code?: string })?.code;
            
            if (errorCode === "auth/wrong-password") {
                setErrors({ currentPassword: "Current password is incorrect" });
            } else if (errorCode === "auth/email-already-in-use") {
                setErrors({ newEmail: "Email is already in use by another account" });
            } else if (errorCode === "auth/requires-recent-login") {
                setErrors({ general: "Please log out and log back in to make these changes" });
            } else {
                setErrors({ general: errorMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        try {
            if (!user?.email) {
                setErrors({ general: "No email address found" });
                return;
            }
            
            await sendPasswordResetEmail(auth, user.email);
            setSuccess("Password reset email sent! Check your inbox.");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
            setErrors({ general: errorMessage });
        }
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Account Settings
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>
                            <nav className="space-y-2">
                                <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Profile</span>
                                </a>
                                <a href="#security" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">Security</span>
                                </a>
                                <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <Bell className="w-5 h-5" />
                                    <span className="font-medium">Notifications</span>
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Settings Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>

                            {/* Success Message */}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-green-800 font-medium">{success}</span>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {errors.general && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-red-800 font-medium">{errors.general}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            value={formData.currentPassword}
                                            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.currentPassword && (
                                        <p className="text-red-600 text-sm mt-1">{errors.currentPassword}</p>
                                    )}
                                </div>

                                {/* New Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.newEmail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.newEmail ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder={user?.email || "Enter new email address"}
                                        />
                                    </div>
                                    {errors.newEmail && (
                                        <p className="text-red-600 text-sm mt-1">{errors.newEmail}</p>
                                    )}
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                                    )}
                                    <p className="text-gray-500 text-sm mt-1">
                                        Password must be at least 6 characters with uppercase, lowercase, and number
                                    </p>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? "Updating..." : "Update Settings"}
                                    </Button>
                                    
                                    <Button
                                        type="button"
                                        onClick={handlePasswordReset}
                                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300"
                                    >
                                        Reset Password via Email
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPageWrapper() {
    return (
        <DashboardAuthWrapper>
            <SettingsPage />
        </DashboardAuthWrapper>
    );
} 