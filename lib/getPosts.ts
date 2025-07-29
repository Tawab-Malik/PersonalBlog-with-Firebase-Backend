// lib/getPosts.ts
import {collection, getDocs} from "firebase/firestore";
import {db} from "./utils/firebaseConfig"; // Adjust if your path is different

interface Author {
    name: string;
    avatar: string;
}

interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: Author;
    categories: string[];
    publishedAt: string;
    coverImage: string;
    readingTime: string;
}

export async function fetchPostsFromFirebase(): Promise<Post[]> {
    const snapshot = await getDocs(collection(db, "posts"));

    return snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            author: {
                name: data.author?.name || "Unknown",
                avatar: data.author?.avatar || "/default-avatar.png",
            },
            categories: data.categories || [],
            publishedAt: data.publishedAt || new Date().toISOString(),
            coverImage: data.coverImage || "/default-image.jpg",
            readingTime: data.readingTime || "2 min read",
        };
    });
}
