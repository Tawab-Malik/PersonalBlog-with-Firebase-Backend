"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { motion } from "framer-motion";
import {
    Users,
    FileText,
    Eye,
    TrendingUp,
    User,
    ArrowLeft,
    BarChart3,
    Activity,
    Target,
    Star,
    Zap,
    Globe,
    Award
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
    totalUsers: number;
    activeUsers: number;
    topPosts: PostData[];
    recentActivity: {
        type: string;
        user: UserData;
        post?: PostData;
        timestamp: string;
    }[];
    monthlyData: {
        month: string;
        posts: number;
        views: number;
    }[];
    userPerformance: {
        user: UserData;
        posts: number;
        views: number;
        thisMonthPosts: number;
    }[];
}

interface PostData {
    id: string;
    title: string;
    publishedAt: string;
    views?: number;
    userId?: string;
    author?: {
        name?: string;
        email?: string;
    };
    category?: string;
}

interface UserData {
    uid: string;
    displayName?: string;
    email: string;
    createdAt?: string;
    lastLogin?: string;
    postCount?: number;
    totalViews?: number;
}

function AnalyticsPage() {
    const { user, isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedUser, setSelectedUser] = useState<string>("all");
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalPosts: 0,
        totalViews: 0,
        thisMonthPosts: 0,
        thisMonthViews: 0,
        userPosts: 0,
        totalUsers: 0,
        activeUsers: 0,
        topPosts: [],
        recentActivity: [],
        monthlyData: [],
        userPerformance: []
    });
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Fetch all posts
                const postsRef = collection(db, "posts");
                const postsQuery = query(postsRef, orderBy("publishedAt", "desc"));
                const postsSnapshot = await getDocs(postsQuery);
                const posts = postsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as PostData[];

                // Fetch all users
                const usersRef = collection(db, "users");
                const usersSnapshot = await getDocs(usersRef);
                const allUsers = usersSnapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as UserData[];

                setUsers(allUsers);

                // Calculate analytics based on user type
                const now = new Date();
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                let filteredPosts = posts;
                let filteredUsers = allUsers;

                if (!isAdmin) {
                    // Regular user - only their data
                    filteredPosts = posts.filter(post => post.userId === user?.uid);
                    filteredUsers = [allUsers.find(u => u.uid === user?.uid)].filter(Boolean) as UserData[];
                } else if (selectedUser !== "all") {
                    // Admin viewing specific user
                    filteredPosts = posts.filter(post => post.userId === selectedUser);
                    filteredUsers = [allUsers.find(u => u.uid === selectedUser)].filter(Boolean) as UserData[];
                }

                // Calculate user performance
                const userPerformance = allUsers.map(user => {
                    const userPosts = posts.filter(post => post.userId === user.uid);
                    const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
                    const thisMonthPosts = userPosts.filter(post =>
                        new Date(post.publishedAt) >= thisMonth
                    ).length;
                    const thisMonthViews = userPosts.filter(post =>
                        new Date(post.publishedAt) >= thisMonth
                    ).reduce((sum, post) => sum + (post.views || 0), 0);

                    return {
                        user: user,
                        posts: userPosts.length,
                        views: totalViews,
                        postCount: userPosts.length,
                        totalViews,
                        thisMonthPosts,
                        thisMonthViews
                    };
                }).sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0));

                // Calculate monthly data for charts
                const monthlyData = [];
                for (let i = 5; i >= 0; i--) {
                    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

                    const monthPosts = filteredPosts.filter(post => {
                        const postDate = new Date(post.publishedAt);
                        return postDate >= month && postDate <= monthEnd;
                    });

                    const monthViews = monthPosts.reduce((sum, post) => sum + (post.views || 0), 0);

                    monthlyData.push({
                        month: month.toLocaleDateString('en-US', { month: 'short' }),
                        posts: monthPosts.length,
                        views: monthViews
                    });
                }

                // Top performing posts
                const topPosts = filteredPosts
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5);

                // Recent activity
                const recentActivity = filteredPosts
                    .slice(0, 10)
                    .map(post => ({
                        type: 'post',
                        user: allUsers.find(u => u.uid === post.userId) || {
                            uid: post.userId || '',
                            email: post.author?.email || 'Unknown',
                            displayName: post.author?.name || 'Unknown'
                        },
                        post: post,
                        timestamp: post.publishedAt
                    }));

                const thisMonthPosts = filteredPosts.filter(post =>
                    new Date(post.publishedAt) >= thisMonth
                ).length;

                const totalViews = filteredPosts.reduce((sum, post) => sum + (post.views || 0), 0);
                const thisMonthViews = filteredPosts.filter(post =>
                    new Date(post.publishedAt) >= thisMonth
                ).reduce((sum, post) => sum + (post.views || 0), 0);

                setAnalytics({
                    totalPosts: filteredPosts.length,
                    totalViews,
                    thisMonthPosts,
                    thisMonthViews,
                    userPosts: filteredPosts.length,
                    totalUsers: filteredUsers.length,
                    activeUsers: filteredUsers.filter(u => {
                        const lastLogin = u.lastLogin ? new Date(u.lastLogin) : null;
                        return lastLogin && (now.getTime() - lastLogin.getTime()) < 30 * 24 * 60 * 60 * 1000; // 30 days
                    }).length,
                    topPosts,
                    recentActivity,
                    monthlyData,
                    userPerformance
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
    }, [user, isAdmin, selectedUser]);

    const stats = [
        {
            title: "Total Posts",
            value: analytics.totalPosts,
            icon: FileText,
            color: "blue",
            gradient: "from-blue-500 to-blue-600",
            change: `+${analytics.thisMonthPosts} this month`
        },
        {
            title: "Total Views",
            value: analytics.totalViews.toLocaleString(),
            icon: Eye,
            color: "green",
            gradient: "from-green-500 to-green-600",
            change: `+${analytics.thisMonthViews} this month`
        },
        {
            title: isAdmin ? "Total Users" : "My Posts",
            value: isAdmin ? analytics.totalUsers : analytics.userPosts,
            icon: isAdmin ? Users : FileText,
            color: "purple",
            gradient: "from-purple-500 to-purple-600",
            change: isAdmin ? `${analytics.activeUsers} active` : "Your content"
        },
        {
            title: "Engagement Rate",
            value: analytics.totalPosts > 0 ? `${Math.round((analytics.totalViews / analytics.totalPosts))}%` : "0%",
            icon: TrendingUp,
            color: "orange",
            gradient: "from-orange-500 to-orange-600",
            change: "Average views per post"
        }
    ];

    const renderVerticalChart = (data: { month: string; posts: number; views: number }[], type: 'posts' | 'views') => {
        const maxValue = Math.max(...data.map(d => d[type]));
        
        return (
            <div className="flex items-end justify-between h-48 space-x-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                        <div className="text-xs text-gray-600 mb-2 text-center">{item[type]}</div>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(item[type] / maxValue) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`w-full rounded-t-lg ${
                                type === 'posts' 
                                    ? 'bg-gradient-to-t from-blue-500 to-blue-600' 
                                    : 'bg-gradient-to-t from-green-500 to-green-600'
                            } min-h-[20px]`}
                        ></motion.div>
                        <div className="text-xs text-gray-500 mt-2 text-center">{item.month}</div>
                    </div>
                ))}
            </div>
        );
    };

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                Analytics Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {isAdmin ? 'Platform-wide insights and performance metrics' : 'Track your blog performance and insights'}
                            </p>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-4">
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Users</option>
                                    {users.map(user => (
                                        <option key={user.uid} value={user.uid}>
                                            {user.displayName || user.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "overview"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("performance")}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "performance"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            Performance
                        </button>
                        {isAdmin && (
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === "users"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                Users
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-sm text-gray-500">{stat.change}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 font-medium">{stat.title}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Charts Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Trends</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-blue-600" />
                                        Posts Published
                                    </h3>
                                    {renderVerticalChart(analytics.monthlyData, 'posts')}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                        Views Generated
                                    </h3>
                                    {renderVerticalChart(analytics.monthlyData, 'views')}
                                </div>
                            </div>
                        </motion.div>

                        {/* Top Posts & Recent Activity */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Top Posts */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-600" />
                                    Top Performing Posts
                                </h2>
                                <div className="space-y-4">
                                    {analytics.topPosts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 truncate">{post.title}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="text-sm text-gray-500">{post.views || 0} views</p>
                                                    <p className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-600" />
                                    Recent Activity
                                </h2>
                                <div className="space-y-4">
                                    {analytics.recentActivity.slice(0, 5).map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 truncate">{activity.post?.title || 'Unknown Post'}</p>
                                                <p className="text-sm text-gray-500">{activity.post?.views || 0} views • {new Date(activity.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {activeTab === "performance" && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Performance Metrics */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                Performance Metrics
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Content Quality</span>
                                        <span className="text-sm font-medium text-gray-800">85%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                                        ></motion.div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Reader Engagement</span>
                                        <span className="text-sm font-medium text-gray-800">72%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '72%' }}
                                            transition={{ duration: 1, delay: 0.4 }}
                                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                                        ></motion.div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Consistency Score</span>
                                        <span className="text-sm font-medium text-gray-800">68%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '68%' }}
                                            transition={{ duration: 1, delay: 0.6 }}
                                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Platform Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Platform Statistics
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5" />
                                        <span>Total Users</span>
                                    </div>
                                    <span className="font-bold text-xl">{analytics.totalUsers}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5" />
                                        <span>Active Users</span>
                                    </div>
                                    <span className="font-bold text-xl">{analytics.activeUsers}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5" />
                                        <span>Engagement Rate</span>
                                    </div>
                                    <span className="font-bold text-xl">
                                        {analytics.totalPosts > 0 ? `${Math.round((analytics.totalViews / analytics.totalPosts))}%` : "0%"}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {activeTab === "users" && isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            User Performance
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Posts</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Total Views</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">This Month</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.userPerformance.slice(0, 10).map((userData, index) => (
                                        <motion.tr
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{userData.user.displayName || 'Unknown'}</p>
                                                        <p className="text-sm text-gray-500">{userData.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 font-medium">{userData.posts || 0}</td>
                                            <td className="py-3 px-4 text-gray-800 font-medium">{(userData.views || 0).toLocaleString()}</td>
                                            <td className="py-3 px-4 text-gray-800 font-medium">{userData.thisMonthPosts || 0}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${Math.min((userData.views || 0) / 1000 * 100, 100)}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                                                        ></motion.div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 font-medium">
                                                        {Math.round((userData.views || 0) / 1000 * 100)}%
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
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