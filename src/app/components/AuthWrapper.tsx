import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, provider } from "../../../firebase/config";
import { adminEmails } from "../../../firebase/constants/adminEmails";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/app/components/Loader";
import { useRouter } from "next/navigation"; // ✅ For App Router
import { Button } from "@heroui/react";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
}

export default function AuthWrapper({ open, onClose }: AuthModalProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // ✅ Hook for navigation

    useEffect(() => {
        if (!open) return; // 🛑 Don't run logic if modal is closed
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            // ✅ Only redirect if user is admin AND not already on /dashboard
            if (
                currentUser &&
                adminEmails.includes(currentUser.email ?? "") &&
                window.location.pathname !== "/dashboard"
            ) {
                onClose(); // close modal before navigation
                router.push("/dashboard");
            }
        });

        return () => unsubscribe();
    }, [open, onClose, router]);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            // ✅ Don't redirect here directly. Let onAuthStateChanged handle it.
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 backdrop-blur-xl bg-black/40 z-50 flex items-center justify-center text-black"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h2 className="text-2xl text-black font-semibold mb-4">🔐 Dashboard Login</h2>
                        {loading ? (
                            <Loader />
                        ) : !user ? (
                            <>
                                <p className="mb-4">Login to access your dashboard.</p>
                                <Button
                                    onClick={handleLogin}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Login with Google
                                </Button>
                            </>
                        ) : !adminEmails.includes(user.email ?? "") ? (
                            <>
                                <p className="text-red-600 mb-4">❌ Access Denied: {user.email}</p>
                                <Button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-green-600 mb-4">✅ Already Logged In: {user.email}</p>
                                <Button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                            <RxCross2 onClick={onClose} className={" text-4xl cursor-pointer duration-300 absolute right-5 top-5 hover:bg-purple-600 rounded-full p-2"} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
