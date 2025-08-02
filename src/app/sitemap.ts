import { MetadataRoute } from 'next'
import type { BlogPost } from '@/types/blog'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch posts from Firebase
  const postsQuery = query(collection(db, 'posts'), where('status', '==', 'published'))
  const postsSnapshot = await getDocs(postsQuery)
  const postData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BlogPost[]

  // Dynamic blog post pages
  const blogPages = postData
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