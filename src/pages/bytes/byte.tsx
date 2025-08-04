import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { Byte, fetchBytes } from '../../store/slices/bytesSlice';
import SEO from '../../components/global/SEO';
import { getByteSchema } from '../../utils/schema';
import { fadeInUp } from '../../utils/animations';
import './styles.scss';

const BytePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { bytes, isLoading: isBytesLoading } = useAppSelector((state) => state.bytes);
  const [byte, setByte] = useState<Byte | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bytes if they're not already loaded
  useEffect(() => {
    if (bytes.length === 0) {
      dispatch(fetchBytes());
    }
  }, [dispatch, bytes.length]);

  useEffect(() => {
    // Only proceed if bytes are loaded or loading has completed
    if (bytes.length > 0 || !isBytesLoading) {
      const foundByte = bytes.find((a) => a.slug === slug);
      
      if (foundByte) {
        setByte(foundByte);
        setIsLoading(false);
      } else {
        if (bytes.length > 0) {
          // Try to find a close match
          const closeMatch = bytes.find(a => 
            a.slug.includes(slug || '') || (slug || '').includes(a.slug)
          );
          
          if (closeMatch) {
            setByte(closeMatch);
            setIsLoading(false);
          } else {
            // No match found, navigate back to bytes list
            navigate('/bytes');
          }
        }
      }
    }
  }, [bytes, slug, navigate, isBytesLoading]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="byte-page" role="region" aria-label="Loading byte content">
        <div className="section-container">
          <div className="byte-page__loading">
            <p aria-live="polite">Loading byte...</p>
            <div className="loading-spinner" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!byte) {
    return (
      <div className="byte-page" role="region" aria-label="Byte not found">
        <div className="section-container">
          <div className="byte-page__not-found">
            <h1>Byte Not Found</h1>
            <p>The byte you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/bytes')}
              aria-label="Return to bytes listing page"
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
    <div className="byte-page">
      <SEO 
        title={byte.title}
        description={byte.excerpt || `${byte.title} - Read this byte by ${byte.author}`}
        canonical={`/bytes/${byte.slug}`}
        type="byte"
        image={byte.imageUrl}
        byte={{
          publishedTime: byte.date,
          author: byte.author,
          tags: byte.tags
        }}
        schema={byteSchema}
      />
      <section className="byte-page__hero">
        <div className="byte-page__hero-container">
          <motion.h1 
            id="byte-title"
            className="byte-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {byte.title}
          </motion.h1>
          
          <motion.div 
            className="byte-page__meta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            aria-label="Article metadata"
          >
            <div className="byte-page__author-date">
              <span className="byte-page__author" aria-label="Author">{byte.author}</span>
              <span className="byte-page__date" aria-label="Publication date">{formatDate(byte.date)}</span>
            </div>
            <span className="byte-page__reading-time" aria-label="Estimated reading time">{byte.readingTime} min read</span>
          </motion.div>
          
          <motion.div 
            className="byte-page__tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            role="list"
            aria-label="Article tags"
          >
            {byte.tags.map((tag, i) => (
              <span 
                key={i} 
                className="byte-page__tag"
                role="listitem"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="byte-page__content" role="article" aria-labelledby="byte-title">
        <div className="section-container">
          {byte.imageUrl && (
            <motion.div 
              className="byte-page__image-container"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <img 
                src={byte.imageUrl} 
                alt={`Featured image for article: ${byte.title}`} 
                className="byte-page__image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Add an aria-hidden element to indicate the image failed to load
                  const parent = target.parentElement;
                  if (parent) {
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'Image failed to load';
                    errorMessage.className = 'image-error';
                    errorMessage.setAttribute('aria-live', 'polite');
                    parent.appendChild(errorMessage);
                  }
                }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="byte-page__body markdown-content prose prose-invert max-w-none"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              // Security: Disable HTML to prevent XSS attacks
              disallowedElements={['script']}
              unwrapDisallowed={true}
              components={{
                code({className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  
                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                  
                  const language = match ? match[1] : '';
                  const code = String(children).replace(/\n$/, '');
                  
                  return (
                    <Highlight
                      theme={themes.nightOwl}
                      code={code}
                      language={language || 'typescript'}
                    >
                      {({className, style, tokens, getLineProps, getTokenProps}) => (
                        <pre className={className} style={{...style, padding: '1em', borderRadius: '0.5em', overflow: 'auto'}}>
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({line, key: i})}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({token, key})} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  );
                },
                // Security: Ensure links open in new tab with security attributes
                a: ({...props}) => (
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    {...props}
                  />
                )
              }}
            >
              {Array.isArray(byte.content) ? byte.content.join('\n') : byte.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </section>
      
      
      {/* Back to Bytes Button */}
      <section className="byte-page__footer" role="navigation" aria-label="Byte navigation">
        <div className="section-container">
          <motion.div 
            className="byte-page__navigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/bytes')}
              aria-label="Return to bytes listing page"
            >
              Back to Bytes
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BytePage;
