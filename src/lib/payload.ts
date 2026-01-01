import { getPayload as getPayloadInstance } from 'payload'
import configPromise from '@/payload.config'

// Get Payload instance
export const getPayload = async () => {
  return await getPayloadInstance({ config: configPromise })
}

// Type definitions for content
export interface Post {
  id: string
  title: string
  slug: string
  content: any
  excerpt?: string
  featuredImage?: {
    url: string
    alt: string
    width: number
    height: number
  }
  category?: Category
  publishedDate: string
  seoTitle?: string
  seoDescription?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  slug: string
  content: any
  pageType: 'about' | 'contact' | 'services' | 'default'
  seoTitle?: string
  seoDescription?: string
  status: 'published' | 'draft'
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Media {
  id: string
  url: string
  alt: string
  filename: string
  width: number
  height: number
}

// Fetch latest posts
export async function getLatestPosts(limit = 10) {
  const payload = await getPayload()
  
  const posts = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit,
    draft: false, // Only fetch published posts
  })
  
  return posts.docs.map(transformPost)
}

// Fetch post by slug
export async function getPostBySlug(slug: string) {
  const payload = await getPayload()
  
  const posts = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    draft: false, // Only fetch published posts
  })
  
  if (posts.docs.length === 0) {
    return null
  }
  
  return transformPost(posts.docs[0])
}

// Fetch page by slug
export async function getPageBySlug(slug: string) {
  const payload = await getPayload()
  
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    draft: false, // Only fetch published pages
  })
  
  if (pages.docs.length === 0) {
    return null
  }
  
  return transformPage(pages.docs[0])
}

// Fetch all categories
export async function getCategories() {
  const payload = await getPayload()
  
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'name',
  })
  
  return categories.docs
}

// Fetch posts by category
export async function getPostsByCategory(categorySlug: string, limit = 10) {
  const payload = await getPayload()
  
  // First find the category
  const categories = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: categorySlug,
      },
    },
    limit: 1,
  })
  
  if (categories.docs.length === 0) {
    return []
  }
  
  const categoryId = categories.docs[0].id
  
  // Then find posts with that category
  const posts = await payload.find({
    collection: 'posts',
    where: {
      categories: {
        contains: categoryId,
      },
    },
    sort: '-publishedAt',
    limit,
    draft: false,
  })
  
  return posts.docs.map(transformPost)
}

// Search posts
export async function searchPosts(searchTerm: string, limit = 10) {
  const payload = await getPayload()
  
  const posts = await payload.find({
    collection: 'posts',
    where: {
      or: [
        {
          title: {
            contains: searchTerm,
          },
        },
        {
          content: {
            contains: searchTerm,
          },
        },
      ],
    },
    sort: '-publishedAt',
    limit,
    draft: false,
  })
  
  return posts.docs.map(transformPost)
}

// Transform Payload post to our Post interface
function transformPost(doc: any): Post {
  // Handle heroImage field
  const featuredImage = doc.heroImage
    ? typeof doc.heroImage === 'object'
      ? {
          url: doc.heroImage.url || '',
          alt: doc.heroImage.alt || '',
          width: doc.heroImage.width || 0,
          height: doc.heroImage.height || 0,
        }
      : undefined
    : undefined
  
  // Handle categories array - get first category
  const category = doc.categories && Array.isArray(doc.categories) && doc.categories.length > 0
    ? typeof doc.categories[0] === 'object'
      ? doc.categories[0]
      : undefined
    : undefined
  
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    excerpt: doc.excerpt,
    featuredImage,
    category,
    publishedDate: doc.publishedAt || doc.createdAt,
    seoTitle: doc.meta?.title,
    seoDescription: doc.meta?.description,
    status: doc._status || 'published',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Transform Payload page to our Page interface
function transformPage(doc: any): Page {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    content: doc.content,
    pageType: doc.pageType,
    seoTitle: doc.seoTitle,
    seoDescription: doc.seoDescription,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

// Get site info (can be extended with a globals collection)
export async function getSiteInfo() {
  return {
    title: 'Bilråd.se',
    description: 'Your Trusted Guide to Car Ownership in Sweden',
  }
}
