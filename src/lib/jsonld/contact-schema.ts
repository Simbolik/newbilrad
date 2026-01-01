import { WithContext, ContactPage } from 'schema-dts';

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
 * Generate ContactPage JSON-LD schema for contact page
 */
export function generateContactJsonLd({
  title,
  description,
  slug,
}: {
  title: string;
  description?: string;
  slug: string;
}): WithContext<ContactPage> {
  const baseUrl = getBaseUrl();
  
  const contactSchema: WithContext<ContactPage> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${baseUrl}/${slug}#contact`,
    
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
    
    // Main entity of page
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${slug}`
    }
  };

  return contactSchema;
}