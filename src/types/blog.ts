export interface Author {
  name: string;
  avatar?: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  categories?: string[];
  author?: Author;
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface StructuredDataProps {
  type: 'article' | 'website' | 'organization';
  data: BlogPost | Record<string, unknown>;
} 