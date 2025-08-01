import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

interface CreateNotificationParams {
    type: "comment" | "like" | "reply";
    postSlug: string;
    postTitle: string;
    commentId?: string;
    authorName: string;
    authorEmail: string;
    recipientEmail: string;
}

export const createNotification = async (params: CreateNotificationParams) => {
    try {
        const { type, postSlug, postTitle, commentId, authorName, authorEmail, recipientEmail } = params;

        // Validate required fields
        if (!recipientEmail || !authorEmail || !postSlug || !postTitle || !authorName) {
            console.error("Missing required fields for notification:", {
                recipientEmail: !!recipientEmail,
                authorEmail: !!authorEmail,
                postSlug: !!postSlug,
                postTitle: !!postTitle,
                authorName: !!authorName
            });
            return;
        }

        // Don't create notification if author is commenting on their own post
        if (authorEmail === recipientEmail) {
            console.log("Skipping notification - author is commenting on their own post");
            return;
        }

        let title = "";
        let message = "";

        switch (type) {
            case "comment":
                title = "New Comment";
                message = `${authorName} commented on your post "${postTitle}"`;
                break;
            case "like":
                title = "New Like";
                message = `${authorName} liked your comment`;
                break;
            case "reply":
                title = "New Reply";
                message = `${authorName} replied to your comment`;
                break;
            default:
                console.error("Unknown notification type:", type);
                return;
        }

        // صرف متعین شدہ فیلڈز کے ساتھ notification data object بنائیں
        interface NotificationData {
            type: string;
            title: string;
            message: string;
            postSlug: string;
            postTitle: string;
            authorName: string;
            authorEmail: string;
            recipientEmail: string;
            createdAt: ReturnType<typeof serverTimestamp>;
            isRead: boolean;
            commentId?: string;
        }

        const notificationData: NotificationData = {
            type,
            title,
            message,
            postSlug,
            postTitle,
            authorName,
            authorEmail,
            recipientEmail,
            createdAt: serverTimestamp(),
            isRead: false
        };

        // Only add commentId if it's defined and not empty
        if (commentId && commentId.trim() !== "") {
            notificationData.commentId = commentId;
        }

        console.log("Creating notification:", {
            type,
            recipientEmail,
            authorName,
            postTitle,
            hasCommentId: !!commentId
        });

        const docRef = await addDoc(collection(db, "notifications"), notificationData);
        console.log("✅ Notification created successfully with ID:", docRef.id);
        
        return docRef.id;
    } catch (error) {
        console.error("❌ Error creating notification:", error);
        console.error("Notification params:", {
            type: params.type,
            postSlug: params.postSlug,
            postTitle: params.postTitle,
            commentId: params.commentId,
            authorName: params.authorName,
            authorEmail: params.authorEmail,
            recipientEmail: params.recipientEmail
        });
        throw error;
    }
};

export const sendEmailNotification = async (params: CreateNotificationParams) => {
    // This would integrate with an email service like SendGrid, Mailgun, etc.
    // For now, we'll just log the email notification
    console.log("📧 Email notification would be sent:", {
        to: params.recipientEmail,
        subject: `New ${params.type} on your post`,
        body: `${params.authorName} ${params.type}ed on your post "${params.postTitle}"`
    });
};

// Helper function to create multiple notifications
export const createMultipleNotifications = async (notifications: CreateNotificationParams[]) => {
    const results = [];
    
    for (const notification of notifications) {
        try {
            const id = await createNotification(notification);
            results.push({ success: true, id, notification });
        } catch (error) {
            console.error("Failed to create notification:", notification, error);
            results.push({ success: false, error, notification });
        }
    }
    
    return results;
}; 