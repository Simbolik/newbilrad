import Link from 'next/link';
import Image from 'next/image';
import { formatSwedishDateWithAuthor } from '@/lib/swedish-date';
import type { Post } from '@/payload-types';

type RelatedPostsProps = {
  posts: Post[];
  className?: string;
};

export default function RelatedPosts({ posts, className = '' }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Relaterade artiklar</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => {
          if (typeof post === 'string') return null;
          
          return (
            <article 
              key={post.id} 
              className="rounded-xs border border-gray-100 bg-white p-3 shadow-3d flex flex-col h-full"
            >
              {post.heroImage && typeof post.heroImage === 'object' && (
                <Link href={`/${post.slug}`} className="block overflow-hidden rounded-xs">
                  <div className="relative w-full" style={{ aspectRatio: '400/300' }}>
                    <Image
                      src={post.heroImage.url || ''}
                      alt={post.heroImage.alt || post.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </Link>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>
                    {formatSwedishDateWithAuthor(post.publishedAt)} av{' '}
                    <Link 
                      href="/om-oss" 
                      className="hover:text-gray-400 transition-colors"
                    >
                      Redaktionen på AlltomSEO
                    </Link>
                  </span>
                </div>
              )}
              <h4 className="mt-4 text-lg font-semibold leading-snug">
                <Link href={`/${post.slug}`} className="text-gray-700 hover:text-gray-400 transition-colors">
                  {post.title}
                </Link>
              </h4>
              {post.meta?.description && (
                <div className="flex flex-col flex-grow">
                  <p className="prose prose-base mt-1 max-w-none flex-grow text-gray-600">
                    {post.meta.description}
                  </p>
                  <div className="mt-2.5">
                    <Link 
                      href={`/${post.slug}`}
                      className="inline-block px-5 py-2.5 bg-slate-600 text-white text-base font-medium rounded-xs hover:bg-slate-700 transition-colors duration-200"
                    >
                      Läs hela artikeln →
                    </Link>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
