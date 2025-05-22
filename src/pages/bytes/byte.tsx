import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

// Register languages
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('json', json);
import { useAppSelector } from '../../hooks/useAppStore';
import { Byte } from '../../store/slices/bytesSlice';
import SEO from '../../components/shared/SEO';
import { getByteSchema } from '../../utils/schema';
import { fadeInUp } from '../../utils/animations';
import './styles.scss';

const BytePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { bytes } = useAppSelector((state) => state.bytes);
  const [byte, setByte] = useState<Byte | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundByte = bytes.find((a) => a.slug === slug);
    
    if (foundByte) {
      setByte(foundByte);
      setIsLoading(false);
    } else {
      if (bytes.length > 0) {
        navigate('/bytes');
        
        // Try to find a close match
        const closeMatch = bytes.find(a => 
          a.slug.includes(slug || '') || (slug || '').includes(a.slug)
        );
        if (closeMatch) {
          setByte(closeMatch);
          setIsLoading(false);
        }
      }
    }
  }, [bytes, slug, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="byte-page">
        <div className="section-container">
          <div className="byte-page__loading">
            <p>Loading byte...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!byte) {
    return (
      <div className="byte-page">
        <div className="section-container">
          <div className="byte-page__not-found">
            <h1>Byte Not Found</h1>
            <p>The byte you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/bytes')}
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
          >
            <div className="byte-page__author-date">
              <span className="byte-page__author">{byte.author}</span>
              <span className="byte-page__date">{formatDate(byte.date)}</span>
            </div>
            <span className="byte-page__reading-time">{byte.readingTime} min read</span>
          </motion.div>
          
          <motion.div 
            className="byte-page__tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {byte.tags.map((tag, i) => (
              <span key={i} className="byte-page__tag">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="byte-page__content">
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
                alt={byte.title} 
                className="byte-page__image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
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
              components={{
                code({className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return !isInline ? (
                    <SyntaxHighlighter
                      // @ts-expect-error - Known issue with type definitions
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {Array.isArray(byte.content) ? byte.content.join('\n') : byte.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </section>
      
      
      {/* Back to Bytes Button */}
      <section className="byte-page__footer">
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
