/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'source.unsplash.com',         // for blog banners
            'avatars.githubusercontent.com', // GitHub avatars
            'i.pravatar.cc',
            'ui-avatars.com',
            'images.unsplash.com',
            'randomuser.me',
            'unsplash.com',
            'plus.unsplash.com',
            'lh3.googleusercontent.com',
            'images.remotePatterns'// another common avatar service
        ],
    },
    env: {
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    },
};

module.exports = nextConfig;
