import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://personal-blogfirebase.vercel.app'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/profile/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 