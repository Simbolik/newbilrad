import { WithContext, AboutPage } from 'schema-dts';

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
 * Generate AboutPage JSON-LD schema for about us page
 */
export function generateAboutJsonLd({
  title,
  description,
  slug,
}: {
  title: string;
  description?: string;
  slug: string;
}): WithContext<AboutPage> {
  const baseUrl = getBaseUrl();
  
  const aboutSchema: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${baseUrl}/${slug}#about`,
    
    // Basic page information
    url: `${baseUrl}/${slug}`,
    name: title,
    
    // Description
    ...(description && { description }),
    
    // Language
    inLanguage: 'sv-SE',
    
    // Publisher reference to organization
    publisher: {
      '@id': `${baseUrl}/#redaktionen`
    },
    
    // About reference - pointing to the organization
    about: {
      '@id': `${baseUrl}/#redaktionen`
    },
    
    // Main entity of page
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${slug}`
    }
  };

  return aboutSchema;
}