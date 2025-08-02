"use client";
import { useState, useEffect } from "react";
import { Bell, X, MessageCircle, User, Check, Trash2, AlertCircle, ExternalLink, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    type: "comment" | "like" | "reply";
    title: string;
    message: string;
    postSlug: string;
    postTitle: string;
    commentId?: string;
    authorName: string;
    authorEmail: string;
    createdAt: unknown;
    isRead: boolean;
    recipientEmail: string;
}

export default function NotificationSystem() {
    const { user } = useAuth();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAllNotifications, setShowAllNotifications] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.email) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        setError(null);
        setLoading(true);

        try {
            console.log("Setting up notifications listener for user:", user.email);
            
            // Listen for recent notifications (limited to 10 for dropdown)
            const recentNotificationsQuery = query(
                collection(db, "notifications"),
                where("recipientEmail", "==", user.email),
                orderBy("createdAt", "desc"),
                limit(10)
            );

            // Listen for all notifications (for "Show All" feature)
            const allNotificationsQuery = query(
                collection(db, "notifications"),
                where("recipientEmail", "==", user.email),
                orderBy("createdAt", "desc")
            );

            const unsubscribeRecent = onSnapshot(
                recentNotificationsQuery,
                (snapshot) => {
                    const notificationsData: Notification[] = [];
                    let unread = 0;

                    snapshot.forEach((docSnapshot) => {
                        const data = docSnapshot.data();
                        notificationsData.push({
                            id: docSnapshot.id,
                            ...data
                        } as Notification);
                        if (!data.isRead) unread++;
                    });

                    setNotifications(notificationsData);
                    setUnreadCount(unread);
                    setLoading(false);
                },
                (error) => {
                    console.error("Firestore listener error:", error);
                    setError(error.message);
                    setLoading(false);

                    // If it's an index error, show helpful message
                    if (error.message.includes("failed-precondition") && error.message.includes("index")) {
                        setError("Database index is being created. Please wait a few minutes and refresh the page.");
                    }
                }
            );

            const unsubscribeAll = onSnapshot(
                allNotificationsQuery,
                (snapshot) => {
                    const allNotificationsData: Notification[] = [];
                    snapshot.forEach((docSnapshot) => {
                        const data = docSnapshot.data();
                        allNotificationsData.push({
                            id: docSnapshot.id,
                            ...data
                        } as Notification);
                    });
                    setAllNotifications(allNotificationsData);
                },
                (error) => {
                    console.error("Firestore listener error for all notifications:", error);
                }
            );

            return () => {
                unsubscribeRecent();
                unsubscribeAll();
            };
        } catch (error) {
            console.error("Error setting up notifications listener:", error);
            setError("Failed to load notifications");
            setLoading(false);
        }
    }, [user?.email]);

    const markAsRead = async (notificationId: string) => {
        try {
            await updateDoc(doc(db, "notifications", notificationId), {
                isRead: true
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        setLoading(true);
        try {
            const unreadNotifications = notifications.filter(n => !n.isRead);
            const updatePromises = unreadNotifications.map(notification =>
                updateDoc(doc(db, "notifications", notification.id), {
                    isRead: true
                })
            );
            await Promise.all(updatePromises);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await deleteDoc(doc(db, "notifications", notificationId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const navigateToPost = async (notification: Notification) => {
        try {
            // Mark notification as read
            await markAsRead(notification.id);
            
            // Navigate to the post
            router.push(`/${notification.postSlug}`);
            
            // Close dropdown
            setShowDropdown(false);
        } catch (error) {
            console.error("Error navigating to post:", error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "comment":
                return <MessageCircle className="w-4 h-4" />;
            case "like":
                return <User className="w-4 h-4" />;
            case "reply":
                return <MessageCircle className="w-4 h-4" />;
            default:
                return <Bell className="w-4 h-4" />;
        }
    };

    // یہاں ٹائپ چیکنگ اور ٹائم اسٹیمپ ہینڈلنگ کو بہتر بنایا گیا ہے
    const formatTime = (timestamp: { toDate?: () => Date } | Date | null | undefined) => {
        if (!timestamp) return "Just now";
        let date: Date;
        if (timestamp instanceof Date) {
            date = timestamp;
        } else if (timestamp && typeof timestamp.toDate === "function") {
            date = timestamp.toDate();
        } else {
            date = new Date();
        }
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    if (!user) return null;

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute -right-24 md:right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${showAllNotifications ? 'max-h-[600px]' : 'max-h-96'} overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-800">
                                {showAllNotifications ? "All Notifications" : "Recent Notifications"}
                            </h3>
                            <div className="flex items-center gap-2">
                                {!showAllNotifications && allNotifications.length > 10 && (
                                    <button
                                        onClick={() => setShowAllNotifications(true)}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        Show All ({allNotifications.length})
                                    </button>
                                )}
                                {showAllNotifications && (
                                    <button
                                        onClick={() => setShowAllNotifications(false)}
                                        className="text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Show Recent
                                    </button>
                                )}
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={loading}
                                        className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                    >
                                        {loading ? "Marking..." : "Mark all read"}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        setShowAllNotifications(false);
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border-b border-red-200">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {!error && !loading && (
                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>
                                        {showAllNotifications 
                                            ? `Showing all ${allNotifications.length} notifications`
                                            : `Showing ${notifications.length} of ${allNotifications.length} notifications`
                                        }
                                    </span>
                                    {unreadCount > 0 && (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            {unreadCount} unread
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notifications List */}
                        <div className={`${showAllNotifications ? 'max-h-[500px]' : 'max-h-80'} overflow-y-auto`}>
                            {loading ? (
                                <div className="p-6 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-2">Loading notifications...</p>
                                </div>
                            ) : (showAllNotifications ? allNotifications : notifications).length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {(showAllNotifications ? allNotifications : notifications).map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""
                                                }`}
                                            onClick={() => navigateToPost(notification)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${!notification.isRead ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                                    }`}>
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-800 truncate">
                                                            {notification.title}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-gray-500">
                                                                {formatTime(
                                                                    notification.createdAt instanceof Date
                                                                        ? notification.createdAt
                                                                        : (typeof notification.createdAt === "object" &&
                                                                            notification.createdAt !== null &&
                                                                            "toDate" in notification.createdAt &&
                                                                            typeof (notification.createdAt as { toDate?: () => Date })?.toDate === "function"
                                                                            ? (notification.createdAt as { toDate: () => Date }).toDate()
                                                                            : new Date(
                                                                                typeof notification.createdAt === "string" ||
                                                                                    typeof notification.createdAt === "number"
                                                                                    ? notification.createdAt
                                                                                    : ""
                                                                            )
                                                                        )
                                                                )
                                                                }
                                                            </span>
                                                            {!notification.isRead && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                                                            )}
                                                        </div>

                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="text-xs text-blue-600 cursor-pointer hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            <Check className="w-3 h-3" />
                                                            Mark read
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notification.id);
                                                            }}
                                                            className="text-xs text-red-600 cursor-pointer hover:text-red-800 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigateToPost(notification);
                                                            }}
                                                            className="text-xs text-green-600 cursor-pointer hover:text-green-800 flex items-center gap-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            View Post
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
} 