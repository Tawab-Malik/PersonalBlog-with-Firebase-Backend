"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebase/config";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        className="fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg md:hidden"
                    >
                        <SidebarContent user={user!} handleLogout={handleLogout} isAdmin={isAdmin} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden md:block w-1/4 bg-white shadow-lg fixed inset-y-0 left-0 z-30">
                <SidebarContent user={user!} handleLogout={handleLogout} isAdmin={isAdmin} />
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full md:ml-[25%] p-6 md:p-10">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-black">
                        {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {isAdmin ? "Admin" : "User"}
                        </span>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {isAdmin ? "No posts found" : "You haven't created any posts yet"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {isAdmin ? "There are no posts in the system." : "Start by creating your first post!"}
                        </p>
                        <Link
                            href="/dashboard/add"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Create New Post
                        </Link>
                    </div>
                ) : (
                    <ul className="gap-6 grid md:grid-cols-2 xl:grid-cols-3">
                        {posts.map(post => (
                            <li
                                key={post.id}
                                className="p-4 border rounded shadow flex flex-col justify-between items-start gap-4 bg-white"
                            >
                                <div className="w-full">
                                    <span className="block text-lg font-semibold">{post.title}</span>
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full object-cover mt-2 rounded"
                                        height={192}
                                        width={300}
                                    />
                                    {isAdmin && post.userId && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            User ID: {post.userId}
                                        </p>
                                    )}
                                </div>
                                <div className="space-x-4">
                                    <Link href={`/dashboard/edit/${post.id}`} className="text-blue-600 underline">
                                        Edit
                                    </Link>
                                    <Button
                                        onPress={() => handleDelete(post.id)}
                                        className="text-red-600 underline cursor-pointer bg-transparent shadow-none px-2"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
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
    return (
        <>
            <Link href={"/dashboard"}>
                <Image
                    src="/images/logo.webp"
                    alt="Dashboard"
                    className="object-cover mb-4 rounded"
                    height={60}
                    width={180}
                />
            </Link>

            <div className="flex flex-col justify-between items-start gap-4 h-[calc(100%-10rem)]">
                <Link
                    href="/dashboard/add"
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full text-center"
                >
                    Add New Post
                </Link>
                <div className="border-t border-gray-300 pt-4 mt-auto w-full">
                    {user?.photoURL && (
                        <Image
                            src={user.photoURL}
                            alt="User Avatar"
                            width={50}
                            height={50}
                            className="rounded-full mx-auto mb-2"
                        />
                    )}
                    <h3 className="text-xl text-center font-medium text-gray-700">
                        {user.displayName ?? "User"}
                    </h3>
                    <p className="text-sm text-center text-gray-500 mb-2">
                        {isAdmin ? "Administrator" : "Regular User"}
                    </p>
                    <Button
                        onPress={handleLogout}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full hover:bg-red-700 transition"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </>
    );
}

export default function AdminPage() {
  return (
    <DashboardAuthWrapper>
      <AdminDashboard />
    </DashboardAuthWrapper>
  );
}
