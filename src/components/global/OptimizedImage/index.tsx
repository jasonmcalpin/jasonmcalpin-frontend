import { useEffect, useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { responsiveImage } from '../../../services/responsiveImages';
import './styles.css';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'srcSet' | 'sizes'> {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  disableWebP?: boolean;
}

/**
 * A stable aspect-ratio wrapper, true width-descriptor srcset, and native lazy
 * loading. Original-format `img.src` remains the fallback for non-WebP clients.
 */
const OptimizedImage = ({
  src, alt, sizes = '100vw', className = '', width, height,
  priority = false, disableWebP = false, ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => { setIsLoaded(false); setError(false); }, [src]);

  const responsive = responsiveImage(src);
  const nativeWidth = width ?? responsive.width;
  const nativeHeight = height ?? responsive.height;
  const useWebP = !disableWebP && !!responsive.srcSet;
  const aspectRatio = nativeWidth && nativeHeight ? `${nativeWidth} / ${nativeHeight}` : undefined;

  if (!src || error) {
    return (
      <div className={`optimized-image optimized-image--error ${className}`}
        role="img" aria-label={`Image unavailable: ${alt}`}
        style={aspectRatio ? { aspectRatio } : undefined}>
        <div className="optimized-image__placeholder">Image unavailable</div>
      </div>
    );
  }

  return (
    <div className={`optimized-image ${isLoaded ? 'optimized-image--loaded' : ''} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}>
      <picture className="optimized-image__picture">
        {useWebP && <source type="image/webp" srcSet={responsive.srcSet} sizes={sizes} />}
        <img src={src} alt={alt} sizes={sizes} loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async" onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={`optimized-image__img ${isLoaded ? 'optimized-image__img--loaded' : ''}`}
          width={nativeWidth} height={nativeHeight} {...props} />
      </picture>
      {!isLoaded && (
        <div className="optimized-image__loading" role="status" aria-label="Image loading">
          <div className="loading-spinner" aria-hidden="true" />
          <span className="sr-only">Loading image</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
