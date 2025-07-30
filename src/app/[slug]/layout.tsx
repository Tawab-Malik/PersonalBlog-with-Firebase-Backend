import { Metadata } from 'next'
import { generatePostMetadata } from '@/lib/metadata'
import { db } from '../../../firebase/config'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { BlogPost } from '@/types/blog'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const q = query(
      collection(db, "posts"),
      where("slug", "==", resolvedParams.slug)
    )
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const post = querySnapshot.docs[0].data() as BlogPost
      return generatePostMetadata(post)
    }
    
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Error',
      description: 'An error occurred while loading the post.',
    }
  }
}

export default function PostLayout({ children }: Props) {
  return children
} 