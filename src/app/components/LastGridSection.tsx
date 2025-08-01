"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { GoArrowRight } from "react-icons/go";
import { useEffect, useState } from "react";
import { fetchPostsFromFirebase } from "../../../lib/getPosts";
import Loader from "./Loader";




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


export default function LastGridSection() {

    const [posts, setPosts] = useState<Post[]>([]);
   
    const [loading, setLoading] = useState(true);


    // Latest 3 posts (first is large, next two are small)
    const latestPosts = posts.slice(6, 10).map((post: { slug: string; excerpt: string; title: string; coverImage: string; categories: string[] | string; publishedAt: string; readingTime: string }) => ({
        slug: post.slug,
        content: post.excerpt,
        title: post.title,
        image: post.coverImage,
        category: Array.isArray(post.categories) ? post.categories[0] : post.categories,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "",
        readTime: post.readingTime,
    }));





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

    // const filteredPosts =
    //     selectedCategory === "All"
    //         ? posts
    //         : posts.filter((post) => post.categories.includes(selectedCategory));
    return (
        <section className="max-w-7xl mx-auto px-4 py-12 flex xl:flex-row flex-col-reverse  gap-10 font-manrope">
            {/* Left: Latest Posts */}
            <div className=" w-full">
                {/* Heading Section */}

                <div className="mb-10">
                    <div className="flex items-center  justify-between  w-full">
                        <div>
                            <h2 className="text-3xl font-bold text-[#183354]">Explore Latest</h2>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center justify-start gap-1 border border-[#ff6f61] text-[#ff6f61] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#ff6f61] hover:text-white group duration-200">
                            VIEW ALL
                            <GoArrowRight className="  group-hover:translate-x-4 duration-300 group-hover:!text-white text-lg" />

                        </Link>
                    </div>
                    <div className="mt-3 flex items-center w-full">
                        <div className="h-1 w-[10%] bg-[#ff6f61] rounded" />
                        <div className="h-[2px] flex-1 bg-gray-200 ml-1" />
                    </div>
                </div>



                {/* grid Cards */}
                {loading ? (
                    <Loader/>
                ) : (
                <div className="w-full grid sm:grid-cols-2 gap-6 ">
                    {latestPosts.map((post: { slug: string; content: string; title: string; image: string; category: string; date: string; readTime: string }) => (
                        <Link key={post.slug} href={`/${post.slug}`} className="block text-center group rounded-2xl  shadow hover:shadow-xl transition-all duration-300">
                            <div className="relative pb-5 w-full ">
                                <Image src={post.image} alt={post.title} height={200} width={400} className="rounded-lg h-full transition-transform duration-300" />
                                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /> */}
                                <div className=" -mt-3 px-4">
                                    <Link
                                        href={`/categories/${post.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                                        className="inline-block"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="bg-[#F4796C] text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#e65a4d] transition-colors cursor-pointer">
                                            {post.category}
                                        </span>
                                    </Link>
                                    <h2 className="text-base md:text-xl text-center  font-bold mt-4 text-primary transition-colors duration-200">{post.title}</h2>
                                    <p className="flex gap-x-2 items-center justify-center text-[#6D757F] text-sm font-semibold pt-2.5">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>{post.date}
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg> {post.readTime}
                                    </p>
                                    <p className=" text-[#545E69] text-center  text-base pt-2.5">{post.content}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                )}

            </div>
            {/* Right: categories */}
            <aside className="w-full xl:w-1/3">
                {/* categories*/}
                <p className="text-3xl font-bold text-[#183354]">Categories</p>
                <div className="mt-3 flex items-center w-full">
                    <div className="h-1 w-[10%] bg-[#ff6f61] rounded" />
                    <div className="h-[2px] flex-1 bg-gray-200 ml-1" />
                </div>
                <div className="grid grid-cols-2 justify-start gap-3 items-start mt-10">
                    {categories.map((category, id) => (
                        <Link
                            key={id}
                            href={category === "All" ? "/categories" : `/categories/${category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                            className="block"
                        >
                            <Button
                                className={`px-4 py-2 text-sm rounded-md border w-full transition 
                                     bg-primary text-white hover:!bg-[#F4796C]"
                                    `}
                            >
                                {category}
                            </Button>
                        </Link>
                    ))}
                </div>

            </aside>
        </section>
    );
}
