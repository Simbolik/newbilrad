'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getArticleDateDisplay } from '@/lib/swedish-date';
import { useEffect } from 'react';
import RelatedArticles from './RelatedArticles';
import ScrollToTop from '@/components/site/ui/ScrollToTop';
import ResponsiveTables from '@/components/site/ui/ResponsiveTables';
import ResponsiveImage from '@/components/site/ui/ResponsiveImage';
import ArticleWithTOC from './ArticleWithTOC';
import SmoothScrollScript from './SmoothScrollScript';
import './article-styles.css';
import './related-articles-styles.css';

interface ArticleProps {
  title: string;
  content: string;
  featuredImage?: {
    url: string;
    alt: string;
    heroUrl?: string;
    heroMobileUrl?: string;
    heroWebpUrl?: string;
    heroMobileWebpUrl?: string;
  };
  date?: string;
  modified?: string;
  author?: string;
  category?: {
    name: string;
    slug: string;
  };
  readingTime?: number;
  previousPost?: {
    title: string;
    slug: string;
    featuredImage?: string;
  };
  nextPost?: {
    title: string;
    slug: string;
    featuredImage?: string;
  };
  relatedArticles?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    featuredImage?: {
      url: string;
      alt?: string;
    };
    categories?: { name: string; slug: string }[];
    date?: string;
    modified?: string;
  }>;
  currentSlug?: string;
}

export default function Article({ 
  title, 
  content, 
  featuredImage, 
  date,
  modified,
  author,
  category,
  readingTime,
  previousPost,
  nextPost,
  relatedArticles,
  currentSlug
}: ArticleProps) {
  
  useEffect(() => {
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('.article-content pre');
    codeBlocks.forEach((block) => {
      if (!block.querySelector('.copy-button')) {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;
        button.addEventListener('click', async () => {
          const code = block.querySelector('code')?.textContent || '';
          await navigator.clipboard.writeText(code);
          button.classList.add('copied');
          button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = `
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
          }, 2000);
        });
        block.appendChild(button);
      }
    });
  }, [content]);

  return (
    <article className="article-container">
      {/* Article Header */}
      <header className="article-header">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" className="breadcrumb-item">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span>Hem</span>
          </Link>
          {category && (
            <>
              <span className="breadcrumb-separator">›</span>
              <Link href={`/${category.slug}`} className="breadcrumb-item">
                {category.name}
              </Link>
            </>
          )}
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="article-title">{title}</h1>

        {/* Meta Information */}
        <ul className="article-meta">
          {author && (
            <li className="meta-item">
              <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{author}</span>
            </li>
          )}
          {date && (
            <li className="meta-item">
              <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={`${date}${date.includes('T') ? '+02:00' : 'T00:00:00+02:00'}`}>
                {getArticleDateDisplay(date, modified)}
              </time>
            </li>
          )}
          {readingTime && (
            <li className="meta-item">
              <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span aria-label={`Beräknad lästid: ${readingTime} minuter`}>{readingTime} min läsning</span>
            </li>
          )}
          <li className="meta-item">
            <svg className="meta-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>av <Link href="/om-oss/" className="text-blue-600 hover:text-blue-800 underline transition-colors" rel="author">Redaktionen på AlltomSEO.se</Link></span>
          </li>
        </ul>
      </header>

      {/* Featured Image */}
      {featuredImage && (
        <figure className="featured-image-container">
          <div className="featured-image-wrapper">
            <ResponsiveImage
              desktopUrl={featuredImage.heroUrl || featuredImage.url}
              mobileUrl={featuredImage.heroMobileUrl || featuredImage.url}
              webpDesktopUrl={featuredImage.heroWebpUrl}
              webpMobileUrl={featuredImage.heroMobileWebpUrl}
              alt={featuredImage.alt || title}
              className="featured-image"
              loading="eager"
              priority={true}
            />
          </div>
          {featuredImage.alt && (
            <figcaption className="featured-image-caption">
              {featuredImage.alt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Add smooth scrolling */}
      <SmoothScrollScript />
      
      {/* Article Content with integrated TOC */}
      <div className="article-content prose prose-lg prose-gray max-w-none">
        <ArticleWithTOC html={content} />
      </div>
      
      {/* Article Footer */}
      <footer className="article-footer">
        {/* Article Navigation */}
        {(previousPost || nextPost) && (
          <nav className="article-navigation">
            {previousPost ? (
              <Link href={`/${previousPost.slug}`} className="nav-item previous group">
                {previousPost.featuredImage && (
                  <div className="nav-image">
                    <Image
                      src={previousPost.featuredImage}
                      alt={previousPost.title}
                      width={120}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="nav-content">
                  <span className="nav-label">
                    <svg className="nav-arrow left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Föregående artikel
                  </span>
                  <h4 className="nav-title">{previousPost.title}</h4>
                </div>
              </Link>
            ) : (
              <div className="nav-item placeholder"></div>
            )}
            
            {nextPost ? (
              <Link href={`/${nextPost.slug}`} className="nav-item next group">
                <div className="nav-content">
                  <span className="nav-label">
                    Nästa artikel
                    <svg className="nav-arrow right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </span>
                  <h4 className="nav-title">{nextPost.title}</h4>
                </div>
                {nextPost.featuredImage && (
                  <div className="nav-image">
                    <Image
                      src={nextPost.featuredImage}
                      alt={nextPost.title}
                      width={120}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  )}
              </Link>
            ) : (
              <div className="nav-item placeholder"></div>
            )}
          </nav>
        )}
        
        {/* Related Articles Section */}
        {relatedArticles && relatedArticles.length > 0 && currentSlug && (
          <RelatedArticles 
            articles={relatedArticles} 
            currentArticleSlug={currentSlug}
          />
        )}
        
        <div className="share-section">
          <h3 className="share-title">Dela denna artikel</h3>
          <div className="share-buttons">
            <button className="share-button twitter" aria-label="Dela på Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button className="share-button facebook" aria-label="Dela på Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button className="share-button linkedin" aria-label="Dela på LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
            <button className="share-button copy" aria-label="Kopiera länk">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Responsive tables processor */}
      <ResponsiveTables rootSelector=".article-content .prose" />

      {/* Scroll to top button */}
      <ScrollToTop />
    </article>
  );
}
