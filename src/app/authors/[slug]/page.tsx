"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
    User, 
    Mail, 
    Calendar, 
    FileText, 
    ArrowLeft,
   
    Globe,
    Twitter,
    Linkedin,
    Github,
    BookOpen,
    Clock,
    Tag
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
        email?: string;
    };
}

interface Author {
    uid: string;
    username?: string;
    displayName?: string;
    email: string;
    profileImage?: string;
    photoURL?: string;
    bio?: string;
    location?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    createdAt?: string;
    isAdmin?: boolean;
}

function AuthorPage() {
    const { slug } = useParams();
    const [author, setAuthor] = useState<Author | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                // First, get all users to find the author by username
                const usersQuery = collection(db, "users");
                const usersSnapshot = await getDocs(usersQuery);
                
                let foundAuthor: Author | null = null;
                usersSnapshot.forEach((doc) => {
                    const userData = doc.data();
                    const nameToUse = userData.displayName || userData.username;
                    const userSlug = nameToUse?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    if (userSlug === slug) {
                        foundAuthor = {
                            uid: doc.id,
                            ...userData
                        } as Author;
                    }
                });

                if (foundAuthor) {
                    // userProfiles کلیکشن سے اضافی ڈیٹا حاصل کریں
                    try {
                        const userProfileDoc = await getDoc(doc(db, "userProfiles", (foundAuthor as Author).uid));
                        if (userProfileDoc.exists()) {
                            const profileData = userProfileDoc.data() as Partial<Author>;
                            // پروفائل ڈیٹا کے ساتھ foundAuthor کو اپڈیٹ کریں
                            if ('photoURL' in profileData && typeof profileData.photoURL === 'string') {
                                (foundAuthor as Author).photoURL = profileData.photoURL;
                            }
                            if ('displayName' in profileData && typeof profileData.displayName === 'string') {
                                (foundAuthor as Author).displayName = profileData.displayName;
                            }
                        }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    } catch (error) {
                        console.log("No userProfiles data found for this user" );
                    }
                }

                if (!foundAuthor) {
                    setError("Author not found");
                    setLoading(false);
                    return;
                }

                setAuthor(foundAuthor);

                // Get posts by this author
                const postsQuery = collection(db, "posts");
                const postsSnapshot = await getDocs(postsQuery);
                const authorPosts: Post[] = [];
                
                postsSnapshot.forEach((doc) => {
                    const postData = doc.data();
                    // Match by author email for consistency
                    if (foundAuthor && postData.author?.email === foundAuthor.email) {
                        authorPosts.push({
                            id: doc.id,
                            ...postData
                        } as Post);
                    }
                });

                // Sort posts by published date (newest first)
                authorPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
                setPosts(authorPosts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching author data:", error);
                setError("Failed to load author data");
                setLoading(false);
            }
        };

        if (slug) {
            fetchAuthorData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error || !author) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Author Not Found</h1>
                    <p className="text-gray-600 mb-6">The author you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

      console.log(author)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/"
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                {(author.photoURL || author.profileImage) ? (
                                    <Image
                                        src={author.photoURL || author.profileImage || ""}
                                        alt={author.displayName || author.username || ""}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">{author.displayName || author.username}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{posts.length} posts</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {author.createdAt ? new Date(author.createdAt).toLocaleDateString() : "Unknown"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Author Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                                    {(author.photoURL || author.profileImage) ? (
                                        <Image
                                            src={author.photoURL || author.profileImage || ""}
                                            alt={author.displayName || author.username || ""}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-1">{author.displayName || author.username}</h2>
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

                            {author.bio && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{author.bio}</p>
                                </div>
                            )}

                            {/* Social Links */}
                            {(author.website || author.twitter || author.linkedin || author.github) && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Connect</h3>
                                    <div className="space-y-2">
                                        {author.website && (
                                            <a
                                                href={author.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                            >
                                                <Globe className="w-4 h-4" />
                                                <span>Website</span>
                                            </a>
                                        )}
                                        {author.twitter && (
                                            <a
                                                href={`https://twitter.com/${author.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                            >
                                                <Twitter className="w-4 h-4" />
                                                <span>Twitter</span>
                                            </a>
                                        )}
                                        {author.linkedin && (
                                            <a
                                                href={`https://linkedin.com/in/${author.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                <span>LinkedIn</span>
                                            </a>
                                        )}
                                        {author.github && (
                                            <a
                                                href={`https://github.com/${author.github}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                                            >
                                                <Github className="w-4 h-4" />
                                                <span>GitHub</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Stats</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Total Posts</span>
                                        <span className="font-semibold text-gray-800">{posts.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Member Since</span>
                                        <span className="font-semibold text-gray-800">
                                            {author.createdAt ? new Date(author.createdAt).toLocaleDateString() : "Unknown"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts */}
                    <div className="lg:col-span-3">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Posts by {author.displayName || author.username}</h2>
                            <p className="text-gray-600">Latest articles and insights</p>
                        </div>

                        {posts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 bg-white rounded-2xl shadow-lg"
                            >
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Posts Yet</h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    {author.displayName || author.username} hasn&apos;t published any posts yet. Check back later for new content!
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2">
                                {posts.map((post, index) => (
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
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{post.readingTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthorPage; 