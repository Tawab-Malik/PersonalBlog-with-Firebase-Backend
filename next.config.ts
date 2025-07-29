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
};

module.exports = nextConfig;
