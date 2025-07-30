import { Inter, Manrope, Nunito } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import LayoutWrapper from "./components/LayoutWrapper";
import type { Metadata } from 'next';
import StructuredData from "@/components/StructuredData";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'BlogPost - Your Tech Blog',
    template: '%s | BlogPost'
  },
  description: 'Discover the latest insights on web development, React, Next.js, and modern technologies. Expert tutorials and guides for developers.',
  keywords: ['web development', 'React', 'Next.js', 'JavaScript', 'TypeScript', 'programming', 'tutorials'],
  authors: [{ name: 'BlogPost Team' }],
  creator: 'BlogPost',
  publisher: 'BlogPost',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://personal-blogfirebase.vercel.app/'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://personal-blogfirebase.vercel.app/', // Replace with your actual domain
    title: 'BlogPost - Your Tech Blog',
    description: 'Discover the latest insights on web development, React, Next.js, and modern technologies.',
    siteName: 'BlogPost',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image to public folder
        width: 1200,
        height: 630,
        alt: 'BlogPost - Tech Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogPost - Your Tech Blog',
    description: 'Discover the latest insights on web development, React, Next.js, and modern technologies.',
    images: ['/og-image.jpg'], // Same image as OpenGraph
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        {/* Add your Google verification tag here */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
        <StructuredData type="website" data={{}} />
        <StructuredData type="organization" data={{}} />
      </head>
      <body className={`${manrope.variable} ${nunito.variable} ${inter.variable} antialiased`}>
        <HeroUIProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </HeroUIProvider>
      </body>
    </html>
  );
}
