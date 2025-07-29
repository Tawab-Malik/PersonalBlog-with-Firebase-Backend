"use client";
import Image from "next/image";
import Link from "next/link";
import posts from "../../../data/postData.json"
import { Button } from "@heroui/react";
import { GoArrowRight } from "react-icons/go";
const profile = {
    name: "Abdul Tawab",
    role: "Frontend Developer",
    avatar: "/images/profile.jpeg",
    bio: "Passionate about web development, design, and sharing knowledge. Building modern, accessible, and beautiful web experiences.",
    socials: [
        { name: "Twitter", url: "https://twitter.com/", icon: "M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.67 1.64.9c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 010 19.54a12.8 12.8 0 006.95 2.04c8.34 0 12.9-6.91 12.9-12.9 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z" },
        { name: "GitHub", url: "https://github.com/", icon: "M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.625-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.373-12-12-12z" },
        { name: "LinkedIn", url: "https://linkedin.com/", icon: "M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" },
    ],
};

export default function About() {
    // Latest 3 posts (first is large, next two are small)
    const latestPosts = posts.slice(0, 3).map((post: any) => ({
        slug: post.slug,
        content: post.excerpt,
        title: post.title,
        image: post.coverImage,
        category: Array.isArray(post.categories) ? post.categories[0] : post.categories,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "",
        readTime: post.readingTime,
    }));

    return (
        <section className="max-w-7xl mx-auto px-4 py-12 flex xl:flex-row flex-col-reverse  gap-10 font-manrope">
            {/* Left: Latest Posts */}
            <div className=" w-full">
                {/* Heading Section */}
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


                <div className="flex md:flex-row flex-col w-full gap-6 h-full">
                    {/* Two Small Cards */}
                    <div className="w-full xl:w-1/3 flex flex-col gap-6 ">
                        {latestPosts.slice(1, 3).map((post: any) => (
                            <Link key={post.slug} href={`/${post.slug}`} className="block text-center group rounded-2xl  shadow hover:shadow-xl transition-all duration-300">
                                <div className="relative pb-5 w-full ">
                                    <Image src={post.image} alt={post.title} height={200} width={400} className="rounded-lg  transition-transform duration-300" />
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /> */}
                                    <div className=" -mt-3 px-4">
                                        <span className="bg-[#F4796C] text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider">{post.category}</span>
                                        <h2 className="text-base md:text-xl font-bold mt-4 text-primary transition-colors duration-200">{post.title}</h2>                                        <p className="flex gap-x-2 items-center justify-center text-[#6D757F] text-sm font-semibold pt-2.5">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>{post.date}
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg> {post.readTime}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="w-full xl:w-2/3 h-full">
                        {/* Large Card */}
                        {latestPosts[0] && (
                            <Link href={`/${latestPosts[0].slug}`} className="block text-center group rounded-2xl  shadow-lg hover:shadow-2xl transition-all duration-300">
                                <div className="relative pb-5 w-full">
                                    <Image src={latestPosts[0].image || "/images/default.jpg"} height={500} width={800} alt={latestPosts[0].title || "Post"} className="rounded-lg  transition-transform duration-300" />
                                    {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /> */}
                                    <div className="  -mt-3 px-4 ">
                                        <span className="bg-[#F4796C] text-white px-3 py-1 rounded text-sm font-semibold uppercase tracking-wider">{latestPosts[0].category}</span>
                                        <h2 className="text-2xl md:text-3xl font-bold mt-4 text-primary transition-colors duration-200">{latestPosts[0].title}</h2>
                                        <p className="flex gap-x-2 items-center justify-center text-[#6D757F] text-sm font-semibold pt-2.5">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>{latestPosts[0].date}
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg> {latestPosts[0].readTime}</p>
                                        <p className=" text-[#545E69] text-base pt-2.5">{latestPosts[0].content}</p>

                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>


                </div>


            </div>

            {/* Right: Profile Card & Socials */}
            <aside className="flex flex-col gap-8 items-center xl:w-1/3">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary mb-4">
                        <Image src={profile.avatar} alt={profile.name} width={130} height={130} className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-800 mb-1">{profile.name}</h3>
                    <span className="text-primary text-base font-semibold mb-2">{profile.role}</span>
                    <p className="text-gray-600 mb-4 text-base">{profile.bio}</p>
                    <div className="flex gap-4 justify-center">
                        {profile.socials.map((social) => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors duration-200">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path d={social.icon} />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
                {/* Subscribe Box */}
                <div className="bg-primary-50 rounded-2xl p-6 flex flex-col items-center text-center border border-primary/50">
                    <h4 className="text-lg font-bold text-primary mb-2">Subscribe for Updates</h4>
                    <p className="text-gray-600 font-medium mb-4 text-sm">Get the latest posts and updates directly in your inbox.</p>
                    <form className="flex w-full max-w-xs gap-2">
                        <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none" />
                        <Button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors duration-200">Subscribe</Button>
                    </form>
                </div>
            </aside>
        </section>
    );
}
