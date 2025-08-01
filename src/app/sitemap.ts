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
    {
      url: `${baseUrl}/authors`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic blog post pages
  const blogPages = (postData as BlogPost[])
    .filter((post: BlogPost) => {
      return post && 
             post.slug && 
             post.slug.trim() !== '' && 
             post.title && 
             post.publishedAt
    })
    .map((post: BlogPost) => ({
      url: `${baseUrl}/${post.slug}`,
      lastModified: new Date(post.publishedAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  // Return combined sitemap
  return [...staticPages, ...blogPages]
} 