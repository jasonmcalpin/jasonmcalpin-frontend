import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppSelector } from '../../hooks/useAppStore';
import { Article } from '../../store/slices/articlesSlice';
import { fadeInUp } from '../../utils/animations';
import './styles.scss';

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { articles } = useAppSelector((state) => state.articles);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the article with the matching slug
    const foundArticle = articles.find((a) => a.slug === slug);
    
    if (foundArticle) {
      setArticle(foundArticle);
      setIsLoading(false);
    } else {
      // If no article is found, redirect to the articles page
      if (articles.length > 0) {
        navigate('/articles');
        
        // Try to find a close match
        const closeMatch = articles.find(a => 
          a.slug.includes(slug || '') || (slug || '').includes(a.slug)
        );
        if (closeMatch) {
          setArticle(closeMatch);
          setIsLoading(false);
        }
      }
    }
  }, [articles, slug, navigate]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="article-page">
        <div className="section-container">
          <div className="article-page__loading">
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page">
        <div className="section-container">
          <div className="article-page__not-found">
            <h1>Article Not Found</h1>
            <p>The article you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/articles')}
            >
              Back to Articles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      {/* Article Hero */}
      <section className="article-page__hero">
        <div className="article-page__hero-container">
          <motion.h1 
            className="article-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {article.title}
          </motion.h1>
          
          <motion.div 
            className="article-page__meta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="article-page__author-date">
              <span className="article-page__author">{article.author}</span>
              <span className="article-page__date">{formatDate(article.date)}</span>
            </div>
            <span className="article-page__reading-time">{article.readingTime} min read</span>
          </motion.div>
          
          <motion.div 
            className="article-page__tags"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {article.tags.map((tag, i) => (
              <span key={i} className="article-page__tag">
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Article Content */}
      <section className="article-page__content">
        <div className="section-container">
          {article.imageUrl && (
            <motion.div 
              className="article-page__image-container"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="article-page__image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="article-page__body markdown-content prose prose-invert max-w-none"
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
              {Array.isArray(article.content) ? article.content.join('\n') : article.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </section>
      
      {/* Related Articles Section - This could be implemented in the future */}
      
      {/* Back to Articles Button */}
      <section className="article-page__footer">
        <div className="section-container">
          <motion.div 
            className="article-page__navigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/articles')}
            >
              Back to Articles
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ArticlePage;
