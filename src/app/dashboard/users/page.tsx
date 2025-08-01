"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { Button } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import DashboardAuthWrapper from "@/app/components/DashboardAuthWrapper";
import { motion } from "framer-motion";
import { 
    Users, 
    User, 
    Mail, 
    Calendar, 
    Shield, 
    Trash2,
    Search,
    Filter,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "../../components/Loader";

interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    isAdmin: boolean;
    createdAt: string;
    lastLogin: string;
    postCount: number;
}

function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const { user, loading: userLoading, isAdmin } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersQuery = collection(db, "users");
                const querySnapshot = await getDocs(usersQuery);
                const usersData: UserData[] = [];
                
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    usersData.push({
                        uid: doc.id,
                        email: userData.email || "",
                        displayName: userData.displayName || "Unknown User",
                        photoURL: userData.photoURL || "",
                        isAdmin: userData.isAdmin || false,
                        createdAt: userData.createdAt || new Date().toISOString(),
                        lastLogin: userData.lastLogin || new Date().toISOString(),
                        postCount: userData.postCount || 0
                    });
                });

                setUsers(usersData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        if (!userLoading && user && isAdmin) {
            fetchUsers();
        }
    }, [user, userLoading, isAdmin]);

    const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
        try {
            await updateDoc(doc(db, "users", userId), {
                isAdmin: !currentAdminStatus
            });
            
            setUsers(users.map(user => 
                user.uid === userId 
                    ? { ...user, isAdmin: !currentAdminStatus }
                    : user
            ));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Error updating user role. Please try again.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (userId === user?.uid) {
            alert("You cannot delete your own account!");
            return;
        }

        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "users", userId));
                setUsers(users.filter(user => user.uid !== userId));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Error deleting user. Please try again.");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || 
                           (filterRole === "admin" && user.isAdmin) ||
                           (filterRole === "user" && !user.isAdmin);
        
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            User Management
                        </h1>
                        <p className="text-gray-600 mt-2">Manage all users in the system</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg">
                            <Users className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-semibold text-purple-700">
                                {users.length} Total Users
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3.5 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="user">Regular Users</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Grid */}
                {filteredUsers.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-lg"
                    >
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                            {searchTerm || filterRole !== "all" ? "No users found" : "No users yet"}
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm || filterRole !== "all" 
                                ? "Try adjusting your search or filter criteria." 
                                : "Users will appear here once they register."}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredUsers.map((userData, index) => (
                            <motion.div
                                key={userData.uid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* User Header */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="relative">
                                            {userData.photoURL ? (
                                                <Image
                                                    src={userData.photoURL}
                                                    alt={userData.displayName}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                    <User className="w-8 h-8 text-white" />
                                                </div>
                                            )}
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                                userData.isAdmin ? 'bg-purple-500' : 'bg-green-500'
                                            }`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-lg">
                                                {userData.displayName}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="w-4 h-4" />
                                                {userData.email}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${userData.isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                                                <span className={`text-xs font-medium ${userData.isAdmin ? 'text-purple-600' : 'text-blue-600'}`}>
                                                    {userData.isAdmin ? "Administrator" : "Regular User"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* User Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-800">{userData.postCount}</div>
                                            <div className="text-xs text-gray-500">Posts</div>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                {new Date(userData.lastLogin).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs text-gray-500">Last Login</div>
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onPress={() => handleToggleAdmin(userData.uid, userData.isAdmin)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                                userData.isAdmin 
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                            }`}
                                        >
                                            {userData.isAdmin ? (
                                                <>
                                                    <XCircle className="w-4 h-4" />
                                                    Remove Admin
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4" />
                                                    Make Admin
                                                </>
                                            )}
                                        </Button>
                                        {userData.uid !== user?.uid && (
                                            <Button
                                                onPress={() => handleDeleteUser(userData.uid)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UsersPageWrapper() {
    return (
        <DashboardAuthWrapper>
            <UsersPage />
        </DashboardAuthWrapper>
    );
} 