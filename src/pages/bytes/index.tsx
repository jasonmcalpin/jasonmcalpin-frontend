import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterBytes, fetchBytes, selectFilteredBytes } from '../../store/slices/bytesSlice';
import ByteCard from '../../components/global/byteCard';
import SEO from '../../components/global/SEO';
import './styles.css';

export default function Bytes() {
  const dispatch = useAppDispatch();
  const { bytes, activeTag, isLoading, error } = useAppSelector(state => state.bytes);
  const filteredBytes = useAppSelector(selectFilteredBytes);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => { dispatch(fetchBytes()); }, [dispatch]);
  const tags = useMemo(() => [...new Set(bytes.flatMap(byte => byte.tags.slice(0, 1)))].sort(), [bytes]);
  const handleTagFilter = (tag: string | null) => {
    dispatch(filterBytes(tag));
    setSearchTerm('');
  };
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (activeTag) dispatch(filterBytes(null));
  };
  const query = searchTerm.trim().toLowerCase();
  const visible = query ? filteredBytes.filter(byte =>
    byte.title.toLowerCase().includes(query) ||
    byte.excerpt.toLowerCase().includes(query) ||
    byte.tags.some(tag => tag.toLowerCase().includes(query))) : filteredBytes;

  return (
    <div className="consulting-page consulting-inner-page bytes" aria-labelledby="bytes-heading">
      <SEO title="Bytes — Engineering Notes" description="Thoughts on software engineering, architecture, practical AI, performance and technology delivery." canonical="/bytes" />
      <header className="consulting-page-intro consulting-container">
        <p className="consulting-eyebrow">Engineering / Ideas / Experiments</p>
        <h1 id="bytes-heading">Bytes.</h1>
        <p className="consulting-lead">Writing about the problems, patterns and trade-offs that come up when building and maintaining real software.</p>
      </header>
      <section className="consulting-section consulting-section--subtle" aria-label="Articles">
        <div className="consulting-container">
          <div className="consulting-writing-controls">
            <label htmlFor="bytes-search">Search articles</label>
            <input id="bytes-search" type="search" placeholder="Search by title, topic or keyword" value={searchTerm}
              onChange={handleSearch} aria-label="Search articles by title, excerpt or tag" />
            <div className="consulting-filters" role="group" aria-label="Filter articles by topic">
              <button type="button" aria-pressed={activeTag === null} className={activeTag === null ? 'is-active' : ''} onClick={() => handleTagFilter(null)}>All topics</button>
              {tags.map(tag => <button type="button" key={tag} aria-pressed={activeTag === tag}
                className={activeTag === tag ? 'is-active' : ''} onClick={() => handleTagFilter(tag)}>{tag}</button>)}
            </div>
          </div>
          {isLoading && bytes.length === 0 ? <p role="status">Loading articles…</p> : error ?
            <div role="alert"><p>Unable to load articles.</p><button type="button" className="consulting-button consulting-button--outline" onClick={() => dispatch(fetchBytes())}>Retry</button></div> :
            visible.length > 0 ? <div className="consulting-writing-grid">{visible.map(byte => <ByteCard key={byte.id} byte={byte} index={0} />)}</div> :
            <div role="status"><p>No articles match that search.</p><button type="button" className="consulting-button consulting-button--outline" onClick={() => { setSearchTerm(''); handleTagFilter(null); }}>Clear filters</button></div>}
        </div>
      </section>
    </div>
  );
}
