import { MetadataRoute } from 'next'
import postData from '../../data/postData.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://personal-blogfirebase.vercel.app' // Remove trailing slash
  
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

  // Dynamic blog post pages - remove duplicates
  const uniquePosts = postData.filter((post: any, index: number, self: any[]) => 
    index === self.findIndex((p: any) => p.slug === post.slug)
  )
  
  const blogPages = uniquePosts.map((post: any) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
} 