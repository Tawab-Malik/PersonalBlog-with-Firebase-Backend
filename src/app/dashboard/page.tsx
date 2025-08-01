"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Menu, 
    X, 
    Home, 
    FileText, 
    Plus, 
    Settings, 
    User, 
    LogOut, 
    BarChart3, 
    Users, 
    Edit3,
    Trash2,
    Calendar,
    Clock,
    Tag
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../components/Loader";

interface Author {
    name: string;
    avatar: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: Author;
    categories: string[];
    publishedAt: string;
    coverImage: string;
    readingTime: string;
    userId?: string; // Add userId field
    userName?: string; // Add userName field
}

function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, loading: userLoading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let postsQuery;
                
                if (isAdmin) {
                    // Admin can see all posts
                    postsQuery = collection(db, "posts");
                } else {
                    // Regular users can only see their own posts
                    postsQuery = query(
                        collection(db, "posts"),
                        where("userId", "==", user?.uid)
                    );
                }

                const querySnapshot = await getDocs(postsQuery);
                const postsData: Post[] = [];
                
                querySnapshot.forEach((doc) => {
                    postsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Post);
                });

                // Fetch user names for posts
                if (isAdmin && postsData.length > 0) {
                    const usersQuery = collection(db, "users");
                    const usersSnapshot = await getDocs(usersQuery);
                    const usersMap = new Map();
                    
                    usersSnapshot.forEach((userDoc) => {
                        const userData = userDoc.data();
                        usersMap.set(userDoc.id, userData.displayName || "Unknown User");
                    });

                    // Add user names to posts
                    postsData.forEach(post => {
                        if (post.userId) {
                            post.userName = usersMap.get(post.userId) || "Unknown User";
                        }
                    });
                }

                setPosts(postsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        if (!userLoading && user) {
            fetchPosts();
        }
    }, [user, userLoading, isAdmin]);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                // Check if user has permission to delete this post
                const postToDelete = posts.find(post => post.id === id);
                if (!isAdmin && postToDelete?.userId !== user?.uid) {
                    alert("You don't have permission to delete this post");
                    return;
                }

                await deleteDoc(doc(db, "posts", id));
                
                // Decrement user's post count
                if (postToDelete?.userId) {
                    const userRef = doc(db, "users", postToDelete.userId);
                    await updateDoc(userRef, {
                        postCount: increment(-1)
                    });
                }
                
                setPosts(posts.filter(post => post.id !== id));
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Error deleting post. Please try again.");
            }
        }
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading ) {
        return (
                <div >
                    <Loader/>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-2xl md:hidden"
                        >
                            <SidebarContent user={user!} handleLogout={handleLogout} isAdmin={isAdmin} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 bg-white shadow-2xl fixed inset-y-0 left-0 z-30">
                <SidebarContent user={user!} handleLogout={handleLogout} isAdmin={isAdmin} />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-80 p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                        </h1>
                        <p className="text-gray-600 mt-2">Manage your content and settings</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg">
                            <div className={`w-3 h-3 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                            <span className={`text-sm font-semibold ${isAdmin ? 'text-purple-700' : 'text-blue-700'}`}>
                                {isAdmin ? "Administrator" : "User"}
                            </span>
                        </div>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            {isAdmin ? "No posts found" : "You haven't created any posts yet"}
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {isAdmin ? "There are no posts in the system." : "Start by creating your first post!"}
                        </p>
                        <Link
                            href="/dashboard/add"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Post
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Tag className="w-4 h-4 text-gray-400" />
                                        {post.categories && post.categories.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories.slice(0, 2).map((category, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/categories/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        {category}
                                                        {index < Math.min(post.categories.length, 2) - 1 && ", "}
                                                    </Link>
                                                ))}
                                                {post.categories.length > 2 && (
                                                    <span className="text-sm text-gray-500">
                                                        +{post.categories.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">Uncategorized</span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{post.readingTime}</span>
                                        </div>
                                    </div>
                                    
                                    {isAdmin && post.userName && (
                                        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-500">Author: {post.userName}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-2">
                                        <Link 
                                            href={`/dashboard/edit/${post.id}`} 
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <Button
                                            onPress={() => handleDelete(post.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Sidebar content extracted for reuse
function SidebarContent({
    user,
    handleLogout,
    isAdmin,
}: {
    user: {
        displayName?: string | null;
        email?: string | null;
        photoURL?: string | null;
    },
    handleLogout: () => void;
    isAdmin: boolean;
}) {
    const [activeSection, setActiveSection] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
        { id: 'posts', label: 'My Posts', icon: FileText, href: '/dashboard/posts' },
        { id: 'add', label: 'Create Post', icon: Plus, href: '/dashboard/add' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
        { id: 'users', label: 'Users', icon: Users, href: '/dashboard/users', adminOnly: true },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
        { id: 'profile', label: 'Profile', icon: User, href: '/dashboard/profile' },
    ];

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <Link href="/dashboard" className="block">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">BlogPost</h1>
                            <p className="text-sm text-gray-500">Tawa&apos;s Panel</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        if (item.adminOnly && !isAdmin) return null;
                        
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    activeSection === item.id
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                                onClick={() => setActiveSection(item.id)}
                            >
                                <item.icon className={`w-5 h-5 ${
                                    activeSection === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                                }`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile Section */}
            <div className="p-6 border-t border-gray-200">
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            {user?.photoURL ? (
                                <Image
                                    src={user.photoURL}
                                    alt="User Avatar"
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                            )}
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                isAdmin ? 'bg-purple-500' : 'bg-green-500'
                            }`}></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                                {user.displayName ?? "User"}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                <span className={`text-xs font-medium ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`}>
                                    {isAdmin ? "Administrator" : "Regular User"}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <User className="w-4 h-4" />
                            Edit Profile
                        </Link>
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminPage() {
  return (
    <DashboardAuthWrapper>
      <AdminDashboard />
    </DashboardAuthWrapper>
  );
}
