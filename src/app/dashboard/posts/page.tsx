"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { Plus, Edit3, Trash2, Eye, Search, FileText } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../../components/Loader";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    coverImage: string;
    userId?: string;
    userName?: string;
    status?: 'published' | 'draft' | 'archived';
}

function PostsManagement() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const { user, loading: userLoading } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Posts management page میں صرف اپنی posts دیکھیں
                const postsQuery = query(
                    collection(db, "posts"),
                    where("userId", "==", user?.uid)
                );

                const querySnapshot = await getDocs(postsQuery);
                const postsData: Post[] = [];
                
                querySnapshot.forEach((doc) => {
                    postsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Post);
                });

                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (user && !userLoading) {
            fetchPosts();
        }
    }, [user, userLoading]);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deleteDoc(doc(db, "posts", id));
                setPosts(posts.filter(post => post.id !== id));
                alert("Post deleted successfully!");
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Error deleting post!");
            }
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (userLoading || loading) {
        return <Loader />;
    }

    return (
        <DashboardAuthWrapper>
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
                            <p className="text-gray-600 mt-2">Search and manage your posts</p>
                        </div>
                        <Link href="/dashboard/add">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Post
                            </Button>
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-6 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search your posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Posts Count */}
                    <div className="mb-4 text-sm text-gray-600">
                        {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                    </div>

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-48">
                                    <Image
                                        src={post.coverImage || "/images/default-post.jpg"}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/default-post.jpg";
                                        }}
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            post.status === 'published' 
                                                ? 'bg-green-100 text-green-800' 
                                                : post.status === 'draft'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {post.status || 'draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={`/${post.slug}`}>
                                                <Button size="sm" variant="ghost" title="View Post">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/edit/${post.id}`}>
                                                <Button size="sm" variant="ghost" title="Edit Post">
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-700"
                                                title="Delete Post"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'No posts found' : 'No posts yet'}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchTerm 
                                    ? 'No posts found matching your search. Try different keywords.' 
                                    : 'Start creating your first post to share your thoughts with the world.'
                                }
                            </p>
                            {!searchTerm && (
                                <Link href="/dashboard/add">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Post
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardAuthWrapper>
    );
}

export default PostsManagement; 