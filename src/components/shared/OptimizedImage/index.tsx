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

  // Generate WebP version path
  const getWebPPath = (path: string) => {
    const lastDotIndex = path.lastIndexOf('.');
    if (lastDotIndex === -1) return `${path}.webp`;
    return `${path.substring(0, lastDotIndex)}.webp`;
  };

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Handle image error
  const handleError = () => {
    setError(true);
  };

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // If there's an error loading the image, show a placeholder
  if (error) {
    return (
      <div 
        className={`optimized-image optimized-image--error ${className}`}
        style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
        {...props}
      >
        <div className="optimized-image__placeholder">
          <span>{alt.charAt(0) || '?'}</span>
        </div>
      </div>
    );
  }

  // Generate WebP version path
  const webpSrc = getWebPPath(src);

  // Determine if image should be lazy loaded
  const loadingAttribute = priority ? 'eager' : 'lazy';

  return (
    <picture className={`optimized-image ${isLoaded ? 'optimized-image--loaded' : ''} ${className}`}>
      {/* WebP source */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Original image source */}
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
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="optimized-image__loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </picture>
  );
};

export default OptimizedImage;
