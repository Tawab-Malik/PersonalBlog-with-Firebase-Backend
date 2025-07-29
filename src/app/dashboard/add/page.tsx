"use client";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { ArrowLeft, Upload, Image as ImageIcon, Calendar, Clock, FileText, Hash, Type } from "lucide-react";
import Loader from "@/app/components/Loader";

interface FormData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string;
    readingTime: string;
}

function AddPostForm() {
  const { user, loading, isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const watchedTitle = watch("title");

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const onSubmit = async (data: FormData) => {
        if (!user) {
            alert("Please login to create a post");
            return;
        }

        setIsSubmitting(true);

        try {
            // isAdmin is already available from useAuth hook

            const newPost = {
                ...data,
                slug: data.slug || generateSlug(data.title),
                userId: user.uid,
                author: {
                    name: user.displayName || user.email?.split('@')[0] || "Anonymous",
                    avatar: user.photoURL || "/default-avatar.png"
                },
                categories: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isAdmin: isAdmin
            };

            await addDoc(collection(db, "posts"), newPost);
            alert("Post created successfully!");
            router.push("/dashboard");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Error creating post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div >
                <Loader />
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
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Create New Post</h1>
                                <p className="text-gray-600">Share your thoughts with the world</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8">
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
                                        {...register("title", { required: "Title is required" })}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                                        placeholder="Enter an engaging title for your post..."
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Hash className="w-4 h-4" />
                                        URL Slug
                                    </label>
                                    <input
                                        {...register("slug")}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder={watchedTitle ? generateSlug(watchedTitle) : "post-url-slug"}
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
                                        {...register("excerpt", { required: "Excerpt is required" })}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Write a brief, compelling description of your post..."
                                    />
                                    {errors.excerpt && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.excerpt.message}
                                        </p>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <FileText className="w-4 h-4" />
                                        Content *
                                    </label>
                                    <textarea
                                        {...register("content", { required: "Content is required" })}
                                        rows={12}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Write your post content here. You can use markdown formatting..."
                                    />
                                    {errors.content && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.content.message}
                                        </p>
                                    )}
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
                                        {...register("coverImage", { required: "Cover image URL is required" })}
                                        type="url"
                                        onChange={(e) => setPreviewImage(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {errors.coverImage && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.coverImage.message}
                                        </p>
                                    )}

                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="mt-3">
                                            <img
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
                                        {...register("publishedAt", { required: "Published date is required" })}
                                        type="date"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    {errors.publishedAt && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.publishedAt.message}
                                        </p>
                                    )}
                                </div>

                                {/* Reading Time */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Clock className="w-4 h-4" />
                                        Reading Time *
                                    </label>
                                    <input
                                        {...register("readingTime", { required: "Reading time is required" })}
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="5 min read"
                                    />
                                    {errors.readingTime && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {errors.readingTime.message}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Creating Post...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                Publish Post
                                            </div>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        onPress={() => router.push("/dashboard")}
                                        className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold"
                                    >
                                        Cancel
                                    </Button>
                                </div>

                                {/* Tips */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">💡 Tips for better posts</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• Write engaging titles</li>
                                        <li>• Use high-quality images</li>
                                        <li>• Keep content well-structured</li>
                                        <li>• Add relevant tags later</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function AddPostPage() {
    return (
        <DashboardAuthWrapper>
            <AddPostForm />
        </DashboardAuthWrapper>
    );
}
