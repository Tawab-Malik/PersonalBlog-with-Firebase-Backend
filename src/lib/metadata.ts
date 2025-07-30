import { Metadata } from 'next'

export function generatePostMetadata(post: any): Metadata {
  const baseUrl = 'https://personal-blogfirebase.vercel.app/' // Replace with your actual domain
  
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.categories?.join(', ') || 'web development, programming',
    authors: [{ name: post.author?.name || 'BlogPost Team' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${baseUrl}/${post.slug}`,
      images: [
        {
          url: post.coverImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'BlogPost Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage || '/og-image.jpg'],
    },
    alternates: {
      canonical: `${baseUrl}/${post.slug}`,
    },
  }
} 