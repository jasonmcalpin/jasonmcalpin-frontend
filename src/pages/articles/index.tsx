import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterArticles } from '../../store/slices/articlesSlice';
import ArticleCard from '../../components/shared/articleCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.scss';

const Articles = () => {
  const dispatch = useAppDispatch();
  const { articles, filteredArticles, activeTag } = useAppSelector((state) => state.articles);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique tags from articles
  useEffect(() => {
    const tagSet = new Set<string>();
    articles.forEach(article => {
      article.tags.forEach(tag => tagSet.add(tag));
    });
    setTags(Array.from(tagSet).sort());
  }, [articles]);
  
  // Initialize with all articles
  useEffect(() => {
    dispatch(filterArticles(null));
  }, [dispatch]);
  
  // Handle tag filter change
  const handleTagFilter = (tag: string | null) => {
    dispatch(filterArticles(tag));
    setSearchTerm('');
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset tag filter when searching
    if (activeTag) {
      dispatch(filterArticles(null));
    }
  };
  
  // Filter articles by search term
  const searchFilteredArticles = searchTerm 
    ? filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredArticles;

  return (
    <div className="articles">
      {/* Hero Section */}
      <section className="articles-hero">
        <div className="articles-hero__container">
          <h1 className="articles-hero__title">Articles</h1>
          <p className="articles-hero__subtitle">
            Insights, tutorials, and thoughts on web development
          </p>
        </div>
      </section>
      
      {/* Articles Content */}
      <section className="articles-content">
        <div className="section-container">
          {/* Search and Filters */}
          <motion.div 
            className="articles-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="articles-filters__search">
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="articles-filters__search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="articles-filters__tags">
              <h2 className="articles-filters__title">Filter by tag:</h2>
              <div className="articles-filters__buttons">
                <button 
                  className={`articles-filters__button ${activeTag === null ? 'articles-filters__button--active' : ''}`}
                  onClick={() => handleTagFilter(null)}
                >
                  All
                </button>
                
                {tags.map((tag) => (
                  <button 
                    key={tag}
                    className={`articles-filters__button ${activeTag === tag ? 'articles-filters__button--active' : ''}`}
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Articles Grid */}
          <motion.div 
            className="articles-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {searchFilteredArticles.length > 0 ? (
              searchFilteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))
            ) : (
              <motion.div 
                className="articles-empty"
                variants={fadeInUp}
              >
                <p className="articles-empty__message">
                  {searchTerm 
                    ? `No articles found matching "${searchTerm}"`
                    : 'No articles found with the selected tag.'
                  }
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleTagFilter(null);
                    setSearchTerm('');
                  }}
                >
                  Show All Articles
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="articles-newsletter">
        <div className="section-container">
          <motion.div 
            className="articles-newsletter__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="articles-newsletter__title">Stay Updated</h2>
            <p className="articles-newsletter__text">
              Subscribe to my newsletter to receive updates on new articles, projects, and more.
            </p>
            
            <form className="articles-newsletter__form">
              <div className="articles-newsletter__input-group">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="articles-newsletter__input"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="articles-newsletter__button">
                  Subscribe
                </button>
              </div>
              <p className="articles-newsletter__disclaimer">
                I respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      
      {/* Topics Section */}
      <section className="articles-topics">
        <div className="section-container">
          <motion.h2 
            className="section-title text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Topics I Write About
          </motion.h2>
          
          <div className="articles-topics__grid">
            <motion.div 
              className="articles-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="articles-topics__icon articles-topics__icon--react"></div>
              <h3 className="articles-topics__title">React & Frontend</h3>
              <p className="articles-topics__description">
                Modern React development, hooks, state management, and frontend best practices.
              </p>
            </motion.div>
            
            <motion.div 
              className="articles-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="articles-topics__icon articles-topics__icon--typescript"></div>
              <h3 className="articles-topics__title">TypeScript</h3>
              <p className="articles-topics__description">
                TypeScript tips, advanced types, and how to leverage TypeScript in your projects.
              </p>
            </motion.div>
            
            <motion.div 
              className="articles-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="articles-topics__icon articles-topics__icon--performance"></div>
              <h3 className="articles-topics__title">Web Performance</h3>
              <p className="articles-topics__description">
                Optimization techniques, performance metrics, and tools to make your web apps faster.
              </p>
            </motion.div>
            
            <motion.div 
              className="articles-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="articles-topics__icon articles-topics__icon--architecture"></div>
              <h3 className="articles-topics__title">Architecture</h3>
              <p className="articles-topics__description">
                Application architecture, design patterns, and structuring scalable web applications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Articles;
