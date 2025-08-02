"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
    MessageSquare, 
    Star, 
    CheckCircle,
    AlertCircle,
    ThumbsUp,
    ArrowRight,
    Mail,
    Phone,
    User
} from "lucide-react";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        feedbackType: "general",
        rating: 0,
        subject: "",
        message: "",
        contactPreference: "email"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const feedbackTypes = [
        { value: "general", label: "General Feedback", icon: MessageSquare },
        { value: "bug", label: "Bug Report", icon: AlertCircle },
        { value: "feature", label: "Feature Request", icon: Star },
        { value: "improvement", label: "Improvement Suggestion", icon: ThumbsUp }
    ];

    const contactPreferences = [
        { value: "email", label: "Email", icon: Mail },
        { value: "phone", label: "Phone", icon: Phone },
        { value: "none", label: "No Contact", icon: User }
    ];

    const handleRatingClick = (rating: number) => {
        setFormData(prev => ({ ...prev, rating }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md mx-4"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
                    </p>
                    <button
                        onClick={() => {
                            setIsSubmitted(false);
                            setFormData({
                                name: "",
                                email: "",
                                phone: "",
                                feedbackType: "general",
                                rating: 0,
                                subject: "",
                                message: "",
                                contactPreference: "email"
                            });
                        }}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        Submit Another Feedback
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <MessageSquare className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-bold text-gray-800 mb-4"
                        >
                            Share Your Feedback
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            Help us improve by sharing your thoughts, suggestions, or reporting any issues you&apos;ve encountered.
                        </motion.p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Feedback Type */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Feedback Type</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {feedbackTypes.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                                            formData.feedbackType === type.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="feedbackType"
                                            value={type.value}
                                            checked={formData.feedbackType === type.value}
                                            onChange={(e) => handleInputChange("feedbackType", e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3">
                                            <type.icon className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium text-gray-800">{type.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">How would you rate your experience?</h3>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => handleRatingClick(rating)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            formData.rating >= rating
                                                ? "text-yellow-500 hover:text-yellow-600"
                                                : "text-gray-300 hover:text-gray-400"
                                        }`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                                <span className="ml-4 text-sm text-gray-600">
                                    {formData.rating === 0 && "Click to rate"}
                                    {formData.rating === 1 && "Poor"}
                                    {formData.rating === 2 && "Fair"}
                                    {formData.rating === 3 && "Good"}
                                    {formData.rating === 4 && "Very Good"}
                                    {formData.rating === 5 && "Excellent"}
                                </span>
                            </div>
                        </div>

                        {/* Subject and Message */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => handleInputChange("subject", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description of your feedback"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Please provide detailed feedback, suggestions, or describe any issues you've encountered..."
                                />
                            </div>
                        </div>

                        {/* Contact Preference */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Preference</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {contactPreferences.map((pref) => (
                                    <label
                                        key={pref.value}
                                        className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 ${
                                            formData.contactPreference === pref.value
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="contactPreference"
                                            value={pref.value}
                                            checked={formData.contactPreference === pref.value}
                                            onChange={(e) => handleInputChange("contactPreference", e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center gap-3">
                                            <pref.icon className="w-5 h-5 text-gray-600" />
                                            <span className="font-medium text-gray-800">{pref.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.message.trim()}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Feedback
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center"
                >
                    <h3 className="text-xl font-semibold mb-4">Why Your Feedback Matters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <ThumbsUp className="w-8 h-8 mx-auto mb-3" />
                            <p className="text-sm">Help us improve our platform</p>
                        </div>
                        <div>
                            <Star className="w-8 h-8 mx-auto mb-3" />
                            <p className="text-sm">Shape future features</p>
                        </div>
                        <div>
                            <MessageSquare className="w-8 h-8 mx-auto mb-3" />
                            <p className="text-sm">Better user experience</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 