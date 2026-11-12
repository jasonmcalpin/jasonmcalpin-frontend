import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/global/SEO';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
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
  const [heroRef, heroControls] = useScrollAnimation();

  return (
    <div className="home pt-16">
      <SEO
        title="Home"
        description="Jason McAlpin is a Full Stack Developer specializing in React, TypeScript, and modern web technologies. Explore my portfolio of projects and bytes."
        canonical="/"
        schema={getWebsiteSchema()}
      />
      {/* Hero Section */}
      <motion.section 
        className="hero min-h-screen flex flex-col md:flex-row items-center justify-center px-4 py-16"
        ref={heroRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={heroControls}
        variants={staggerContainer}
      >
        <div className="hero__content w-full md:w-1/2 mb-12 md:mb-0 md:pr-8 md:ml-auto md:max-w-[40rem]">
          <motion.h1 className="hero__title text-4xl sm:text-5xl md:text-6xl font-heading font-bold mb-6" variants={fadeInUp}>
            <span className="hero__title-line block mb-2">Hi, I'm</span>
            <span className="hero__title-line neon-text block mb-2">Jason McAlpin</span>
            <span className="hero__title-line block mb-2">Full Stack Developer</span>
          </motion.h1>
          
          <motion.p className="hero__subtitle text-xl text-gray-300 mb-8 max-w-lg" variants={fadeInUp}>
            Building modern web experiences with cutting-edge technologies
          </motion.p>
          
          <motion.div className="hero__cta flex flex-wrap gap-4" variants={fadeInUp}>
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero__visual w-full md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, delay: 0.2 }
          }}
        >
          <div className="hero__grid grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary bg-cover bg-center hero__grid-item--1"></div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary bg-cover bg-center hero__grid-item--2"></div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary bg-cover bg-center hero__grid-item--3"></div>
            <div className="hero__grid-item h-32 rounded-lg relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/40 bg-primary bg-cover bg-center hero__grid-item--4"></div>
          </div>
        </motion.div>
      </motion.section>
      

      <DeferredHomepageContent />
    </div>
  );
};

export default Home;
