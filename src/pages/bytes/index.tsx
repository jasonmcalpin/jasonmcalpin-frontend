import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterBytes, fetchBytes } from '../../store/slices/bytesSlice';
import ByteCard from '../../components/shared/byteCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.scss';

const Bytes = () => {
  const dispatch = useAppDispatch();
  const { bytes, filteredBytes, activeTag } = useAppSelector((state) => state.bytes);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const tagSet = new Set<string>();
    bytes.forEach(byte => {
      byte.tags.forEach(tag => tagSet.add(tag));
    });
    setTags(Array.from(tagSet).sort());
  }, [bytes]);
  
  useEffect(() => {
    dispatch(fetchBytes())
      .then(() => {
        dispatch(filterBytes(null));
      });
  }, [dispatch]);
  
  // Handle tag filter change
  const handleTagFilter = (tag: string | null) => {
    dispatch(filterBytes(tag));
    setSearchTerm('');
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Reset tag filter when searching
    if (activeTag) {
      dispatch(filterBytes(null));
    }
  };
  
  const searchFilteredBytes = searchTerm 
    ? filteredBytes.filter(byte => 
        byte.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        byte.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        byte.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredBytes;

  return (
    <div className="bytes">
      <section className="bytes-hero">
        <div className="bytes-hero__container">
          <h1 className="bytes-hero__title">Bytes</h1>
          <p className="bytes-hero__subtitle">
            Insights, tutorials, and thoughts on web development
          </p>
        </div>
      </section>
      
      <section className="bytes-content">
        <div className="section-container">
          {/* Search and Filters */}
          <motion.div 
            className="bytes-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bytes-filters__search">
              <input 
                type="text" 
                placeholder="Search bytes..." 
                className="bytes-filters__search-input"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="bytes-filters__tags">
              <h2 className="bytes-filters__title">Filter by tag:</h2>
              <div className="bytes-filters__buttons">
                <button 
                  className={`bytes-filters__button ${activeTag === null ? 'bytes-filters__button--active' : ''}`}
                  onClick={() => handleTagFilter(null)}
                >
                  All
                </button>
                
                {tags.map((tag) => (
                  <button 
                    key={tag}
                    className={`bytes-filters__button ${activeTag === tag ? 'bytes-filters__button--active' : ''}`}
                    onClick={() => handleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Bytes Grid */}
          <motion.div 
            className="bytes-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {searchFilteredBytes.length > 0 ? (
              searchFilteredBytes.map((byte, index) => (
                <ByteCard key={byte.id} byte={byte} index={index} />
              ))
            ) : (
              <motion.div 
                className="bytes-empty"
                variants={fadeInUp}
              >
                <p className="bytes-empty__message">
                  {searchTerm 
                    ? `No bytes found matching "${searchTerm}"`
                    : 'No bytes found with the selected tag.'
                  }
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleTagFilter(null);
                    setSearchTerm('');
                  }}
                >
                  Show All Bytes
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bytes-newsletter">
        <div className="section-container">
          <motion.div 
            className="bytes-newsletter__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="bytes-newsletter__title">Stay Updated</h2>
            <p className="bytes-newsletter__text">
              Subscribe to my newsletter to receive updates on new bytes, projects, and more.
            </p>
            
            <form className="bytes-newsletter__form">
              <div className="bytes-newsletter__input-group">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bytes-newsletter__input"
                  aria-label="Email address"
                  required
                />
                <button type="submit" className="bytes-newsletter__button">
                  Subscribe
                </button>
              </div>
              <p className="bytes-newsletter__disclaimer">
                I respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
      
      {/* Topics Section */}
      <section className="bytes-topics">
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
          
          <div className="bytes-topics__grid">
            <motion.div 
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bytes-topics__icon bytes-topics__icon--react"></div>
              <h3 className="bytes-topics__title">React & Frontend</h3>
              <p className="bytes-topics__description">
                Modern React development, hooks, state management, and frontend best practices.
              </p>
            </motion.div>
            
            <motion.div 
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bytes-topics__icon bytes-topics__icon--typescript"></div>
              <h3 className="bytes-topics__title">TypeScript</h3>
              <p className="bytes-topics__description">
                TypeScript tips, advanced types, and how to leverage TypeScript in your projects.
              </p>
            </motion.div>
            
            <motion.div 
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bytes-topics__icon bytes-topics__icon--performance"></div>
              <h3 className="bytes-topics__title">Web Performance</h3>
              <p className="bytes-topics__description">
                Optimization techniques, performance metrics, and tools to make your web apps faster.
              </p>
            </motion.div>
            
            <motion.div 
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bytes-topics__icon bytes-topics__icon--architecture"></div>
              <h3 className="bytes-topics__title">Architecture</h3>
              <p className="bytes-topics__description">
                Application architecture, design patterns, and structuring scalable web applications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bytes;
