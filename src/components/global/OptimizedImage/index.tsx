import { useState, useEffect } from 'react';
import type { ImgHTMLAttributes } from 'react';
import './styles.css';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  disableWebP?: boolean; // Option to disable WebP optimization
}

/**
 * OptimizedImage component that provides:
 * - WebP support with fallback
 * - Lazy loading
 * - Responsive images with srcSet
 * - Placeholder handling
 * - SVG and data URL support
 */
const OptimizedImage = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  width,
  height,
  priority = false,
  disableWebP = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const isSVG = (path: string): boolean => {
    return path.toLowerCase().includes('.svg') || 
           path.toLowerCase().startsWith('data:image/svg+xml');
  };

  const isDataURL = (path: string): boolean => {
    return path.startsWith('data:');
  };

  const shouldUseWebP = (): boolean => {
    if (disableWebP) return false;
    if (!src || typeof src !== 'string') return false;
    if (isSVG(src)) return false; // SVGs don't need WebP conversion
    if (isDataURL(src) && !src.includes('data:image/')) return false;
    return true;
  };

  const getWebPPath = (path: string): string => {
    if (!path || typeof path !== 'string') {
      return `${path || ''}.webp`;
    }

    if (isDataURL(path)) {
      return path;
    }
    
    const lastDotIndex = path.lastIndexOf('.');
    
    if (lastDotIndex === -1 || lastDotIndex === 0) {
      return `${path}.webp`;
    }
    
    return `${path.substring(0, lastDotIndex)}.webp`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  if (!src || typeof src !== 'string') {
    return (
      <div 
        className={`optimized-image optimized-image--error ${className}`}
        style={{ width: '100%', height: '100%' }}
        role='img'
        aria-label={`Invalid image source: ${alt}`}
      >
        <div className='optimized-image__placeholder'>
          Invalid image source
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`optimized-image optimized-image--error ${className}`}
        style={{ width: '100%', height: '100%' }}
        role='img'
        aria-label={`Image failed to load: ${alt}`}
        {...props}
      >
        <div className='optimized-image__placeholder'>
          Failed to load image
        </div>
      </div>
    );
  }

  const loadingAttribute = priority ? 'eager' : 'lazy';
  const useWebP = shouldUseWebP();

  if (!useWebP) {
    return (
      <div className={`optimized-image ${isLoaded ? 'optimized-image--loaded' : ''} ${className}`}>
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={loadingAttribute}
          onLoad={handleLoad}
          onError={handleError}
          className={`optimized-image__img ${isLoaded ? 'optimized-image__img--loaded' : ''}`}
          width={width}
          height={height}
          {...props}
        />
        
        {!isLoaded && (
          <div 
            className='optimized-image__loading' 
            role='status' 
            aria-label='Image loading'
          >
            <div className='loading-spinner' aria-hidden='true'></div>
            <span className='sr-only'>Loading image</span>
          </div>
        )}
      </div>
    );
  }

  const webpSrc = getWebPPath(src);

  return (
    <picture className={`optimized-image ${isLoaded ? 'optimized-image--loaded' : ''} ${className}`}>
      <source srcSet={webpSrc} type='image/webp' />
      
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loadingAttribute}
        onLoad={handleLoad}
        onError={handleError}
        className={`optimized-image__img ${isLoaded ? 'optimized-image__img--loaded' : ''}`}
        width={width}
        height={height}
        {...props}
      />
      
      {!isLoaded && (
        <div 
          className='optimized-image__loading' 
          role='status' 
          aria-label='Image loading'
        >
          <div className='loading-spinner' aria-hidden='true'></div>
          <span className='sr-only'>Loading image</span>
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;