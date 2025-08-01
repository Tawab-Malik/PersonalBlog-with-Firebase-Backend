"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import { fetchPostsFromFirebase } from "../../../lib/getPosts";
import Loader from "@/app/components/Loader";

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
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            const data = await fetchPostsFromFirebase();
            setPosts(data);
            setLoading(false);
        }
        loadPosts();
    }, []);

    const categories = [
        "All",
        ...Array.from(new Set(posts.flatMap((post) => post.categories))),
    ];

    const filteredPosts =
        selectedCategory === "All"
            ? posts
            : posts.filter((post) => post.categories.includes(selectedCategory));

    return (
        <main className="max-w-6xl mx-auto px-4 py-10" id="blog">
            <h1 className="text-4xl text-black font-bold mb-6">Latest Blog Posts</h1>

            <div className="mb-10 flex flex-wrap gap-3">
                {categories.map((category, id) => (
                    <button
                        key={id}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm rounded-full border transition ${
                            selectedCategory === category
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-indigo-100"
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white shadow rounded-lg overflow-hidden"
                        >
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-64 object-cover"
                                height={300}
                                width={700}
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span>
                    {format(new Date(post.publishedAt), "MMMM dd, yyyy")}
                  </span>
                                    <span>•</span>
                                    <span>{post.readingTime}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-indigo-700">
                                    <Link href={`/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="text-gray-700 mt-2">{post.excerpt}</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <Image
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                        className="w-10 h-10 rounded-full"
                                        height={40}
                                        width={40}
                                    />
                                    <Link 
                                        href={`/authors/${post.author.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                    >
                                        {post.author.name}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
