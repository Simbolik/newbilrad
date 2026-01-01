import Link from 'next/link';
import { formatSwedishDateWithAuthor } from '@/lib/swedish-date';
import ResponsiveImage from '@/components/ui/ResponsiveImage';

type Hero = { 
  title:string; 
  slug:string; 
  excerpt?:string|null; 
  featured?:{ 
    url?:string|null; 
    retinaUrl?:string|null; 
    alt?:string|null;
    heroUrl?:string|null;
    heroRetinaUrl?:string|null;
    heroMobileUrl?:string|null;
    heroWebpUrl?:string|null;
    heroMobileWebpUrl?:string|null;
    width?: number;
    height?: number;
  };
  categories?: { name: string; slug: string }[];
  date?: string;
  modified?: string;
};
export default function PostHero({ title, slug, excerpt, featured, categories, date, modified }: Hero){
  // Get desktop and mobile image URLs
  const desktopImageUrl = featured?.heroUrl || featured?.url;
  const mobileImageUrl = featured?.heroMobileUrl;
  const webpDesktopUrl = featured?.heroWebpUrl;
  const webpMobileUrl = featured?.heroMobileWebpUrl;
  
  return (
    <article className="rounded-xs border border-border bg-surface p-4 shadow-3d">
      {desktopImageUrl && (
        <Link href={`/${slug}`} className="block overflow-hidden rounded-xs">
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <ResponsiveImage
              desktopUrl={desktopImageUrl}
              mobileUrl={mobileImageUrl}
              webpDesktopUrl={webpDesktopUrl}
              webpMobileUrl={webpMobileUrl}
              alt={featured?.alt ?? ''}
              className="w-full h-full"
              loading="eager"
              priority={true}
            />
          </div>
        </Link>
      )}
      {date && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <span>
            {formatSwedishDateWithAuthor(date)} av{' '}
            <Link 
              href="/om-oss" 
              className="hover:text-gray-400 transition-colors"
            >
              Redaktionen på Bilråd.se
            </Link>
          </span>
        </div>
      )}
      <h2 className="mt-4 mb-3 text-2xl font-semibold leading-snug">
        <Link href={`/${slug}`} className="text-gray-700 hover:text-gray-400 transition-colors">{title}</Link>
      </h2>
      {excerpt && (
        <>
          <div className="prose prose-base max-w-none [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: excerpt }} />
          <Link 
            href={`/${slug}`}
            className="inline-block mt-3 px-5 py-2.5 bg-slate-600 text-white text-base font-medium rounded-xs hover:bg-slate-700 transition-colors duration-200"
          >
            Läs hela artikeln →
          </Link>
        </>
      )}
    </article>
  );
}
