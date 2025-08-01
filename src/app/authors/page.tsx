"use client";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    User, 
    Mail, 
    Search,
    Users,
    BookOpen,
    Globe,
    Twitter,
    Linkedin,
    Github
} from "lucide-react";
import Loader from "../components/Loader";

interface Author {
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

interface Post {
    id: string;
    author: {
        email: string;
    };
}

function AuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get all users
                const usersQuery = collection(db, "users");
                const usersSnapshot = await getDocs(usersQuery);
                const authorsData: Author[] = [];
                
                usersSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    authorsData.push({
                        uid: doc.id,
                        ...userData
                    } as Author);
                });

                // Get all posts to count author posts
                const postsQuery = collection(db, "posts");
                const postsSnapshot = await getDocs(postsQuery);
                const postsData: Post[] = [];
                
                postsSnapshot.forEach((doc) => {
                    postsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Post);
                });

                setAuthors(authorsData);
                setPosts(postsData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getAuthorPostCount = (authorEmail: string) => {
        return posts.filter(post => post.author?.email === authorEmail).length;
    };

    const filteredAuthors = authors.filter(author =>
        author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (author.bio && author.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-6">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Authors</h1>
                        <p className="text-gray-600">Meet the talented writers behind our content</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-3 top-6 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Authors</p>
                                    <p className="text-2xl font-bold text-gray-800">{authors.length}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Posts</p>
                                    <p className="text-2xl font-bold text-gray-800">{posts.length}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Writers</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {authors.filter(author => getAuthorPostCount(author.email) > 0).length}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Authors Grid */}
                {filteredAuthors.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Authors Found</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            {searchTerm ? "Try adjusting your search terms." : "No authors available at the moment."}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAuthors.map((author, index) => {
                            const postCount = getAuthorPostCount(author.email);
                            const authorSlug = author.username.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                            
                            return (
                                <motion.div
                                    key={author.uid}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="p-6">
                                        {/* Author Header */}
                                        <div className="text-center mb-6">
                                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                                                {author.profileImage ? (
                                                    <Image
                                                        src={author.profileImage}
                                                        alt={author.username}
                                                        width={80}
                                                        height={80}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-10 h-10 text-gray-400" />
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">{author.username}</h3>
                                            {author.isAdmin && (
                                                <span className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                                                    Admin
                                                </span>
                                            )}
                                            <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                                                <Mail className="w-4 h-4" />
                                                <span>{author.email}</span>
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        {author.bio && (
                                            <div className="mb-6">
                                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                    {author.bio}
                                                </p>
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-gray-800">{postCount}</p>
                                                <p className="text-xs text-gray-500">Posts</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-gray-600">
                                                    {new Date(author.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">Joined</p>
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        {(author.website || author.twitter || author.linkedin || author.github) && (
                                            <div className="mb-6">
                                                <div className="flex justify-center gap-3">
                                                    {author.website && (
                                                        <a
                                                            href={author.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Globe className="w-4 h-4 text-gray-600" />
                                                        </a>
                                                    )}
                                                    {author.twitter && (
                                                        <a
                                                            href={`https://twitter.com/${author.twitter}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Twitter className="w-4 h-4 text-gray-600" />
                                                        </a>
                                                    )}
                                                    {author.linkedin && (
                                                        <a
                                                            href={`https://linkedin.com/in/${author.linkedin}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Linkedin className="w-4 h-4 text-gray-600" />
                                                        </a>
                                                    )}
                                                    {author.github && (
                                                        <a
                                                            href={`https://github.com/${author.github}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                                                        >
                                                            <Github className="w-4 h-4 text-gray-600" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* View Profile Button */}
                                        <Link
                                            href={`/authors/${authorSlug}`}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center block"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AuthorsPage; 