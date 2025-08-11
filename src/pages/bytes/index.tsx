import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterBytes, fetchBytes } from '../../store/slices/bytesSlice';
import ByteCard from '../../components/global/byteCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.css';
import Hero from '../../components/global/Hero';
import { CenterTitle } from '../../components/global/Titles';

const Bytes = () => {
  const dispatch = useAppDispatch();
  const { bytes, filteredBytes, activeTag } = useAppSelector(state => state.bytes);
  const [tags, setTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const tagSet = new Set<string>();
    bytes.forEach(byte => {
      // byte.tags.forEach(tag => tagSet.add(tag)); // this gets all tags

      if (byte.tags.length > 0) {
        tagSet.add(byte.tags[0]); // Use the first tag to keep list shorter
      }
    });
    setTags(Array.from(tagSet).sort());
  }, [bytes]);

  useEffect(() => {
    dispatch(fetchBytes()).then(() => {
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
    ? filteredBytes.filter(
        byte =>
          byte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          byte.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          byte.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredBytes;

  return (
    <div className="bytes" role="main" aria-labelledby="bytes-heading">
      <Hero 
        heroTitle="Bytes"
        heroSubtitle="Insights, tutorials, and thoughts on web development"
        heroImage="/assets/images/projects-bg.jpg"
      />

      <section className="bytes-content">
        <div className="section-container">
          {/* Search and Filters */}
          <motion.div
            className="bytes-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            role="search"
            aria-label="Search and filter bytes"
          >
            <div className="bytes-filters__search">
              <label htmlFor="bytes-search" className="sr-only">
                Search bytes
              </label>
              <input
                id="bytes-search"
                type="text"
                placeholder="Search bytes..."
                className="bytes-filters__search-input"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search bytes by title, excerpt, or tag"
              />
            </div>

            <div className="bytes-filters__tags" role="navigation" aria-label="Filter bytes by tag">
              <h2 id="filter-heading" className="bytes-filters__title">
                Filter by tag:
              </h2>
              <div className="bytes-filters__buttons" role="group" aria-labelledby="filter-heading">
                <button
                  className={`bytes-filters__button ${activeTag === null ? 'bytes-filters__button--active' : ''}`}
                  onClick={() => handleTagFilter(null)}
                  aria-pressed={activeTag === null}
                  aria-label="Show all bytes"
                >
                  All
                </button>

                {tags.map(tag => (
                  <button
                    key={tag}
                    className={`bytes-filters__button ${activeTag === tag ? 'bytes-filters__button--active' : ''}`}
                    onClick={() => handleTagFilter(tag)}
                    aria-pressed={activeTag === tag}
                    aria-label={`Filter by ${tag} tag`}
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
                role="status"
                aria-live="polite"
              >
                <p className="bytes-empty__message">
                  {searchTerm
                    ? `No bytes found matching "${searchTerm}"`
                    : 'No bytes found with the selected tag.'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    handleTagFilter(null);
                    setSearchTerm('');
                  }}
                  aria-label="Reset filters and show all bytes"
                >
                  Show All Bytes
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="bytes-topics" aria-labelledby="topics-heading">
        <div className="section-container">
          <CenterTitle>
            Topics I Write About
          </CenterTitle>

          <div className="bytes-topics__grid" role="list" aria-label="Topic categories">
            <motion.div
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              role="listitem"
              aria-labelledby="topic-react"
            >
              <div
                className="bytes-topics__icon bytes-topics__icon--react"
                aria-hidden="true"
              ></div>
              <h3 id="topic-react" className="bytes-topics__title">
                Languages & Frontend
              </h3>
              <p className="bytes-topics__description">
                Modern React, Next and Python development, and frontend best practices.
              </p>
            </motion.div>

            <motion.div
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              role="listitem"
              aria-labelledby="topic-typescript"
            >
              <div
                className="bytes-topics__icon bytes-topics__icon--typescript"
                aria-hidden="true"
              ></div>
              <h3 id="topic-typescript" className="bytes-topics__title">
                Leadership
              </h3>
              <p className="bytes-topics__description">
                Leader tips, advanced techniques to keeping your team fresh and up on training.
              </p>
            </motion.div>

            <motion.div
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              role="listitem"
              aria-labelledby="topic-performance"
            >
              <div
                className="bytes-topics__icon bytes-topics__icon--performance"
                aria-hidden="true"
              >
                <span className="fa-icon"><i className="fa-solid fa-gauge-high"></i></span>
              </div>
              <h3 id="topic-performance" className="bytes-topics__title">
                Web Performance
              </h3>
              <p className="bytes-topics__description">
                Optimization techniques, performance metrics, and tools to make your web apps
                faster.
              </p>
            </motion.div>

            <motion.div
              className="bytes-topics__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              role="listitem"
              aria-labelledby="topic-architecture"
            >
              <div
                className="bytes-topics__icon bytes-topics__icon--architecture"
                aria-hidden="true"
              >
                <span className="fa-icon"><i className="fa-solid fa-building"></i></span>
              </div>
              <h3 id="topic-architecture" className="bytes-topics__title">
                Architecture
              </h3>
              <p className="bytes-topics__description">
                Application architecture, design patterns, and structuring scalable web
                applications.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bytes;
