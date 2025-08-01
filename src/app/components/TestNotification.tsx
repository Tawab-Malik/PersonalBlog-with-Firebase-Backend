"use client";
import { useState } from "react";
import { createNotification } from "@/lib/notificationService";
import { useAuth } from "@/app/hooks/useAuth";

export default function TestNotification() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const createTestNotification = async () => {
        if (!user?.email) {
            setMessage("Please login first");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const notificationParams = {
                type: "comment" as const,
                postSlug: "test-post-slug",
                postTitle: "Test Post Title",
                authorName: user.displayName || user.email?.split('@')[0] || "Test User",
                authorEmail: "test@example.com",
                recipientEmail: user.email
                // commentId is optional, so we don't include it
            };

            console.log("Creating test notification with params:", notificationParams);

            const notificationId = await createNotification(notificationParams);
            
            if (notificationId) {
                setMessage(`✅ Test notification created successfully! ID: ${notificationId}`);
            } else {
                setMessage("⚠️ Notification creation returned no ID");
            }
        } catch (error) {
            console.error("Error creating test notification:", error);
            setMessage("❌ Failed to create test notification. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const createMultipleTestNotifications = async () => {
        if (!user?.email) {
            setMessage("Please login first");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const notifications = [
                {
                    type: "comment" as const,
                    postSlug: "test-post-1",
                    postTitle: "Test Post 1",
                    authorName: "User 1",
                    authorEmail: "user1@example.com",
                    recipientEmail: user.email
                },
                {
                    type: "like" as const,
                    postSlug: "test-post-2",
                    postTitle: "Test Post 2",
                    authorName: "User 2",
                    authorEmail: "user2@example.com",
                    recipientEmail: user.email
                },
                {
                    type: "reply" as const,
                    postSlug: "test-post-3",
                    postTitle: "Test Post 3",
                    authorName: "User 3",
                    authorEmail: "user3@example.com",
                    recipientEmail: user.email
                }
            ];

            let successCount = 0;
            for (const notification of notifications) {
                try {
                    const id = await createNotification(notification);
                    if (id) successCount++;
                } catch (error) {
                    console.error("Failed to create notification:", notification, error);
                }
            }

            setMessage(`✅ Created ${successCount} out of ${notifications.length} test notifications`);
        } catch (error) {
            console.error("Error creating multiple test notifications:", error);
            setMessage("❌ Failed to create multiple test notifications");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Please login to test notifications</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Test Notifications</h3>
            <p className="text-blue-700 mb-3">Current user: {user.email}</p>
            
            <div className="space-y-2">
                <button
                    onClick={createTestNotification}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Single Test Notification"}
                </button>
                
                <button
                    onClick={createMultipleTestNotifications}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Multiple Test Notifications"}
                </button>
            </div>
            
            {message && (
                <div className={`mt-3 p-2 rounded text-sm ${
                    message.includes("✅") ? "bg-green-100 text-green-700" : 
                    message.includes("❌") ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                }`}>
                    {message}
                </div>
            )}
        </div>
    );
} 