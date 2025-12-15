import PostCard from '@/components/site/posts/PostCard';
import { getLatestPosts } from '@/lib/payload';
import { lexicalToHtml, lexicalToPlainText } from '@/lib/lexical-to-html';
import type { Metadata } from 'next';
import { getOrganizationMainJson } from '@/lib/jsonld/organization-main';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import RichText from '@/components/RichText';

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

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'AlltomSEO.se – SEO Content Platform';
  const metaDescription = 'Professional SEO-optimized content platform powered by Next.js and Payload CMS.';
  
  return {
    // 1) Base Meta Tags (Next.js will order these first)
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
      canonical: 'https://alltomseo.se',
      languages: {
        'sv': 'https://alltomseo.se',
        'sv-SE': 'https://alltomseo.se',
      },
    },
    
    // 4) Open Graph (Social Media)
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      url: 'https://alltomseo.se',
      siteName: 'AlltomSEO.se',
      locale: 'sv_SE',
      type: 'website',
      images: [
        {
          url: 'https://alltomseo.se/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'AlltomSEO.se - SEO Content Platform',
        },
      ],
    },
    
    // 5) Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: metaDescription,
      images: ['https://alltomseo.se/og-image.jpg'],
    },
    
    // 6) Other Meta Tags
    other: {
      'format-detection': 'telephone=no',
    },
  };
}

export default async function Home() {
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
    const payloadPosts = await getLatestPosts(6);
    
    posts = payloadPosts.map(p => {
      // Convert Lexical content to HTML for excerpt
      const htmlContent = p.content ? lexicalToHtml(p.content) : '';
      const plainTextContent = p.content ? lexicalToPlainText(p.content) : '';
      
      // Use provided excerpt or generate from content
      const sourceText = p.excerpt || htmlContent || plainTextContent;
      
      // Create smart excerpt with 80 word limit
      const smartExcerpt = createSmartExcerpt(sourceText, 80);
      
      // Image dimensions (default for now, can be enhanced)
      let heroWidth = 900;
      let heroHeight = 506;
      
      if (p.featuredImage) {
        heroWidth = p.featuredImage.width || 900;
        heroHeight = p.featuredImage.height || 506;
      }
      
      return {
        title: p.title,
        slug: p.slug,
        excerpt: smartExcerpt,
        featured: { 
          url: p.featuredImage?.url ?? null,
          webpUrl: null, // Payload serves images via URL, format handled by Next.js Image
          retinaUrl: null,
          alt: p.featuredImage?.alt ?? '',
          heroUrl: p.featuredImage?.url ?? null,
          heroWebpUrl: null,
          heroRetinaUrl: null,
          heroMobileUrl: p.featuredImage?.url ?? null,
          heroMobileWebpUrl: null,
          width: heroWidth,
          height: heroHeight
        },
        categories: p.category ? [{ name: p.category.name, slug: p.category.slug }] : [],
        date: p.publishedDate,
        modified: p.updatedAt
      };
    });
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  
  return (
    <>
      {/* Organization JSON-LD - Main page only */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationMainJson()) }}
      />
      
      {/* Homepage Hero */}
      {homepageHero && (
        <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6 mb-6">
          <RichText 
            data={homepageHero.content} 
            enableGutter={false} 
            className="prose-headings:text-gray-800 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-4 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-3 prose-h3:mb-2 prose-p:text-base prose-p:mb-4 prose-p:last:mb-0 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2 prose-ul:my-3 prose-li:text-base [&>*:last-child]:mb-0"
          />
        </div>
      )}
      
      {/* Posts section */}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map(p => (<PostCard key={p.slug} {...p} />))}
      </div>
    </>
  );
}
