'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaRegClock, FaRegCalendarAlt } from 'react-icons/fa';
import posts from "../../../data/postData.json";
import { GoArrowRight } from 'react-icons/go';
import Link from 'next/link';

export default function Trending() {
    const latestPosts = posts.slice(4, 10).map((post: any) => ({
        slug: post.slug,
        content: post.excerpt,
        title: post.title,
        image: post.coverImage,
        category: Array.isArray(post.categories) ? post.categories[0] : post.categories,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "",
        readTime: post.readingTime,
    }));

    return (
        <section className="bg-[url('/images/hero/trending.png')] bg-cover bg-center bg-[#E8F1F1] max-w-[2000px] mx-auto">
            <div className="py-10 px-4 md:px-10 max-w-7xl mx-auto">
                {/* Heading Section */}
                <div>
                    <div className="flex items-center  justify-between  w-full">
                        <div>
                            <h2 className="text-3xl font-bold text-[#183354]">Trending</h2>

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


                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1.2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 4 },
                    }}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    modules={[Autoplay, Pagination]}
                    className="mySwiper "
                >
                    {latestPosts.map((post, index) => (
                        <SwiperSlide key={index} className="h-[400px]">
                            <div
                                className="bg-cover bg-center flex flex-col h-[400px] backdrop-blur-2xl rounded-md overflow-hidden shadow-sm bg-white group"
                                style={{
                                    backgroundImage: `url(${post.image})`,
                                }}
                            >

                                <div className="p-4  text-white  flex flex-col justify-end items-start h-full">

                                    <div className="flex flex-col justify-start  items-start text-xs gap-4 ">
                                        <p className=" w-auto bg-[#ff6f61] text-white text-xs px-2.5 py-1 uppercase rounded">
                                            {post.category}
                                        </p>
                                        <h3 className="text-lg md:text-xl font-bold leading-snug line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <div className='flex gap-x-3'>
                                            <span className="flex items-center gap-1">
                                                <FaRegCalendarAlt /> {post.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaRegClock /> {post.readTime}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
