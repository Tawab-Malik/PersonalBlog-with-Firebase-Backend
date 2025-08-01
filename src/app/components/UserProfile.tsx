"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, BookOpen, ChevronDown, Shield } from "lucide-react";
import { auth } from "../../../firebase/config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import Image from "next/image";

export default function UserProfile() {
  const { user, isAdmin } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-black hover:bg-primary-600 px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || user.email || ""}
              className="w-8 h-8 rounded-full"
              height={30}
              width={30}
            />
          ) : (
            <User className="w-5 h-5 text-primary" />
          )}
        </div>
        {/* <span className="hidden md:block text-sm font-medium">
          {user.displayName || user.email?.split('@')[0]}
        </span> */}
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-68 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL ?? undefined}
                      alt={user.displayName || user.email || ""}
                      height={30}
                      width={30}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full mt-1">
                      <Shield className="w-3 h-3" />
                      Dashboard
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="/dashbaord/profile"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              {/* not admin  */}
              {!isAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setIsDropdownOpen(false)}
              >
                <BookOpen className="w-4 h-4" />
                <span>My Dashboard</span>
              </Link>
              )}
              {isAdmin && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 text-purple-700 hover:bg-purple-50 transition-colors duration-150"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  <span>Dashboard Panel</span>
                </Link>
              )}
              
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150 w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 