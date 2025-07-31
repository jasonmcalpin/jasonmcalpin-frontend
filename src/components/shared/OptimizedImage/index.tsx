import { useState, useEffect, ImgHTMLAttributes } from 'react';
import './styles.css';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * OptimizedImage component that provides:
 * - WebP support with fallback
 * - Lazy loading
 * - Responsive images with srcSet
 * - Placeholder handling
 */
const OptimizedImage = ({
  src,
  alt,
  sizes = '100vw',
  className = '',
  width,
  height,
  priority = false,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const getWebPPath = (path: string) => {
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) return `${path}.webp`;
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

  if (error) {
    return (
      <div 
        className={`optimized-image optimized-image--error ${className}`}
        style={{ width: '100%', height: '100%' }}
        role="img"
        aria-label={`Image failed to load: ${alt}`}
        {...props}
      >
        <div className="optimized-image__placeholder">
          
        </div>
      </div>
    );
  }

  const webpSrc = getWebPPath(src);

  const loadingAttribute = priority ? 'eager' : 'lazy';

  return (
    <picture className={`optimized-image ${isLoaded ? 'optimized-image--loaded' : ''} ${className}`}>
      <source srcSet={webpSrc} type="image/webp" />
      
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
          className="optimized-image__loading" 
          role="status" 
          aria-label="Image loading"
        >
          <div className="loading-spinner" aria-hidden="true"></div>
          <span className="sr-only">Loading image</span>
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;
