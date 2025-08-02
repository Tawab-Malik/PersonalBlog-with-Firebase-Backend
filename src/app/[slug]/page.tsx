"use client";
import { useEffect, useState } from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, User, MessageCircle, Send, Reply } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { db } from "../../../firebase/config";
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "@/app/components/Loader";
import CommentLikeButton from "@/app/components/CommentLikeButton";
import { createNotification } from "@/lib/notificationService";
import { notFound } from "next/navigation";

interface User {
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

interface Author {
    name: string;
    avatar?: string;
    email?: string;
}

interface Post {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string;
    readingTime: string;
    categories?: string[];
    author?: Author;
}

interface Comment {
    id: string;
    content: string;
    author: {
        name: string;
        email: string;
        avatar?: string;
    };
    createdAt: Timestamp | Date;
    postSlug: string;
    likes: number;
    replies?: Comment[];
}

export default function SingleBlog() {
    const params = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [shouldShowNotFound, setShouldShowNotFound] = useState(false);

    // Helper functions for author data
    const getAuthorUsername = (authorEmail: string) => {
        // console.log("🔍 getAuthorUsername called with:", authorEmail);
        // console.log("📋 Available users:", users.map(u => ({ email: u.email, displayName: u.displayName, username: u.username })));
        const user = users.find(u => u.email === authorEmail);
        // console.log("👤 Found user:", user);
        return user ? (user.displayName || user.username) : authorEmail.split('@')[0];
    };

    const getAuthorSlug = (authorEmail: string) => {
        const user = users.find(u => u.email === authorEmail);
        const nameToUse = user ? (user.displayName || user.username || authorEmail.split('@')[0]) : authorEmail.split('@')[0];
        return nameToUse?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') ?? '';
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                console.log("🔄 Fetching users...");
                const usersQuery = collection(db, "users");
                const usersSnapshot = await getDocs(usersQuery);
                const usersData: User[] = [];
                
                usersSnapshot.forEach((doc) => {
                    const userData = {
                        uid: doc.id,
                        ...doc.data()
                    } as User;
                    usersData.push(userData);
                    console.log("👤 User loaded:", { uid: userData.uid, email: userData.email, displayName: userData.displayName, username: userData.username });
                });
                
                console.log("📊 Total users loaded:", usersData.length);
                setUsers(usersData);
            } catch (error) {
                console.error("❌ Error fetching users:", error);
            }
        };

        const fetchPost = async () => {
            try {
                const q = query(
                    collection(db, "posts"),
                    where("slug", "==", params.slug)
                );
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setPost(querySnapshot.docs[0].data() as Post);
                } else {
                    setShouldShowNotFound(true);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                setShouldShowNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                // First try with orderBy, if it fails, fetch without orderBy
                try {
                    const commentsQuery = query(
                        collection(db, "comments"),
                        where("postSlug", "==", params.slug),
                        orderBy("createdAt", "desc")
                    );
                    const commentsSnapshot = await getDocs(commentsQuery);
                    const commentsData: Comment[] = [];
                    
                    commentsSnapshot.forEach((doc) => {
                        commentsData.push({
                            id: doc.id,
                            ...doc.data()
                        } as Comment);
                    });
                    
                    setComments(commentsData);
                } catch {
                    console.log("Index not ready, fetching without orderBy...");
                    // Fallback: fetch without orderBy and sort client-side
                    const commentsQuery = query(
                        collection(db, "comments"),
                        where("postSlug", "==", params.slug)
                    );
                    const commentsSnapshot = await getDocs(commentsQuery);
                    const commentsData: Comment[] = [];
                    
                    commentsSnapshot.forEach((doc) => {
                        commentsData.push({
                            id: doc.id,
                            ...doc.data()
                        } as Comment);
                    });
                    
                    // Sort by createdAt on client side
                    commentsData.sort((a, b) => {
                        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    });
                    
                    setComments(commentsData);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (params.slug) {
            fetchUsers();
            fetchPost();
            fetchComments();
        }
    }, [params.slug]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim() || !post) return;

        setCommentLoading(true);
        try {
            const commentData = {
                content: newComment.trim(),
                author: {
                    name: user.displayName || "Anonymous",
                    email: user.email || "",
                    avatar: user.photoURL || ""
                },
                postSlug: post.slug,
                createdAt: serverTimestamp(),
                likes: 0
            };

            const commentRef = await addDoc(collection(db, "comments"), commentData);
            setNewComment("");

            // Create notification for post owner
            if (post.author?.email && post.author.email !== user.email) {
                try {
                    console.log("Creating notification for post owner:", {
                        postOwnerEmail: post.author.email,
                        commentAuthorEmail: user.email,
                        postTitle: post.title,
                        postAuthor: post.author
                    });
                    
                    await createNotification({
                        type: "comment",
                        postSlug: post.slug,
                        postTitle: post.title,
                        commentId: commentRef.id,
                        authorName: user.displayName || "Anonymous",
                        authorEmail: user.email || "",
                        recipientEmail: post.author.email
                    });
                    
                    console.log("✅ Notification created successfully for post owner");
                } catch (error) {
                    console.error("❌ Error creating notification for post owner:", error);
                }
            } else {
                console.log("⚠️ Skipping notification creation:", {
                    hasAuthorEmail: !!post.author?.email,
                    isOwnPost: post.author?.email === user.email,
                    postOwnerEmail: post.author?.email,
                    commentAuthorEmail: user.email
                });
            }
            
            // Refresh comments
            try {
                const commentsQuery = query(
                    collection(db, "comments"),
                    where("postSlug", "==", post.slug),
                    orderBy("createdAt", "desc")
                );
                const commentsSnapshot = await getDocs(commentsQuery);
                const commentsData: Comment[] = [];
                
                commentsSnapshot.forEach((doc) => {
                    commentsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Comment);
                });
                
                setComments(commentsData);
            } catch {
                // Fallback: fetch without orderBy and sort client-side
                const commentsQuery = query(
                    collection(db, "comments"),
                    where("postSlug", "==", post.slug)
                );
                const commentsSnapshot = await getDocs(commentsQuery);
                const commentsData: Comment[] = [];
                
                commentsSnapshot.forEach((doc) => {
                    commentsData.push({
                        id: doc.id,
                        ...doc.data()
                    } as Comment);
                });
                
                // Sort by createdAt on client side
                commentsData.sort((a, b) => {
                    const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
                    const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
                    return dateB.getTime() - dateA.getTime();
                });
                
                setComments(commentsData);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setCommentLoading(false);
        }
    };

