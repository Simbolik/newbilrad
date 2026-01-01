import { WithContext, BreadcrumbList } from 'schema-dts';

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

interface BreadcrumbItem {
  name: string;
  slug?: string; // Optional slug, home doesn't need one
}

/**
 * Generate BreadcrumbList JSON-LD schema for navigation breadcrumbs
 */
export function generateBreadcrumbJsonLd(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  const baseUrl = getBaseUrl();
  
  const breadcrumbSchema: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      item: {
        '@type': 'WebPage',
        '@id': item.slug ? `${baseUrl}/${item.slug}` : baseUrl,
        url: item.slug ? `${baseUrl}/${item.slug}` : baseUrl,
        name: item.name
      }
    }))
  };

  return breadcrumbSchema;
}

/**
 * Generate breadcrumb schema for article pages
 * Home > Article (matches URL structure)
 */
export function generateArticleBreadcrumb({
  articleTitle,
  articleSlug
}: {
  articleTitle: string;
  articleSlug: string;
}): WithContext<BreadcrumbList> {
  const items: BreadcrumbItem[] = [
    { name: 'Hem' },
    { name: articleTitle, slug: articleSlug }
  ];

  return generateBreadcrumbJsonLd(items);
}

/**
 * Generate breadcrumb schema for category pages
 * Home > Category
 */
export function generateCategoryBreadcrumb({
  categoryName,
  categorySlug
}: {
  categoryName: string;
  categorySlug: string;
}): WithContext<BreadcrumbList> {
  const items: BreadcrumbItem[] = [
    { name: 'Hem' },
    { name: categoryName, slug: categorySlug }
  ];

  return generateBreadcrumbJsonLd(items);
}

/**
 * Generate breadcrumb schema for static pages (About, Contact, etc.)
 * Home > Page
 */
export function generatePageBreadcrumb({
  pageTitle,
  pageSlug
}: {
  pageTitle: string;
  pageSlug: string;
}): WithContext<BreadcrumbList> {
  const items: BreadcrumbItem[] = [
    { name: 'Hem' },
    { name: pageTitle, slug: pageSlug }
  ];

  return generateBreadcrumbJsonLd(items);
}