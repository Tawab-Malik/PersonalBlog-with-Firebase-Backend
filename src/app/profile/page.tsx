"use client";
import { useState, useEffect } from "react";
import { db } from "../../../firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Camera, Save } from "lucide-react";
import Loader from "@/app/components/Loader";
import { useAuth } from "@/app/hooks/useAuth";

interface ProfileData {
  displayName: string;
  photoURL: string;
  email: string;
  bio?: string;
  website?: string;
}

function ProfileForm() {
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: "",
    photoURL: "",
    email: "",
    bio: "",
    website: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        email: user.email || "",
        bio: "",
        website: ""
      });
      setPreviewImage(user.photoURL || "");
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
          bio: profileData.bio,
          website: profileData.website,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create user document if it doesn't exist
        await updateDoc(userRef, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
          email: profileData.email,
          bio: profileData.bio,
          website: profileData.website,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            onPress={() => router.push("/dashboard")}
            className="mb-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                <p className="text-gray-600">Update your personal information</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Click the camera icon to change your profile picture
                </p>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h3>

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your display name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onPress={() => router.push("/dashboard")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <DashboardAuthWrapper>
      <ProfileForm />
    </DashboardAuthWrapper>
  );
} 