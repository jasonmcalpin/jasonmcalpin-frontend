import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { fetchBytes } from '../../store/slices/bytesSlice';
import SEO from '../../components/global/SEO';
import { getByteSchema } from '../../utils/schema';
import OptimizedImage from '../../components/global/OptimizedImage';
import './styles.css';

const BytePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bytes, isLoading, hasLoaded, error } = useAppSelector(state => state.bytes);
  const byte = bytes.find(item => item.slug === slug);

  const articleSlug = byte?.slug;
  const [compiled, setCompiled] = useState<{ slug: string; html: string } | null>(null);
  const [htmlError, setHtmlError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  // The trusted HTML fragment is compiled by our build pipeline from JSON
  // Markdown. Never accept HTML from an arbitrary endpoint or user input.
  useEffect(() => {
    if (!articleSlug) return;
    const controller = new AbortController();
    setHtmlError(null);
    fetch('/data/byte-html/' + articleSlug + '.html', { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const html = await response.text();
        if (!html.trim()) throw new Error('Empty article HTML');
        if (!controller.signal.aborted) setCompiled({ slug: articleSlug, html });
      })
      .catch(error => {
        if (!controller.signal.aborted)
          setHtmlError(error instanceof Error ? error.message : String(error));
      });
    return () => controller.abort();
  }, [articleSlug, retry]);

  useEffect(() => {
    if (!hasLoaded && !isLoading && !error) dispatch(fetchBytes());
  }, [dispatch, hasLoaded, isLoading, error]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!hasLoaded && !error) {
    return (
      <div className='byte-page' role='region' aria-label='Loading byte content'>
        <div className='section-container'>
          <div className='byte-page__loading'>
            <p aria-live='polite'>Loading byte...</p>
            <div className='loading-spinner' aria-hidden='true'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='byte-page'><div className='section-container' role='alert'>
      <h1>Unable to load bytes</h1><p>{error}</p>
      <button className='btn btn-primary' onClick={() => dispatch(fetchBytes())}>Retry</button>
    </div></div>;
  }

  if (!byte) {
    return (
      <div className='byte-page' role='region' aria-label='Byte not found'>
        <div className='section-container'>
          <div className='byte-page__not-found'>
            <h1>Byte Not Found</h1>
            <p>The byte you're looking for doesn't exist or has been removed.</p>
            <button 
              className='btn btn-primary'
              onClick={() => navigate('/bytes')}
              aria-label='Return to bytes listing page'
            >
              Back to Bytes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const byteSchema = getByteSchema({
    title: byte.title,
    description: byte.excerpt || byte.title,
    slug: byte.slug,
    date: byte.date,
    author: byte.author,
    imageUrl: byte.imageUrl || '/assets/images/placeholder.svg'
  });

  return (
    <div className='byte-page'>
      <SEO 
        title={byte.title}
        description={byte.excerpt || `${byte.title} - Read this byte by ${byte.author}`}
        canonical={`/bytes/${byte.slug}`}
        type='byte'
        image={byte.imageUrl}
        byte={{
          publishedTime: byte.date,
          author: byte.author,
          tags: byte.tags
        }}
        schema={byteSchema}
      />
      <section className='byte-page__hero'>
        <div className='byte-page__hero-container'>
          <h1 
            id='byte-title'
            className='byte-page__title'
            
            
            
           data-reveal="viewport">
            {byte.title}
          </h1>
          
          <div 
            className='byte-page__meta'
            
            
            
            aria-label='Article metadata'
           data-reveal="viewport">
            <div className='byte-page__author-date'>
              <span className='byte-page__author' aria-label='Author'>{byte.author}</span>
              <span className='byte-page__date' aria-label='Publication date'>{formatDate(byte.date)}</span>
            </div>
            <span className='byte-page__reading-time' aria-label='Estimated reading time'>{byte.readingTime} min read</span>
          </div>
          
          <div 
            className='byte-page__tags'
            
            
            
            role='list'
            aria-label='Article tags'
           data-reveal="viewport">
            {byte.tags.map((tag, i) => (
              <span 
                key={i} 
                className='byte-page__tag'
                role='listitem'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      <section className='byte-page__content' role='article' aria-labelledby='byte-title'>
        <div className='section-container'>
          {byte.imageUrl && (
            <div 
              className='byte-page__image-container'
              
              
              
             data-reveal="viewport">
              <OptimizedImage src={byte.imageUrl} alt={`Featured image for article: ${byte.title}`}
                  className="byte-page__image w-full" sizes="(max-width: 768px) 100vw, 1000px" />
            </div>
          )}
          
          <div 
            className='byte-page__body markdown-content prose prose-invert max-w-none'
            
            
            
            
           data-reveal="viewport">
            {htmlError ? (
              <div role="alert">
                <p>Unable to load article content: {htmlError}</p>
                <button className="btn btn-primary" onClick={() => setRetry(value => value + 1)}>
                  Retry
                </button>
              </div>
            ) : compiled?.slug === byte.slug ? (
              // Safe boundary: source is generated, not arbitrary HTML.
              <div dangerouslySetInnerHTML={{ __html: compiled.html }} />
            ) : (
              <p role="status" aria-live="polite">Loading article content...</p>
            )}
          </div>
        </div>
      </section>
      
      
      {/* Back to Bytes Button */}
      <section className='byte-page__footer' role='navigation' aria-label='Byte navigation'>
        <div className='section-container'>
          <div 
            className='byte-page__navigation'
            
            
            
           data-reveal="viewport">
            <button 
              className='btn btn-primary'
              onClick={() => navigate('/bytes')}
              aria-label='Return to bytes listing page'
            >
              Back to Bytes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BytePage;
