'use client';

import { useEffect, useState } from 'react';

interface ResponsiveImageProps {
  // Image URLs for different sizes
  mobileUrl?: string | null;  // For mobile screens (400x300)
  desktopUrl?: string | null; // For desktop screens (900x506)
  webpMobileUrl?: string | null;  // WebP version for mobile
  webpDesktopUrl?: string | null; // WebP version for desktop
  alt?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
}

export default function ResponsiveImage({
  mobileUrl,
  desktopUrl,
  webpMobileUrl,
  webpDesktopUrl,
  alt = '',
  className = '',
  loading = 'lazy',
  priority = false
}: ResponsiveImageProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if window width is mobile size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine which image to use
  const imageUrl = (isClient && isMobile && mobileUrl) ? mobileUrl : desktopUrl;
  
  // Determine dimensions based on which image we're using
  const width = (isClient && isMobile && mobileUrl) ? 400 : 900;
  const height = (isClient && isMobile && mobileUrl) ? 300 : 506;
  
  if (!imageUrl) return null;

  // For SSR, default to desktop image with picture element
  if (!isClient) {
    return (
      <picture>
        {webpDesktopUrl && (
          <source type="image/webp" srcSet={webpDesktopUrl} />
        )}
        <img
          src={desktopUrl || ''}
          alt={alt}
          width={900}
          height={506}
          className={className}
          loading={priority ? 'eager' : loading}
          {...(priority && { fetchPriority: 'high' as const })}
          decoding="async"
        />
      </picture>
    );
  }

  // Client-side rendering with WebP support
  const webpUrl = (isMobile && webpMobileUrl) ? webpMobileUrl : webpDesktopUrl;

  return (
    <picture>
      {webpUrl && (
        <source type="image/webp" srcSet={webpUrl} />
      )}
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? 'eager' : loading}
        {...(priority && { fetchPriority: 'high' as const })}
        decoding="async"
      />
    </picture>
  );
}
