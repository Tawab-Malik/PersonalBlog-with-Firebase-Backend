"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/config";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { Button } from "@heroui/react";
import Loader from "@/app/components/Loader";
import { useAuth } from "@/app/hooks/useAuth";
import { ArrowLeft, Save, Image as ImageIcon, Calendar, Clock, FileText, Hash, Type, Edit3 } from "lucide-react";
import Image from "next/image";

function EditPostForm() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading, isAdmin } = useAuth();
    const [post, setPost] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        publishedAt: "",
        readingTime: "",
        userId: "",
        status: "draft" as 'draft' | 'published' | 'archived'
    });
    const [loadingPost, setLoadingPost] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const ref = doc(db, "posts", id as string);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setError("Post not found");
                    setLoadingPost(false);
                    return;
                }

                const data = snap.data();
                
                // Check if user has permission to edit this post
                if (!isAdmin && data.userId !== user?.uid) {
                    setError("You don't have permission to edit this post");
                    setLoadingPost(false);
                    return;
                }

                setPost({
                    title: data.title ?? "",
                    slug: data.slug ?? "",
                    excerpt: data.excerpt ?? "",
                    content: data.content ?? "",
                    coverImage: data.coverImage ?? "",
                    publishedAt: data.publishedAt ?? "",
                    readingTime: data.readingTime ?? "",
                    userId: data.userId ?? "",
                    status: data.status ?? "draft"
                });
                setPreviewImage(data.coverImage ?? "");
                setLoadingPost(false);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Error loading post");
                setLoadingPost(false);
            }
        };

        if (!loading && user) {
        fetchPost();
        }
    }, [id, user, loading, isAdmin]);

    const handleUpdate = async () => {
        setIsSubmitting(true);
        try {
        const ref = doc(db, "posts", id as string);
            const updateData = {
                title: post.title,
                slug: post.slug || generateSlug(post.title),
                excerpt: post.excerpt,
                content: post.content,
                coverImage: post.coverImage,
                publishedAt: post.publishedAt,
                readingTime: post.readingTime,
                status: post.status,
                updatedAt: new Date().toISOString()
            };

            await updateDoc(ref, updateData);
        alert("Post updated successfully!");
            router.push("/dashboard");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Error updating post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading || loadingPost) {
        return (
            <div >
                    <Loader/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">❌</span>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error}
                        </p>
                        <Button
                            onPress={() => router.push("/dashboard")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onPress={() => router.push("/dashboard")}
                        className="mb-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                    
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Edit3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Edit Post</h1>
                                <p className="text-gray-600">Update your post content and settings</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {isAdmin ? "Admin" : "User"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Type className="w-4 h-4" />
                                        Post Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                        placeholder="Enter an engaging title for your post..."
                                    />
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Hash className="w-4 h-4" />
                                        URL Slug
                                    </label>
                    <input
                        type="text"
                                        value={post.slug}
                                        onChange={(e) => setPost({ ...post, slug: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder={post.title ? generateSlug(post.title) : "post-url-slug"}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Leave empty to auto-generate from title
                                    </p>
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <FileText className="w-4 h-4" />
                                        Excerpt *
                                    </label>
                                    <textarea
                                        value={post.excerpt}
                                        onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Write a brief, compelling description of your post..."
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <FileText className="w-4 h-4" />
                                        Content *
                                    </label>
                                    <textarea
                                        value={post.content}
                                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                                        rows={12}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Write your post content here. You can use markdown formatting:

# Main Heading
## Sub Heading
### Smaller Heading

- Bullet point 1
- Bullet point 2

**Bold text** and *italic text*

[Link text](https://example.com)

Separate paragraphs with double line breaks."
                    />
                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Cover Image */}
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <ImageIcon className="w-4 h-4" />
                                        Cover Image *
                                    </label>
                                    <input
                                        type="url"
                                        value={post.coverImage}
                                        onChange={(e) => {
                                            setPost({ ...post, coverImage: e.target.value });
                                            setPreviewImage(e.target.value);
                                        }}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    
                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="mt-3">
                                            <Image
                                                width={100}
                                                height={100}
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg border"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Published Date */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Calendar className="w-4 h-4" />
                                        Published Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={post.publishedAt}
                                        onChange={(e) => setPost({ ...post, publishedAt: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>

                                {/* Reading Time */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Clock className="w-4 h-4" />
                                        Reading Time *
                                    </label>
                                    <input
                                        type="text"
                                        value={post.readingTime}
                                        onChange={(e) => setPost({ ...post, readingTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="5 min read"
                                    />
                                </div>

                                {/* Status Selection */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <span className="w-4 h-4">📊</span>
                                        Post Status
                                    </label>
                                    <div className="flex gap-3">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="draft"
                                                checked={post.status === "draft"}
                                                onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' | 'archived' })}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">Draft</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="published"
                                                checked={post.status === "published"}
                                                onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' | 'archived' })}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">Published</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="archived"
                                                checked={post.status === "archived"}
                                                onChange={(e) => setPost({ ...post, status: e.target.value as 'draft' | 'published' | 'archived' })}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm">Archived</span>
                                        </label>
                                    </div>
                                </div>

                                {/* User ID (Admin Only) */}
                                {isAdmin && post.userId && (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <span className="w-4 h-4">👤</span>
                                            User ID (Read-only)
                                        </label>
                                        <input
                                            type="text"
                                            value={post.userId}
                                            readOnly
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                                        />
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-6 space-y-3">
                                    <Button
                                        onPress={handleUpdate}
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Updating Post...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                Update Post
                                            </div>
                                        )}
                                    </Button>
                                    
                                    <Button
                                        onPress={() => router.push("/dashboard")}
                                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                    >
                                        Cancel
            </Button>
                                </div>

                                {/* Tips */}
                                <div className="bg-green-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-green-800 mb-2">💡 Editing Tips</h4>
                                    <ul className="text-sm text-green-700 space-y-1">
                                        <li>• Preview your changes</li>
                                        <li>• Check image URLs work</li>
                                        <li>• Update reading time if needed</li>
                                        <li>• Save frequently</li>
                                    </ul>
                                </div>
                                
                                {/* Markdown Help */}
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Markdown Formatting Help:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                        <div><code className="bg-white px-1 rounded"># Heading</code> - Main heading</div>
                                        <div><code className="bg-white px-1 rounded">## Subheading</code> - Sub heading</div>
                                        <div><code className="bg-white px-1 rounded">- Item</code> - Bullet point</div>
                                        <div><code className="bg-white px-1 rounded">**Bold**</code> - Bold text</div>
                                        <div><code className="bg-white px-1 rounded">*Italic*</code> - Italic text</div>
                                        <div><code className="bg-white px-1 rounded">[Link](url)</code> - Hyperlink</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EditPostPage() {
    return (
    <DashboardAuthWrapper>
            <EditPostForm />
    </DashboardAuthWrapper>
    );
}
