"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useAuth } from "@/app/hooks/useAuth";
import { createNotification } from "@/lib/notificationService";

interface CommentLikeButtonProps {
    commentId: string;
    initialLikes: number;
    isLiked?: boolean;
    postSlug?: string;
    postTitle?: string;
}

export default function CommentLikeButton({ commentId, initialLikes, isLiked = false, postSlug, postTitle }: CommentLikeButtonProps) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(isLiked);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (!user || loading) return;

        setLoading(true);
        try {
            const commentRef = doc(db, "comments", commentId);
            await updateDoc(commentRef, {
                likes: increment(liked ? -1 : 1)
            });

            setLikes(prev => liked ? prev - 1 : prev + 1);
            setLiked(!liked);

            // Create notification for comment author when liking (not unliking)
            if (!liked && postSlug && postTitle) {
                try {
                    const commentDoc = await getDoc(commentRef);
                    if (commentDoc.exists()) {
                        const commentData = commentDoc.data();
                        const commentAuthorEmail = commentData.author?.email;
                        
                        if (commentAuthorEmail && commentAuthorEmail !== user.email) {
                            await createNotification({
                                type: "like",
                                postSlug,
                                postTitle,
                                commentId,
                                authorName: user.displayName || "Anonymous",
                                authorEmail: user.email || "",
                                recipientEmail: commentAuthorEmail
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error creating like notification:", error);
                }
            }
        } catch (error) {
            console.error("Error updating like:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={!user || loading}
            className={`flex items-center gap-1 transition-colors ${
                liked 
                    ? "text-red-500" 
                    : "text-gray-500 hover:text-red-500"
            } ${!user ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{likes}</span>
        </button>
    );
} 