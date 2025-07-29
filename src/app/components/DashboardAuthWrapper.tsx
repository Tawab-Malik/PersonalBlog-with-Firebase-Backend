"use client";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import Loader from "./Loader";
import Link from "next/link";

interface DashboardAuthWrapperProps {
  children: React.ReactNode;
}

export default function DashboardAuthWrapper({ children }: DashboardAuthWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [user, userLoading] = useAuthState(auth);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (userLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setLoading(false);
        } else {
          // User doesn't exist in database, but we'll still allow access
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user, userLoading]);

  if (userLoading || loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            🔐 Login Required
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Please login to access your dashboard.
          </p>
          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}