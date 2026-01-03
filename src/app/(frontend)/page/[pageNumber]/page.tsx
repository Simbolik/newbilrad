import PostCard from '@/components/site/posts/PostCard';
import { lexicalToHtml, lexicalToPlainText } from '@/lib/lexical-to-html';
import type { Metadata } from 'next';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import RichText from '@/components/RichText';
import { Pagination } from '@/components/Pagination';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSideURL } from '@/utilities/getURL';

export const revalidate = 600;

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

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

export default async function HomePage({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise;
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound();

  // Fetch homepage hero
  const payload = await getPayload({ config: configPromise });
  const heroResult = await payload.find({
    collection: 'page-heroes',
    where: {
      pageType: {
        equals: 'homepage',
      },
    },
    limit: 1,
  });
  
  const homepageHero = heroResult.docs[0];
  
  // Fetch posts with pagination support
  const postsPerPage = 6;
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: postsPerPage,
    page: sanitizedPageNumber,
    sort: '-publishedDate',
    overrideAccess: false,
  });
  
  // Check if page number is out of bounds
  if (sanitizedPageNumber > postsResult.totalPages) notFound();
  
  let posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    featured: {
      url: string | null;
      webpUrl: string | null;
      retinaUrl: null;
      alt: string;
      heroUrl: string | null;
      heroWebpUrl: string | null;
      heroRetinaUrl: null;
      heroMobileUrl: string | null;
      heroMobileWebpUrl: string | null;
      width: number;
      height: number;
    };
    categories: Array<{ name: string; slug: string }>;
    date: string;
    modified: string;
  }> = [];
  
  try {
    const payloadPosts = postsResult.docs;
    
    posts = payloadPosts.map(p => {
      // Convert Lexical content to HTML for excerpt
      const htmlContent = p.content ? lexicalToHtml(p.content) : '';
      const plainTextContent = p.content ? lexicalToPlainText(p.content) : '';
      
      // Generate excerpt from actual post content, not meta description
      const sourceText = htmlContent || plainTextContent || '';
      
      // Create smart excerpt with 80 word limit
      const smartExcerpt = createSmartExcerpt(sourceText, 80);
      
      // Image dimensions (default for now, can be enhanced)
      let heroWidth = 900;
      let heroHeight = 506;
      
      // heroImage is the actual field name in Payload Posts collection
      const heroImg = typeof p.heroImage === 'object' ? p.heroImage : null;
      if (heroImg) {
        heroWidth = heroImg.width || 900;
        heroHeight = heroImg.height || 506;
      }
      
      return {
        title: p.title,
        slug: p.slug,
        excerpt: smartExcerpt,
        featured: { 
          url: heroImg?.url ?? null,
          webpUrl: null, // Payload serves images via URL, format handled by Next.js Image
          retinaUrl: null,
          alt: heroImg?.alt ?? '',
          heroUrl: heroImg?.url ?? null,
          heroWebpUrl: null,
          heroRetinaUrl: null,
          heroMobileUrl: heroImg?.url ?? null,
          heroMobileWebpUrl: null,
          width: heroWidth,
          height: heroHeight
        },
        categories: p.categories ? (p.categories as Array<{ title: string; slug: string }>).map(c => ({ name: c.title, slug: c.slug })) : [],
        date: p.publishedAt as string,
        modified: p.updatedAt
      };
    });
  } catch (error) {
    console.error('Failed to load posts:', error);
  }
  
  return (
    <>
      {/* Homepage Hero - only on first page */}
      {sanitizedPageNumber === 1 && homepageHero?.content && (
        <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6 mb-6">
          <RichText 
            data={homepageHero.content} 
            enableGutter={false} 
            className="prose-headings:text-gray-800 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-p:text-base prose-p:mb-4 prose-p:last:mb-0 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-3 prose-li:text-base [&>*:last-child]:mb-0"
          />
        </div>
      )}
      
      {/* Page Header for paginated pages */}
      {sanitizedPageNumber > 1 && (
        <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6 mb-6">
          {/* Breadcrumbs */}
          <nav className="breadcrumbs flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
            <Link href="/" className="breadcrumb-item flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>Hem</span>
            </Link>
            <span className="breadcrumb-separator text-gray-400">›</span>
            <span className="breadcrumb-current text-gray-900 font-medium">Sida {sanitizedPageNumber}</span>
          </nav>
          
          {/* H1 Heading */}
          <h1 className="text-3xl font-bold text-gray-800">Senaste artiklarna – Sida {sanitizedPageNumber}</h1>
        </div>
      )}
      
      {/* Posts section */}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((p, index) => (
          <PostCard 
            key={p.slug} 
            {...p} 
            priority={sanitizedPageNumber === 1 && index < 2} 
          />
        ))}
      </div>
      
      {/* Pagination */}
      {postsResult.totalPages > 1 && postsResult.page && (
        <div className="mt-12">
          <Pagination 
            page={postsResult.page} 
            totalPages={postsResult.totalPages}
            basePath="/page"
          />
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise;
  const serverUrl = getServerSideURL();
  // Extract domain name from server URL
  const domainName = serverUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  const pageTitle = pageNumber === '1' 
    ? `Senaste artiklarna - ${domainName}`
    : `Senaste artiklarna - Sida ${pageNumber} - ${domainName}`;
  const metaDescription = pageNumber === '1'
    ? `Här hittar du de senaste artiklarna om bilar på ${domainName}. Läs våra guider och tips.`
    : `Här hittar du äldre artiklar om bilar på ${domainName} (Sida ${pageNumber}). Fortsätt läsa vårt arkiv för fler guider och tips.`;
  
  return {
    // 1) Base Meta Tags
    title: pageTitle,
    description: metaDescription,
    
    // 2) Robots & Crawling Instructions
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    
    // 3) Canonical & Language Alternates
    alternates: {
      canonical: `${serverUrl}/page/${pageNumber}`,
      languages: {
        'sv': `${serverUrl}/page/${pageNumber}`,
        'sv-SE': `${serverUrl}/page/${pageNumber}`,
      },
    },
    
    // 4) Open Graph (Social Media)
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: `${serverUrl}/page/${pageNumber}`,
      siteName: 'Bilråd.se',
      locale: 'sv_SE',
      type: 'website',
      images: [
        {
          url: `${serverUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Bilråd.se - Swedish Car Content Platform',
        },
      ],
    },
    
    // 5) Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: metaDescription,
      images: [`${serverUrl}/og-image.jpg`],
    },
    
    // 6) Other Meta Tags
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  });

  const totalPages = Math.ceil(totalDocs / 6);

  const pages: { pageNumber: string }[] = [];

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) });
  }

  return pages;
}
