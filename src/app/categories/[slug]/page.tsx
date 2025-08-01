"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    Hash, 
    FileText, 
    Calendar, 
    Clock, 
    ArrowLeft,
    Tag,
    TrendingUp,
    Users,
    BookOpen,
    ArrowRight,
    Search
} from "lucide-react";
import Loader from "../../components/Loader";

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
    };
}

interface Category {
    name: string;
    slug: string;
    postCount: number;
}

function CategoryPage() {
    const { slug } = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postsQuery = collection(db, "posts");
                const querySnapshot = await getDocs(postsQuery);
                const postsData: Post[] = [];
                
                querySnapshot.forEach((doc) => {
                    postsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Post);
                });

                // Find the current category
                const categoryName = slug?.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const categoryPosts = postsData.filter(post => 
                    post.categories && post.categories.some(cat => 
                        cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
                    )
                );

                setCurrentCategory({
                    name: categoryName || "Unknown Category",
                    slug: slug as string,
                    postCount: categoryPosts.length
                });

                setPosts(categoryPosts);

                // Get all categories for sidebar
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

                const categoriesData: Category[] = Array.from(categoryMap.entries()).map(([name, posts]) => ({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    postCount: posts.length
                }));

                categoriesData.sort((a, b) => b.postCount - a.postCount);
                setAllCategories(categoriesData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Hash className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Category Not Found</h1>
                    <p className="text-gray-600 mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/categories"
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Tag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{currentCategory.name}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{currentCategory.postCount} posts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search posts in this category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {filteredPosts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white rounded-2xl shadow-lg"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                                    {searchTerm ? "No posts found" : "No posts in this category"}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    {searchTerm 
                                        ? "Try adjusting your search terms." 
                                        : "Posts will appear here once they're added to this category."}
                                </p>
                                <Link
                                    href="/categories"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Browse All Categories
                                </Link>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {filteredPosts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        <Link href={`/${post.slug}`}>
                                            <div className="relative h-48 overflow-hidden">
                                                <Image
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        </Link>
                                        
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Tag className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">
                                                    {post.categories?.[0] || "Uncategorized"}
                                                </span>
                                            </div>
                                            
                                            <Link href={`/${post.slug}`}>
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                            
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
                                            
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <Link 
                                                        href={`/authors/${post.author.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                                        className="text-sm text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                    >
                                                        {post.author.name}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Categories List */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5" />
                                All Categories
                            </h3>
                            <div className="space-y-2">
                                {allCategories.map((category,index) => (
                                    <Link
                                        key={index}
                                        href={`/categories/${category.slug}`}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                            category.slug === slug
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${
                                                category.slug === slug ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}></div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {category.postCount}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Related Categories */}
                        {allCategories.filter(cat => cat.slug !== slug).length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Related Categories
                                </h3>
                                <div className="space-y-3">
                                    {allCategories
                                        .filter(cat => cat.slug !== slug)
                                        .slice(0, 5)
                                        .map((category,index) => (
                                            <Link
                                                key={index}
                                                href={`/categories/${category.slug}`}
                                                className="block group"
                                            >
                                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Tag className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                                                            {category.name}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {category.postCount} posts
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                            </Link>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Category Stats
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">Total Posts</span>
                                    <span className="font-semibold">{currentCategory.postCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">Categories</span>
                                    <span className="font-semibold">{allCategories.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryPage; 