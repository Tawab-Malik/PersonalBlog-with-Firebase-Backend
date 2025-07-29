"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating Ripple Elements */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 "
      >
        <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-40 right-20 "
      >
        <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-40 left-20 "
      >
        <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-60 left-1/4 "
      >
        <div className="w-1 h-1 bg-primary-400 rounded-full"></div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [0, 12, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-60 right-1/3"
      >
        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
      </motion.div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary to-primary-200   bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you&apos;re looking for seems to have wandered off into the digital wilderness. 
            Don&apos;t worry, even the best explorers sometimes take a wrong turn.
          </p>
        </motion.div>

        {/* Decorative Ripple Circle */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Outer Ripple */}
            <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse"></div>
            
            {/* Middle Ripple */}
            <div className="absolute inset-4 border-4 border-primary rounded-full animate-ping"></div>
            
            {/* Inner Ripple */}
            <div className="absolute inset-8 border-4 border-primary rounded-full"></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="group relative px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="relative z-10">Go Back Home</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-primary-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </Link>

          <Link
            href="/blog"
            className="group px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-gradient-to-r from-primary to-primary-200 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Explore Blog
          </Link>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-gradient-to-r from-primary-100 to-purple-100 rounded-xl border border-primary-100"
        >
          <h3 className="text-lg font-semibold text-primary mb-3">
            Need Help Finding Something?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/about"
              className="text-primary hover:text-primary-700 transition-colors duration-200"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-primary hover:text-primary-700 transition-colors duration-200"
            >
              Contact Support
            </Link>
            <Link
              href="/categories"
              className="text-primary hover:text-primary-700 transition-colors duration-200"
            >
              Browse Categories
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 