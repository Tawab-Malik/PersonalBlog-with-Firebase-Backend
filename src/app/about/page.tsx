"use client";
import { motion } from "framer-motion";
import { 
    Users, 
    BookOpen, 
    Globe, 
    Target, 
    Heart,
    ArrowRight,
    CheckCircle,
    Lightbulb,
    Zap,
    Shield,
    MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    const stats = [
        { icon: Users, number: "500+", label: "Active Authors", color: "text-blue-600" },
        { icon: BookOpen, number: "2000+", label: "Published Posts", color: "text-green-600" },
        { icon: Globe, number: "50K+", label: "Monthly Readers", color: "text-purple-600" },
        { icon: Target, number: "95%", label: "Satisfaction Rate", color: "text-orange-600" }
    ];

    const values = [
        {
            icon: Heart,
            title: "Passion for Quality",
            description: "We believe in delivering exceptional content that inspires, educates, and entertains our readers.",
            color: "bg-red-100 text-red-600"
        },
        {
            icon: Shield,
            title: "Trust & Security",
            description: "Your privacy and data security are our top priorities. We maintain the highest standards of protection.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Lightbulb,
            title: "Innovation",
            description: "We constantly innovate to provide the best blogging experience with cutting-edge features.",
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            icon: Users,
            title: "Community First",
            description: "Building a supportive community where writers can grow, learn, and connect with each other.",
            color: "bg-green-100 text-green-600"
        }
    ];

    const team = [
        {
            name: "Abdul Tawab",
            role: "Founder & Developer",
            image: "/images/profile.jpeg",
            bio: "I am a passionate Frontend developer and a blogger. I love to write and share my knowledge with others.",
            social: { twitter: "#", linkedin: "#", github: "#" }
        },
        // {
        //     name: "Sarah Ahmed",
        //     role: "Head of Content",
        //     image: "/images/profile.jpeg",
        //     bio: "Experienced content strategist with a love for storytelling and community building.",
        //     social: { twitter: "#", linkedin: "#", github: "#" }
        // },
        // {
        //     name: "Muhammad Ali",
        //     role: "Lead Developer",
        //     image: "/images/profile.jpeg",
        //     bio: "Full-stack developer focused on creating seamless user experiences.",
        //     social: { twitter: "#", linkedin: "#", github: "#" }
        // }
    ];

    const milestones = [
        {
            year: "2023",
            title: "Platform Launch",
            description: "Successfully launched our blogging platform with core features"
        },
        {
            year: "2024",
            title: "Community Growth",
            description: "Reached 500+ active authors and 50K+ monthly readers"
        },
        {
            year: "2025",
            title: "Global Expansion",
            description: "Expanding to serve writers worldwide with enhanced features"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8"
                        >
                            <BookOpen className="w-12 h-12" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            About Our Platform
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
                        >
                            Empowering writers to share their stories, connect with readers, and build meaningful communities through the power of blogging.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We believe that everyone has a story worth sharing. Our mission is to provide a platform where writers can express themselves freely, connect with like-minded individuals, and build thriving communities around their passions.
                            </p>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                Whether you&apos;re a seasoned writer or just starting your journey, we&apos;re here to support you every step of the way with powerful tools, a supportive community, and endless opportunities to grow.
                            </p>
                            <Link
                                href="/support"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                            >
                                Learn More
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                                <div className="flex items-center gap-3 mb-6">
                                    <Target className="w-8 h-8" />
                                    <h3 className="text-2xl font-bold">What We Do</h3>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>Provide a user-friendly blogging platform</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>Connect writers with readers worldwide</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>Build supportive communities</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                                        <span>Offer powerful content creation tools</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do and shape our community.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className={`w-12 h-12 ${value.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The passionate individuals behind our platform who work tirelessly to make your blogging experience exceptional.
                        </p>
                    </motion.div>
                    <div className="grid justify-center items-center gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 mb-4 max-w-sm mx-auto leading-relaxed">{member.bio}</p>
                                <div className="flex justify-center gap-3">
                                    <Link href={member.social.twitter} className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                                        <MessageSquare className="w-4 h-4" />
                                    </Link>
                                    <Link href={member.social.linkedin} className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                                        <Users className="w-4 h-4" />
                                    </Link>
                                    <Link href={member.social.github} className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white hover:bg-gray-900 transition-colors">
                                        <Zap className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Milestones Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Journey</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Key milestones that mark our growth and commitment to excellence.
                        </p>
                    </motion.div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 }}
                                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                                            <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                                    <div className="w-1/2"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of writers who are already sharing their stories and building communities on our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                href="/support"
                                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 