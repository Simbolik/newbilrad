import { WithContext, Article } from 'schema-dts';

/**
 * Get the base URL for the current environment
 * - Development: http://localhost:3000
 * - Production: https://bilråd.se
 */
function getBaseUrl(): string {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side environment detection
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // Production - use the real domain
  return 'https://bilråd.se';
}

/**
 * Robust HTML stripping function that handles tags and HTML entities
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities like &amp; &quot; etc
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Format date to ISO 8601 standard
 */
function formatDateToISO(date: string): string {
  try {
    // If already in ISO format with timezone, return as is
    if (date.includes('T') && (date.includes('+') || date.includes('Z'))) {
      return date;
    }
    // Parse and convert to ISO format
    return new Date(date).toISOString();
  } catch {
    // Fallback to original date if parsing fails
    console.warn('Date parsing failed for:', date);
    return date;
  }
}

/**
 * Generate Article JSON-LD schema for blog posts
 */
export function generateArticleJsonLd({
  title,
  content,
  slug,
  excerpt,
  featuredImage,
  datePublished,
  dateModified,
  category,
}: {
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  datePublished: string;
  dateModified?: string;
  category?: {
    name: string;
    slug: string;
  };
}): WithContext<Article> {
  const baseUrl = getBaseUrl();
  
  // Clean content from HTML for word count and schema
  const cleanContent = stripHtml(content);
  
  // Calculate reading time (approximately 200 words per minute)
  const wordCount = cleanContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  // Clean excerpt from HTML tags for description
  const cleanExcerpt = excerpt 
    ? stripHtml(excerpt)
    : cleanContent.substring(0, 160).trim() + '...';

  const articleSchema: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}/${slug}#article`,
    
    // Basic article information
    headline: title,
    description: cleanExcerpt,
    
    // Content and structure
    articleBody: cleanContent, // Already cleaned content
    wordCount: wordCount,
    timeRequired: `PT${readingTime}M`, // ISO 8601 duration format (e.g., "PT5M" = 5 minutes)
    
    // URLs and identification
    url: `${baseUrl}/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${slug}`
    },
    
    // Dates (ensure proper ISO format)
    datePublished: formatDateToISO(datePublished),
    dateModified: dateModified ? formatDateToISO(dateModified) : formatDateToISO(datePublished),
    
    // Author - Reference to the organization defined in main layout
    author: {
      '@id': `${baseUrl}/#redaktionen`
    },
    
    // Publisher - Same as author for this site
    publisher: {
      '@id': `${baseUrl}/#redaktionen`
    },
    
    // Language and locale
    inLanguage: 'sv-SE',
    
    // Categories and topics
    ...(category && {
      keywords: [category.name, 'bil', 'bilråd', 'Sverige']
    }),
    
    // Featured image with structured ImageObject
    ...(featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: featuredImage.url,
        ...(featuredImage.width && { width: featuredImage.width.toString() }),
        ...(featuredImage.height && { height: featuredImage.height.toString() }),
        ...(featuredImage.alt && { caption: featuredImage.alt })
      }
    })
  };

  return articleSchema;
}