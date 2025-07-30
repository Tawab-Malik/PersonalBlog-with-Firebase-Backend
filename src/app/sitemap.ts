import { MetadataRoute } from 'next'
import postData from '../../data/postData.json'
import type { BlogPost } from '@/types/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://personal-blogfirebase.vercel.app'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic blog post pages - remove duplicates and ensure valid URLs
  const uniquePosts = (postData as BlogPost[])
    .filter((post: BlogPost, index: number, self: BlogPost[]) => 
      index === self.findIndex((p: BlogPost) => p.slug === post.slug)
    )
    .filter((post: BlogPost) => post.slug && post.slug.trim() !== '') // Ensure valid slugs
  
  const blogPages = uniquePosts.map((post: BlogPost) => ({
    url: `${baseUrl}/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Return clean sitemap data
  return [...staticPages, ...blogPages]
} 