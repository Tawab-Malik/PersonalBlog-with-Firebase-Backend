'use client'

import { useState, useEffect } from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Github, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { createSocialUTM } from '@/lib/utm'

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const baseUrl = 'https://personal-blogfirebase.vercel.app'
    
    const socialLinks = [
        { icon: Facebook, href: createSocialUTM(baseUrl, 'facebook', 'footer_social'), label: 'Facebook' },
        { icon: Twitter, href: createSocialUTM(baseUrl, 'twitter', 'footer_social'), label: 'Twitter' },
        { icon: Instagram, href: createSocialUTM(baseUrl, 'instagram', 'footer_social'), label: 'Instagram' },
        { icon: Youtube, href: createSocialUTM(baseUrl, 'youtube', 'footer_social'), label: 'Youtube' },
        { icon: Linkedin, href: createSocialUTM(baseUrl, 'linkedin', 'footer_social'), label: 'LinkedIn' },
        { icon: Github, href: createSocialUTM(baseUrl, 'github', 'footer_social'), label: 'GitHub' },
    ]

    return (
        <>
            <footer className="bg-primary text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-90">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                    <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                </div>

                <div className="relative z-10">
                    {/* Main Footer Content */}
                    <div className="max-w-7xl mx-auto px-6 py-12 ">
                        <div className="flex flex-col justify-center items-center gap-8">
                            {/* Brand Section */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex justify-center items-center mb-4">
                                    <Link href="/" className="text-2xl font-nunito font-bold text-indigo-600">
                                        <div className="flex items-center gap-2">
                                            <div className="p-3 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl flex items-center justify-center">
                                                <span className="text-white font-bold text-2xl">TM</span>
                                            </div>
                                            <span className="text-3xl font-bold text-white">TMx</span>
                                        </div>                                    </Link>
                                </div>
                                <p className="text-gray-300 text-center text-lg mb-6 max-w-xl mx-auto">
                                    Discover the latest insights on web development, React, Next.js, and modern technologies.
                                    Expert tutorials and guides for developers.
                                </p>

                                {/* Social Links */}
                                <div className="flex flex-wrap justify-center items-center gap-4">
                                    {socialLinks.map((social) => (
                                        <Link
                                            key={social.label}
                                            href={social.href}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 group"
                                            aria-label={social.label}
                                        >
                                            <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm font-medium">{social.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>


                        </div>

                        {/* Bottom Section */}
                        <div className="border-t border-gray-700 mt-12 pt-8">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-gray-400 text-sm">
                                    © {new Date().getFullYear()} Abdul Tawab&apos;s Blog. All rights reserved.
                                </div>
                                <div className="flex items-center gap-6 text-sm text-gray-400">
                                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 cursor-pointer right-6 z-50 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </>
    )
}
