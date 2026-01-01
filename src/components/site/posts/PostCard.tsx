import Link from 'next/link';
import { formatSwedishDateWithAuthor } from '@/lib/swedish-date';

type Card = { 
  title:string; 
  slug:string; 
  excerpt?:string|null; 
  featured?:{ url?:string|null; webpUrl?:string|null; alt?:string|null };
  categories?: { name: string; slug: string }[];
  date?: string;
  modified?: string;
  priority?: boolean;
};
export default function PostCard({ title, slug, excerpt, featured, categories, date, modified, priority = false }: Card){
  return (
    <article className="rounded-xs border border-border bg-surface p-3 shadow-3d flex flex-col h-full">
      {featured?.url && (
        <Link href={`/${slug}`} className="block overflow-hidden rounded-xs">
          <div className="relative w-full" style={{ aspectRatio: '400/300' }}>
            <picture>
              {featured.webpUrl && (
                <source type="image/webp" srcSet={featured.webpUrl} />
              )}
              <img 
                src={featured.url} 
                alt={featured.alt ?? ''} 
                width={400} 
                height={300} 
                className="w-full h-full object-cover"
                loading={priority ? "eager" : "lazy"}
                {...(priority && { fetchPriority: "high" as const })}
              />
            </picture>
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
      <h2 className="mt-4 text-lg font-semibold leading-snug">
        <Link href={`/${slug}`} className="text-gray-700 hover:text-gray-400 transition-colors">{title}</Link>
      </h2>
      {excerpt && (
        <div className="flex flex-col flex-grow">
          <div className="prose prose-base mt-1 max-w-none flex-grow [&>*:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: excerpt }} />
          <div className="mt-3">
            <Link 
              href={`/${slug}`}
              className="inline-block px-5 py-2.5 bg-slate-600 text-white text-base font-medium rounded-xs hover:bg-slate-700 transition-colors duration-200"
            >
              Läs hela artikeln →
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
