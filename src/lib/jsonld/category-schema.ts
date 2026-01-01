import { WithContext, CollectionPage } from 'schema-dts';

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
 * Generate CollectionPage JSON-LD schema for category pages
 */
export function generateCategoryJsonLd({
  name,
  slug,
  description,
  posts,
}: {
  name: string;
  slug: string;
  description?: string;
  posts: Array<{
    title: string;
    slug: string;
  }>;
}): WithContext<CollectionPage> {
  const baseUrl = getBaseUrl();
  
  // Build item list elements from posts
  const itemListElements = posts.map((post, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    url: `${baseUrl}/${post.slug}`,
    name: post.title,
  }));

  const categorySchema: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}/${slug}#collection`,
    
    // Basic page information
    url: `${baseUrl}/${slug}`,
    name: name,
    
    // Description if available
    ...(description && { description }),
    
    // Language
    inLanguage: 'sv-SE',
    
    // Publisher reference to organization
    publisher: {
      '@id': `${baseUrl}/#redaktionen`
    },
    
    // Main entity - the list of posts
    mainEntity: {
      '@type': 'ItemList',
      '@id': `${baseUrl}/${slug}#itemlist`,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      numberOfItems: posts.length,
      itemListElement: itemListElements
    }
  };

  return categorySchema;
}