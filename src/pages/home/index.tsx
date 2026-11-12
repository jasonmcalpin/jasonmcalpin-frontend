import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/global/SEO';
import { getWebsiteSchema } from '../../utils/schema';
import consulting from '../../../public/data/consulting.json';
import './styles.css';

const HomeBelowFold = lazy(() => import('./HomeBelowFold'));

function DeferredHomepageContent() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '900px 0px', threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={sentinel} className="home-deferred-boundary">
      {nearViewport ? (
        <Suspense fallback={<div className="home-deferred-placeholder" aria-hidden="true" />}>
          <HomeBelowFold />
        </Suspense>
      ) : <div className="home-deferred-placeholder" aria-hidden="true" />}
    </div>
  );
}

export default function Home() {
  return (
    <div className="home consulting-page">
      <SEO title="Independent Software Engineering & Consulting"
        description={consulting.identity.summary} canonical="/" schema={getWebsiteSchema()} />
      <section className="consulting-hero" aria-labelledby="home-title">
        <div className="consulting-container consulting-hero__layout">
          <div>
            <p className="consulting-eyebrow">Independent software engineering · Atlanta / Remote</p>
            <h1 id="home-title" className="consulting-hero__title">{consulting.identity.headline}</h1>
            <p className="consulting-lead">{consulting.identity.summary}</p>
            <div className="consulting-actions">
              <Link to="/contact" className="consulting-button consulting-button--primary">Discuss your project</Link>
              <Link to="/projects" className="consulting-button consulting-button--outline">See selected work</Link>
            </div>
            <p className="consulting-small">Direct access to the engineer doing the work · {consulting.identity.experience}</p>
          </div>
          <aside className="consulting-hero__aside" aria-label="Practice focus">
            <p className="consulting-eyebrow">The problems I work on</p>
            <ol className="consulting-focus-list">
              <li><span>01</span><strong>Legacy systems holding you back</strong><p>Migration, data access and maintainability.</p></li>
              <li><span>02</span><strong>AI that needs to work in practice</strong><p>Integrations, tools, evaluations and execution contracts.</p></li>
              <li><span>03</span><strong>Software that's expensive to operate</strong><p>Performance, reliability and technical modernization.</p></li>
            </ol>
          </aside>
        </div>
      </section>
      <DeferredHomepageContent />
    </div>
  );
}
