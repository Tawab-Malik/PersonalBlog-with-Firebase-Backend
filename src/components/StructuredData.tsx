'use client'

import type { StructuredDataProps } from '@/types/blog'

export default function StructuredData({ type, data }: StructuredDataProps) {
  const baseUrl = 'https://personal-blogfirebase.vercel.app/' // Replace with your actual domain

  const getStructuredData = () => {
    switch (type) {
      case 'article':
        const articleData = data as import('@/types/blog').BlogPost
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: articleData.title,
          description: articleData.excerpt,
          image: articleData.coverImage,
          author: {
            '@type': 'Person',
            name: articleData.author?.name || 'BlogPost Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'BlogPost',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          datePublished: articleData.publishedAt,
          dateModified: articleData.publishedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/${articleData.slug}`,
          },
        }
      
      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'BlogPost',
          description: 'Discover the latest insights on web development, React, Next.js, and modern technologies.',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }
      
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'BlogPost',
          url: baseUrl,
          logo: `${baseUrl}/logo.png`,
          sameAs: [
            'https://twitter.com/blogpost',
            'https://github.com/blogpost',
          ],
        }
      
      default:
        return {}
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  )
} 