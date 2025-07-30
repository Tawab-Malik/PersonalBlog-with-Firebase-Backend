import { NextResponse } from 'next/server'
import postData from '../../../data/postData.json'
import type { BlogPost } from '@/types/blog'

export async function GET() {
  const baseUrl = 'https://personal-blogfirebase.vercel.app'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Dynamic blog post pages - remove duplicates and ensure valid URLs
  const uniquePosts = (postData as BlogPost[])
    .filter((post: BlogPost, index: number, self: BlogPost[]) => 
      index === self.findIndex((p: BlogPost) => p.slug === post.slug)
    )
    .filter((post: BlogPost) => post.slug && post.slug.trim() !== '')
  
  const blogPages = uniquePosts.map((post: BlogPost) => ({
    url: `${baseUrl}/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.publishedAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const allPages = [...staticPages, ...blogPages]

  // Generate clean XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
} 