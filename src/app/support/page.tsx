"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    HelpCircle, 
    Mail, 
    MessageCircle, 
    Phone, 
    Clock, 
    CheckCircle,
    ArrowRight,
    Users,
    BookOpen,
    Shield,
    Zap,
    ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    const [activeTab, setActiveTab] = useState("faq");
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [expandAll, setExpandAll] = useState(false);

    const faqs = [
        {
            question: "How do I create a new blog post?",
            answer: "Navigate to your dashboard and click on 'Add Post'. Fill in the required fields including title, content, and categories. You can also upload a cover image for your post."
        },
        {
            question: "Can I edit my profile information?",
            answer: "Yes! Go to your dashboard and click on 'Profile Settings'. You can update your display name, profile picture, and other personal information."
        },
        {
            question: "How do I change my password?",
            answer: "You can change your password in the Security Settings section of your dashboard. Make sure to use a strong password for better security."
        },
        {
            question: "What if I forget my password?",
            answer: "Click on the 'Forgot Password' link on the login page. Enter your email address and follow the instructions sent to your inbox."
        },
        {
            question: "How can I contact other authors?",
            answer: "Visit the Authors page to see all registered authors. You can view their profiles and connect with them through their social media links."
        },
        {
            question: "Is my data secure?",
            answer: "Yes, we use industry-standard security measures to protect your data. All information is encrypted and stored securely."
        }
    ];

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Support",
            description: "Get help via email within 24 hours",
            contact: "tchannar5@gmail.com",
            color: "bg-blue-500"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            description: "Chat with our support team in real-time",
            contact: "Available 9 AM - 6 PM",
            color: "bg-green-500"
        },
        {
            icon: Phone,
            title: "Phone Support",
            description: "Call us for immediate assistance",
            contact: "+92 3074563133",
            color: "bg-purple-500"
        }
    ];

    const resources = [
        {
            icon: BookOpen,
            title: "Documentation",
            description: "Comprehensive guides and tutorials",
            link: "#"
        },
        {
            icon: Users,
            title: "Community Forum",
            description: "Connect with other users",
            link: "#"
        },
        {
            icon: Shield,
            title: "Security Guide",
            description: "Learn about account security",
            link: "#"
        },
        {
            icon: Zap,
            title: "Quick Start Guide",
            description: "Get started in minutes",
            link: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <HelpCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-bold text-gray-800 mb-4"
                        >
                            How Can We Help You?
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            Find answers to common questions, get in touch with our support team, or explore helpful resources.
                        </motion.p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Contact Methods */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Get in Touch</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <method.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{method.title}</h3>
                                <p className="text-gray-600 mb-3">{method.description}</p>
                                <p className="text-sm font-medium text-gray-800">{method.contact}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-12"
                >
                    <div className="flex justify-center mb-8">
                        <div className="bg-white rounded-xl p-1 shadow-lg">
                            <button
                                onClick={() => setActiveTab("faq")}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === "faq"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                FAQ
                            </button>
                            <button
                                onClick={() => setActiveTab("resources")}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === "resources"
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                Resources
                            </button>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    {activeTab === "faq" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg py-8 px-0 md:p-8"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Frequently Asked Questions</h3>
                                <button
                                    onClick={() => {
                                        if (expandAll) {
                                            setOpenFaq(null);
                                            setExpandAll(false);
                                        } else {
                                            setExpandAll(true);
                                        }
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    {expandAll ? "Collapse All" : "Expand All"}
                                </button>
                            </div>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                                    >
                                        <button
                                            onClick={() => {
                                                if (openFaq === index) {
                                                    setOpenFaq(null);
                                                    setExpandAll(false);
                                                } else {
                                                    setOpenFaq(index);
                                                    setExpandAll(false);
                                                }
                                            }}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                <h4 className="text-lg font-semibold text-gray-800">{faq.question}</h4>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: (openFaq === index || expandAll) ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex-shrink-0"
                                            >
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            </motion.div>
                                        </button>
                                        
                                        <AnimatePresence>
                                            {(openFaq === index || expandAll) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ 
                                                        duration: 0.3,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-4">
                                                        <div className="border-t border-gray-100 pt-4">
                                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Resources Section */}
                    {activeTab === "resources" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Helpful Resources</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {resources.map((resource, index) => (
                                    <motion.div
                                        key={resource.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <resource.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-800 mb-2">{resource.title}</h4>
                                                <p className="text-gray-600 mb-3">{resource.description}</p>
                                                <Link
                                                    href={resource.link}
                                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group-hover:gap-3 transition-all duration-200"
                                                >
                                                    Learn More
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Support Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Clock className="w-6 h-6" />
                        <h3 className="text-xl font-semibold">Support Hours</h3>
                    </div>
                    <p className="text-lg mb-2">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                    <p className="text-blue-100">Weekend support available for urgent issues</p>
                </motion.div>
            </div>
        </div>
    );
} 