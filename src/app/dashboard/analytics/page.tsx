"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { motion } from "framer-motion";
import { 
    Users, 
    FileText, 
    Eye, 
    TrendingUp, 
    Calendar,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { useAuth } from "@/app/hooks/useAuth";

interface AnalyticsData {
    totalPosts: number;
    totalViews: number;
    thisMonthPosts: number;
    thisMonthViews: number;
    userPosts: number;
}

interface PostData {
    publishedAt: string;
    views?: number;
    userId?: string;
}

function AnalyticsPage() {
    const { user, isAdmin } = useAuth();
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalPosts: 0,
        totalViews: 0,
        thisMonthPosts: 0,
        thisMonthViews: 0,
        userPosts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const postsRef = collection(db, "posts");
                let postsQuery;

                if (!isAdmin) {
                    postsQuery = query(postsRef, where("userId", "==", user?.uid));
                } else {
                    postsQuery = postsRef;
                }

                const querySnapshot = await getDocs(postsQuery);
                const posts = querySnapshot.docs.map(doc => doc.data() as PostData);

                const now = new Date();
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                const thisMonthPosts = posts.filter((post: PostData) => 
                    new Date(post.publishedAt) >= thisMonth
                ).length;

                const totalViews = posts.reduce((sum: number, post: PostData) => sum + (post.views || 0), 0);
                const thisMonthViews = posts.filter((post: PostData) => 
                    new Date(post.publishedAt) >= thisMonth
                ).reduce((sum: number, post: PostData) => sum + (post.views || 0), 0);

                setAnalytics({
                    totalPosts: posts.length,
                    totalViews,
                    thisMonthPosts,
                    thisMonthViews,
                    userPosts: posts.length
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAnalytics();
        }
    }, [user, isAdmin]);

    const stats = [
        {
            title: "Total Posts",
            value: analytics.totalPosts,
            icon: FileText,
            color: "blue",
            change: "+12% from last month"
        },
        {
            title: "Total Views",
            value: analytics.totalViews,
            icon: Eye,
            color: "green",
            change: "+8% from last month"
        },
        {
            title: "This Month Posts",
            value: analytics.thisMonthPosts,
            icon: Calendar,
            color: "purple",
            change: "+5 new posts"
        },
        {
            title: "This Month Views",
            value: analytics.thisMonthViews,
            icon: TrendingUp,
            color: "orange",
            change: "+15% from last month"
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <Link 
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">Track your blog performance and insights</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                                <span className="text-sm text-gray-500">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600">{stat.title}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">New post published</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">Post reached 100 views</p>
                                    <p className="text-sm text-gray-500">1 day ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">New user registered</p>
                                    <p className="text-sm text-gray-500">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Overview</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Posts Published</span>
                                    <span className="text-sm font-medium text-gray-800">75%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">Views Generated</span>
                                    <span className="text-sm font-medium text-gray-800">60%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">User Engagement</span>
                                    <span className="text-sm font-medium text-gray-800">85%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsPageWrapper() {
    return (
        <DashboardAuthWrapper>
            <AnalyticsPage />
        </DashboardAuthWrapper>
    );
} 