    const formatDate = (timestamp: Timestamp | Date | null) => {
        if (!timestamp) return "Just now";
        let date: Date;
        if (timestamp instanceof Timestamp) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) return <Loader />;
    if (shouldShowNotFound) {
        notFound();
    }

    return (
        <>
            <article className="max-w-4xl mx-auto px-6 py-12">
                <div className="relative w-full rounded-lg overflow-hidden mb-8">
                    <Image
                        src={post!.coverImage}
                        alt={post!.title}
                        className="w-full"
                        height={400}
                        width={1000}
                    />
                </div>

                <h1 className="text-4xl font-bold text-neutral-900 mb-4">{post!.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {(() => {
                            console.log("📝 Post author data:", post!.author);
                            console.log("👥 Users loaded:", users.length);
                            
                            if (post!.author?.email) {
                                console.log("✅ Using email-based logic for:", post!.author.email);
                                return (
                                    <Link 
                                        href={`/authors/${getAuthorSlug(post!.author.email)}`}
                                        className="hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        {getAuthorUsername(post!.author.email)}
                                    </Link>
                                );
                            } else if (post!.author?.name) {
                                console.log("⚠️ Using name-based fallback for:", post!.author.name);
                                return (
                                    <Link 
                                        href={`/authors/${post!.author.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                        className="hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        {post!.author.name}
                                    </Link>
                                );
                            } else {
                                console.log("❌ No author data found");
                                return "Anonymous";
                            }
                        })()}
                    </div>
                    <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(post!.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post!.readingTime}
                    </div>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {post!.categories?.map((cat: string, index: number) => (
                        <span
                            key={index}
                            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                <p className="text-lg text-gray-700 mb-8">{post!.excerpt}</p>

                <div className="prose prose-lg prose-indigo max-w-none text-gray-800 mb-12">
                    <div dangerouslySetInnerHTML={{ __html: post!.content }} />
                </div>

                {/* Comments Section */}
                <div className="border-t pt-8">
                    <div className="flex items-center gap-2 mb-6">
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                        <h2 className="text-2xl font-bold text-gray-800">
                            Comments ({comments.length})
                        </h2>
                    </div>

                    {/* Comment Form */}
                    {user ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-xl p-6 mb-8"
                        >
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        {user.photoURL ? (
                                            <Image
                                                src={user.photoURL}
                                                alt={user.displayName || "User"}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts..."
                                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            rows={3}
                                            disabled={commentLoading}
                                        />
                                        <div className="flex items-center justify-between mt-3">
                                            <p className="text-sm text-gray-500">
                                                Commenting as <span className="font-medium">{user.displayName || "Anonymous"}</span>
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim() || commentLoading}
                                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {commentLoading ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                ) : (
                                                    <Send className="w-4 h-4" />
                                                )}
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center">
                            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Join the Discussion</h3>
                            <p className="text-blue-700 mb-4">Sign in to leave a comment and engage with other readers.</p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Sign In to Comment
                            </Link>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-gray-50 rounded-xl"
                            >
                                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Comments Yet</h3>
                                <p className="text-gray-500">Be the first to share your thoughts on this post!</p>
                            </motion.div>
                        ) : (
                            <AnimatePresence>
                                {comments.map((comment, index) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white border border-gray-200 rounded-xl p-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                {comment.author.avatar ? (
                                                    <Image
                                                        src={comment.author.avatar}
                                                        alt={comment.author.name}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="font-semibold text-gray-800">{comment.author.name}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <CommentLikeButton
                                                        commentId={comment.id}
                                                        initialLikes={comment.likes}
                                                        postSlug={post!.slug}
                                                        postTitle={post!.title}
                                                    />
                                                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                                                        <Reply className="w-4 h-4" />
                                                        <span>Reply</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </article>
        </>
    );
}
