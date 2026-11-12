import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/global/SEO';
import OptimizedImage from '../../components/global/OptimizedImage';
import { getWebsiteSchema } from '../../utils/schema';
import './styles.css';

// A real module boundary: cards, content fetching, and secondary page sections
// do not enter the homepage's critical Vite chunk until they approach view.
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
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px', threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinel} className="home-deferred-boundary">
      {nearViewport ? (
        <Suspense fallback={<div className="home-deferred-placeholder" aria-hidden="true" />}>
          <HomeBelowFold />
        </Suspense>
      ) : (
        <div className="home-deferred-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}

const Home = () => {

  return (
    <div className="home pt-16">
      <SEO
        title="Home"
        description="Jason McAlpin is a Full Stack Developer specializing in React, TypeScript, and modern web technologies. Explore my portfolio of projects and bytes."
        canonical="/"
        schema={getWebsiteSchema()}
      />
      {/* Hero Section */}
      <section 
        className="hero min-h-screen flex flex-col md:flex-row items-center justify-center px-4 py-16"
        
        
        
        
       data-reveal="viewport">
        <div className="hero__content w-full md:w-1/2 mb-12 md:mb-0 md:pr-8 md:ml-auto md:max-w-[40rem]">
          <h1 className="hero__title text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6"  data-reveal="viewport">
            <span className="hero__title-line block mb-2">Hi, I'm</span>
            <span className="hero__title-line neon-text block mb-2">Jason McAlpin</span>
            <span className="hero__title-line block mb-2">Full Stack Developer</span>
          </h1>
          
          <p className="hero__subtitle text-xl text-gray-300 mb-8 max-w-lg"  data-reveal="viewport">
            Building modern web experiences with cutting-edge technologies
          </p>
          
          <div className="hero__cta flex flex-wrap gap-4"  data-reveal="viewport">
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </div>
        </div>
        
        <div 
          className="hero__visual w-full md:w-1/2 flex justify-center items-center"
          
          
         data-reveal="scale">
          <div className="hero__grid grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary">
              <OptimizedImage src="/assets/images/code.jpg" alt="" sizes="(max-width: 767px) 45vw, 240px"
                className="w-full h-full" aria-hidden="true" priority />
            </div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary">
              <OptimizedImage src="/assets/images/design.jpg" alt="" sizes="(max-width: 767px) 45vw, 240px"
                className="w-full h-full" aria-hidden="true" priority />
            </div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary">
              <OptimizedImage src="/assets/images/mobile.jpg" alt="" sizes="(max-width: 767px) 45vw, 240px"
                className="w-full h-full" aria-hidden="true" priority />
            </div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary">
              <OptimizedImage src="/assets/images/web.jpg" alt="" sizes="(max-width: 767px) 45vw, 240px"
                className="w-full h-full" aria-hidden="true" priority />
            </div>
          </div>
        </div>
      </section>
      

      <DeferredHomepageContent />
    </div>
  );
};

export default Home;
