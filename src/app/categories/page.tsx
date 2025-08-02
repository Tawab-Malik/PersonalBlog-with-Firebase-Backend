"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    Hash, 
    FileText, 

    Clock, 
    ArrowRight,
    Tag,
    TrendingUp,
    Users,
    BookOpen
} from "lucide-react";
import Loader from "../components/Loader";

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage: string;
    publishedAt: string;
    readingTime: string;
    categories: string[];
    author: {
        name: string;
        avatar: string;
        email?: string;
    };
}

interface User {
    uid: string;
    username: string;
    email: string;
    profileImage: string;
    bio: string;
    location?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    createdAt: string;
    isAdmin: boolean;
}

interface Category {
    name: string;
    slug: string;
    postCount: number;
    featuredPosts: Post[];
    description: string;
}

function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Get all users first
                const usersQuery = collection(db, "users");
                const usersSnapshot = await getDocs(usersQuery);
                const usersData: User[] = [];
                
                usersSnapshot.forEach((doc) => {
                    usersData.push({
                        uid: doc.id,
                        ...doc.data()
                    } as User);
                });
                setUsers(usersData);

                const postsQuery = collection(db, "posts");
                const querySnapshot = await getDocs(postsQuery);
                const postsData: Post[] = [];
                
                querySnapshot.forEach((doc) => {
                    postsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Post);
                });

                // Group posts by category
                const categoryMap = new Map<string, Post[]>();
                postsData.forEach(post => {
                    if (post.categories && post.categories.length > 0) {
                        post.categories.forEach(category => {
                            if (!categoryMap.has(category)) {
                                categoryMap.set(category, []);
                            }
                            categoryMap.get(category)!.push(post);
                        });
                    }
                });

                // Create category objects
                const categoriesData: Category[] = Array.from(categoryMap.entries()).map(([name, posts]) => ({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    postCount: posts.length,
                    featuredPosts: posts.slice(0, 3), // Show first 3 posts as featured
                    description: `Explore ${posts.length} articles about ${name.toLowerCase()}`
                }));

                // Sort by post count (most popular first)
                categoriesData.sort((a, b) => b.postCount - a.postCount);
                setCategories(categoriesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Function to get author username by email
    const getAuthorUsername = (authorEmail: string) => {
        const user = users.find(u => u.email === authorEmail);
        return user ? user.username : authorEmail.split('@')[0];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 mb-6"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                                <Hash className="w-8 h-8 text-white" />
                            </div>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4"
                        >
                            Explore Categories
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            Discover content organized by topics that interest you
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500"
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{categories.length} Categories</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{categories.reduce((sum, cat) => sum + cat.postCount, 0)} Articles</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {categories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Hash className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">No categories found</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Categories will appear here once posts are created with category tags.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <ArrowRight className="w-5 h-5" />
                            Browse All Posts
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {categories.map((category, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Category Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                                                <Tag className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                    {category.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <FileText className="w-4 h-4" />
                                                        <span>{category.postCount} posts</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href={`/categories/${category.slug}`}
                                            className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                        </Link>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {category.description}
                                    </p>
                                </div>

                                {/* Featured Posts */}
                                {category.featuredPosts.length > 0 && (
                                    <div className="p-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Featured Posts
                                        </h4>
                                        <div className="space-y-3">
                                            {category.featuredPosts.map((post) => (
                                                <Link
                                                    key={post.id}
                                                    href={`/${post.slug}`}
                                                    className="block group/post"
                                                >
                                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={post.coverImage}
                                                                alt={post.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-sm font-medium text-gray-800 group-hover/post:text-blue-600 transition-colors line-clamp-2">
                                                                {post.title}
                                                            </h5>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="w-3 h-3" />
                                                                    <span>{post.author.email ? getAuthorUsername(post.author.email) : post.author.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    <span>{post.readingTime}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Category Footer */}
                                <div className="p-6 bg-gray-50">
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium group-hover:bg-blue-50 group-hover:text-blue-600"
                                    >
                                        View All {category.postCount} Posts
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CategoriesPage; 