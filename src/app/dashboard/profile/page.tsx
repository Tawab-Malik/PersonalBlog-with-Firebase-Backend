"use client";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import { 
    User, 
    Camera, 
    CheckCircle, 
    AlertCircle, 
    ArrowLeft,
    Edit3,
    Save,
    X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { useAuth } from "@/app/hooks/useAuth";

interface ProfileData {
    displayName: string;
    photoURL: string;
}

 function ProfilePage() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData>({
        displayName: user?.displayName || "",
        photoURL: user?.photoURL || ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await updateProfile(user, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });

            setSuccess("Profile updated successfully!");
            setIsEditing(false);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setProfileData({
            displayName: user?.displayName || "",
            photoURL: user?.photoURL || ""
        });
        setIsEditing(false);
        setError("");
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
                        Profile Settings
                    </h1>
                    <p className="text-gray-600 mt-2">Manage your profile information and avatar</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile</h2>
                            <nav className="space-y-2">
                                <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Profile Info</span>
                                </a>
                                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <User className="w-5 h-5" />
                                    <span className="font-medium">Security</span>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Profile Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {loading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                )}
                            </div>

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
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-red-800 font-medium">{error}</span>
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <div className="text-center">
                                    <div className="relative inline-block">
                                        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                            {profileData.photoURL ? (
                                                <Image
                                                    src={profileData.photoURL}
                                                    alt="Profile"
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <User className="w-16 h-16 text-gray-400" />
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg">
                                                <Camera className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Click the camera icon to change your profile picture
                                        </p>
                                    )}
                                </div>

                                {/* Display Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.displayName}
                                            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your display name"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-xl">
                                            <span className="text-gray-800">{profileData.displayName || "No display name set"}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                                        <span className="text-gray-800">{user?.email}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Email can be changed in Security Settings
                                    </p>
                                </div>

                                {/* Account Info */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Account Created:</span>
                                            <span className="text-gray-800">
                                                {user?.metadata?.creationTime ? 
                                                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                                                    "Unknown"
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Sign In:</span>
                                            <span className="text-gray-800">
                                                {user?.metadata?.lastSignInTime ? 
                                                    new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                                                    "Unknown"
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email Verified:</span>
                                            <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                {user?.emailVerified ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePageWrapper() {
    return (
        <DashboardAuthWrapper>
            <ProfilePage />
        </DashboardAuthWrapper>
    );
} 