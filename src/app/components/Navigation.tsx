"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Menu, 
    X, 
    Home, 
    FileText, 
    Hash, 
    User,
    LogIn,
    UserPlus
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

export default function Navigation() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const menuItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/categories", label: "Categories", icon: Hash },
        { href: "/dashboard", label: "Dashboard", icon: FileText, auth: true },
    ];

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">BlogPost</h1>
                            <p className="text-xs text-gray-500">Tawab&apos;s Blog</p>
                        </div>
                    </Link>
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {menuItems.map((item) => {
                            if (item.auth && !isAuthenticated) return null;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    <User className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {menuItems.map((item) => {
                                if (item.auth && !isAuthenticated) return null;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                            
                            <div className="pt-4 border-t">
                                {isAuthenticated ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600">
                                            Welcome, {user?.displayName || user?.email?.split('@')[0] || 'User'}
                                        </p>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                        >
                                            <User className="w-5 h-5" />
                                            Dashboard
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors py-2"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                        >
                                            <UserPlus className="w-5 h-5" />
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
} 