"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Loader from "./Loader";

interface GalleryItem {
    id: number;
    category: string;
    title: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
}

const galleryItems: GalleryItem[] = [
    {
        id: 1,
        category: "CULTURE",
        title: "The Potentially Dangerous Non-Accessibility Of Cookie Notices",
        author: "ADMIN",
        date: "27 AUGUST, 2024",
        readTime: "20 MINS",
        image: "/images/hero/slide1.png",
        slug: "cookie-notices-accessibility"
    },
    {
        id: 2,
        category: "TRAVEL",
        title: "A Comprehensive Checklist For Running",
        author: "ADMIN",
        date: "27 AUGUST, 2024",
        readTime: "15 MINS",
        image: "/images/hero/slide2.png",
        slug: "running-checklist"
    },
    {
        id: 3,
        category: "ADVENTURE",
        title: "Overcoming Challenges Of Content Creation",
        author: "ADMIN",
        date: "27 AUGUST, 2024",
        readTime: "12 MINS",
        image: "/images/hero/slide3.png",
        slug: "content-creation-challenges"
    },
    {
        id: 4,
        category: "DESTINATION",
        title: "And Data Management With Row-Level Security",
        author: "ADMIN",
        date: "27 AUGUST, 2024",
        readTime: "18 MINS",
        image: "/images/hero/slide4.png",
        slug: "data-management-security"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload images to prevent white flashes
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = galleryItems.map((item) => {
                return new Promise<void>((resolve) => {
                    const img = new window.Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Continue even if image fails
                    img.src = item.image;
                });
            });
            
            await Promise.all(imagePromises);
            setImagesLoaded(true);
        };
        
        preloadImages();
    }, []);

    // Auto-play functionality for gallery slider
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const goToSlide = (index: number) => {
        if (index >= 0 && index < galleryItems.length) {
            setCurrentSlide(index);
            setIsAutoPlaying(false);
            // Resume auto-play after 10 seconds
            setTimeout(() => setIsAutoPlaying(true), 10000);
        }
    };

    // Safety check for current index
    const safeCurrentSlide = Math.min(currentSlide, galleryItems.length - 1);

    return (
        <section className="relative max-w-[2000px] mx-auto">
            {/* Hero Slider */}
            <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
                {!imagesLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center ">
                        <Loader/>
                    </div>
                )}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={safeCurrentSlide}
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -20 }}
                        transition={{ 
                            duration: 0.6,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 will-change-transform"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={galleryItems[safeCurrentSlide]?.image || "/images/hero/slide1.png"}
                                alt={galleryItems[safeCurrentSlide]?.title || "Blog Post"}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                                quality={90}
                            />
                            {/* Overlay for better text readability */}
                            <div className="absolute inset-0 bg-black/10"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center px-4">
                            <div className="text-center max-w-4xl mx-auto">
                                {/* Category Tag */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ 
                                        delay: 0.2,
                                        duration: 0.6,
                                        ease: "easeOut"
                                    }}
                                    className="mb-6"
                                >
                                    <span className="inline-block bg-orange-500 text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider">
                                        {galleryItems[safeCurrentSlide]?.category || "CULTURE"}
                                    </span>
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ 
                                        delay: 0.4,
                                        duration: 0.7,
                                        ease: "easeOut"
                                    }}
                                    className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                                >
                                    {galleryItems[safeCurrentSlide]?.title || "Welcome to Our Blog"}
                                </motion.h1>

                                {/* Meta Data */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ 
                                        delay: 0.6,
                                        duration: 0.6,
                                        ease: "easeOut"
                                    }}
                                    className="flex flex-wrap justify-center items-center gap-6 text-white text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        <span>{galleryItems[safeCurrentSlide]?.author || "ADMIN"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span>{galleryItems[safeCurrentSlide]?.date || "27 AUGUST, 2024"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <span>{galleryItems[safeCurrentSlide]?.readTime || "5 MINS"}</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Slider Navigation Dots */}
                {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === safeCurrentSlide
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div> */}
            </div>

            {/* Gallery Cards Section */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleryItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => goToSlide(index)}
                            >
                                <motion.div
                                    animate={{
                                        scale: safeCurrentSlide === index ? 1.05 : 1,
                                        boxShadow: safeCurrentSlide === index
                                            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                                            : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                    }}
                                    transition={{ 
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }}
                                    className={`bg-white rounded-lg overflow-hidden transition-all duration-500 transform ${safeCurrentSlide === index
                                        ? "ring-2 ring-primary ring-opacity-50"
                                        : "hover:shadow-lg"
                                        }`}
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        {/* Active Indicator */}
                                        {safeCurrentSlide === index && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full"
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div>
                                            {/* Category */}
                                            <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded mb-3 transition-colors duration-200 ${safeCurrentSlide === index
                                                ? "bg-primary text-white"
                                                : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {item.category}
                                            </span>
                                            {/* timer */}
                                            
                                        </div>


                                        {/* Title */}
                                        <h3 className={`text-lg font-bold mb-3 line-clamp-2 transition-colors duration-200 ${safeCurrentSlide === index
                                            ? "text-primary"
                                            : "text-gray-800 group-hover:text-primary"
                                            }`}>
                                            {item.title}
                                        </h3>

                                        {/* Date */}
                                        <p className="text-sm text-gray-500">
                                            {item.date}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
