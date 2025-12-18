'use client';

interface HeroImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function HeroImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '' 
}: HeroImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}
