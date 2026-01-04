import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import RelatedPosts from '@/components/site/posts/RelatedPosts'
import PostCard from '@/components/site/posts/PostCard'
import type { Post } from '@/payload-types'
import { formatSwedishDateWithAuthor } from '@/lib/swedish-date'
import { lexicalToHtml, lexicalToPlainText } from '@/lib/lexical-to-html'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Clock } from 'lucide-react'
import { calculateReadingTime, formatReadingTime } from '@/utilities/calculateReadingTime'
import { getServerSideURL } from '@/utilities/getURL'

// Function to create smart excerpt from content
function createSmartExcerpt(content: string, wordLimit: number = 65): string {
  if (!content) return '';
  
  // First, replace paragraph tags with a space to preserve separation
  const textWithSpaces = content
    .replace(/<\/p>\s*<p>/gi, ' ') // Replace paragraph breaks with space
    .replace(/<\/p>/gi, ' ') // Replace closing p tags with space
    .replace(/<p>/gi, '') // Remove opening p tags
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();
  
  // Split into words
  const words = textWithSpaces.split(/\s+/);
  
  // If content is shorter than limit, return as is
  if (words.length <= wordLimit) {
    return `<p>${textWithSpaces}</p>`;
  }
  
  // Build text up to word limit and find last complete sentence
  let currentText = '';
  let lastCompleteSentence = '';
  
  for (let i = 0; i < Math.min(words.length, wordLimit); i++) {
    if (currentText) currentText += ' ';
    currentText += words[i];
    
    // Check if this ends a sentence
    if (/[.!?]$/.test(words[i])) {
      lastCompleteSentence = currentText;
    }
  }
  
  // Use last complete sentence if we have one, otherwise use all words up to limit
  const targetText = lastCompleteSentence || currentText;
  
  return `<p>${targetText}</p>`;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  // Get all pages
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Get all posts
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Get all categories
  const categories = await payload.find({
    collection: 'categories',
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const pageParams = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  const postParams = posts.docs.map(({ slug }) => {
    return { slug }
  })

  const categoryParams = categories.docs.map(({ slug }) => {
    return { slug }
  })

  return [...pageParams, ...postParams, ...categoryParams]
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  const payload = await getPayload({ config: configPromise })

  // First, try to find a post
  const post = await queryPostBySlug({ slug: decodedSlug })
  
  if (post) {
    // Calculate reading time
    const readingTime = calculateReadingTime(post.content);
    
    // Get related posts - either manually selected or from same category
    let relatedPosts = post.relatedPosts?.filter((p): p is Post => typeof p === 'object') || [];
    
    // If no manual related posts and post has categories, fetch related posts from same category
    if (relatedPosts.length === 0 && post.categories && post.categories.length > 0) {
      const firstCategory = post.categories[0];
      if (typeof firstCategory === 'object') {
        const categoryRelatedPosts = await payload.find({
          collection: 'posts',
          where: {
            and: [
              {
                categories: {
                  contains: firstCategory.id,
                },
              },
              {
                id: {
                  not_equals: post.id,
                },
              },
            ],
          },
          limit: 4,
          depth: 1,
          sort: '-publishedAt',
        });
        relatedPosts = categoryRelatedPosts.docs;
      }
    }
    
    // Render post
    return (
      <article className="pb-16">
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        
        <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
              <Home className="w-4 h-4 flex-shrink-0" />
              <span className="translate-y-[2px]">Hem</span>
            </Link>
            {post.categories && Array.isArray(post.categories) && post.categories.length > 0 && typeof post.categories[0] === 'object' && (
              <>
                <span className="text-gray-400 translate-y-[2px]">&gt;</span>
                <Link 
                  href={`/${post.categories[0].slug}`}
                  className="hover:text-gray-800 transition-colors translate-y-[2px]"
                >
                  {post.categories[0].title}
                </Link>
              </>
            )}
            <span className="text-gray-400 translate-y-[2px]">&gt;</span>
            <span className="text-gray-800 font-medium translate-y-[2px]">{post.title}</span>
          </nav>
          
          {/* Featured Image */}
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="overflow-hidden rounded-xs mb-6">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <img
                  src={post.heroImage.sizes?.medium?.url || post.heroImage.url || ''}
                  alt={post.heroImage.alt || post.title}
                  width={900}
                  height={486}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
            </div>
          )}
          
          {/* Date and Author */}
          {post.publishedAt && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
              <span>
                {formatSwedishDateWithAuthor(post.publishedAt)} av{' '}
                <Link 
                  href="/om-oss"
                  className="hover:text-gray-400 transition-colors"
                >
                  Redaktionen på Bilråd.se
                </Link>
              </span>
            </div>
          )}
          
          {/* Reading Time */}
          <div className="flex items-center gap-1.5 mb-4 text-sm text-gray-600">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="translate-y-[1px]">Lästid: {formatReadingTime(readingTime)}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            {post.title}
          </h1>
          
          {/* Content */}
          <RichText className="max-w-none text-base [&>*:last-child]:mb-0" data={post.content} enableGutter={false} />
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts
            posts={relatedPosts}
            className="mt-6"
          />
        )}
      </article>
    )
  }

  // If not a post, try to find a category
  const category = await queryCategoryBySlug({ slug: decodedSlug })
  
  if (category) {
    // Get posts in this category
    const categoryPosts = await payload.find({
      collection: 'posts',
      where: {
        categories: {
          contains: category.id,
        },
      },
      sort: '-publishedAt',
      limit: 50,
      draft,
      overrideAccess: draft,
    })

    return (
      <div className="pb-16">
        <PageClient />
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        
        {/* Hero box with hero content */}
        {category.heroContent && (
          <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6 mb-6">
            <RichText 
              data={category.heroContent} 
              enableGutter={false} 
              className="prose-headings:text-gray-800 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-p:text-base prose-p:mb-4 prose-p:last:mb-0 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-3 prose-li:text-base [&>*:last-child]:mb-0"
            />
          </div>
        )}
        
        {/* Posts section */}
        {categoryPosts.docs.length === 0 ? (
          <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6">
            <p className="text-gray-600">Inga artiklar i denna kategori ännu.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categoryPosts.docs.map((post, index) => {
              // Convert Lexical content to HTML for excerpt
              const htmlContent = post.content ? lexicalToHtml(post.content) : '';
              const plainTextContent = post.content ? lexicalToPlainText(post.content) : '';
              
              // Use provided excerpt or generate from content
              const sourceText = htmlContent || plainTextContent;
              
              // Create smart excerpt with 80 word limit
              const smartExcerpt = createSmartExcerpt(sourceText, 80);
              
              return (
                <PostCard 
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={smartExcerpt}
                  featured={{
                    url: post.heroImage && typeof post.heroImage === 'object' ? (post.heroImage.sizes?.small?.url || post.heroImage.url) : null,
                    alt: post.heroImage && typeof post.heroImage === 'object' ? post.heroImage.alt : null,
                  }}
                  categories={post.categories?.map(cat => 
                    typeof cat === 'object' ? { name: cat.title, slug: cat.slug } : { name: '', slug: '' }
                  ).filter(cat => cat.name)}
                  date={post.publishedAt || ''}
                  modified={post.updatedAt}
                  priority={index < 2}
                />
              );
            })}
          </div>
        )}
      </div>
    )
  }

  // If not a post or category, try to find a page
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article className="pb-16">
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6">
        {/* Hero Image */}
        {page.heroImage && typeof page.heroImage === 'object' && (
          <div className="overflow-hidden rounded-xs mb-6">
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={page.heroImage.url || ''}
                alt={page.heroImage.alt || page.title}
                fill
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
          </div>
        )}
        
        {/* Page Content */}
        {page.content && (
          <RichText 
            className="prose-headings:text-gray-800 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-p:text-base prose-p:mb-4 prose-p:last:mb-0 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-3 prose-li:text-base [&>*:last-child]:mb-0" 
            data={page.content} 
            enableGutter={false} 
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  
  // Check if it's a post first
  const post = await queryPostBySlug({ slug: decodedSlug })
  if (post) {
    return generateMeta({ doc: post })
  }
  
  // Check if it's a category
  const category = await queryCategoryBySlug({ slug: decodedSlug })
  if (category) {
    const serverUrl = getServerSideURL()
    return {
      title: category.meta?.title || `${category.title} - Bilråd.se`,
      description: category.meta?.description || `Utforska artiklar om ${category.title} på Bilråd.se`,
      alternates: {
        canonical: `${serverUrl}/${category.slug}`,
      },
      openGraph: category.meta?.image && typeof category.meta.image === 'object' ? {
        images: [{
          url: category.meta.image.url || '',
          width: category.meta.image.width || 1200,
          height: category.meta.image.height || 630,
          alt: category.meta.image.alt || category.title,
        }],
      } : undefined,
    }
  }
  
  // Otherwise check for a page
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({ doc: page })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    depth: 2, // Populate related posts
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

const queryCategoryBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
