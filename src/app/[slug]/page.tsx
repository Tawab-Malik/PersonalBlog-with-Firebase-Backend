"use client";
import { useEffect, useState } from "react";
import {useParams} from "next/navigation";
import Image from "next/image";
import { CalendarDays, Clock, User } from "lucide-react";

import { db } from "../../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import Loader from "@/app/components/Loader";
import { notFound } from "next/navigation";

interface Author {
    name: string;
    avatar?: string;
}

interface Post {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string; // or Date, if you parse it
    readingTime: string;
    categories?: string[];
    author?: Author;
}
export default function SingleBlog() {
    const params = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [shouldShowNotFound, setShouldShowNotFound] = useState(false);

    useEffect(() => {
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

        fetchPost();
    }, [params.slug]);

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
                        {post!.author?.name || "Anonymous"}
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

                <div className="prose prose-lg prose-indigo max-w-none text-gray-800">
                    <div dangerouslySetInnerHTML={{ __html: post!.content }} />
                </div>
            </article>
        
        </>
    );
}
