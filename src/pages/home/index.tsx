import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterProjects, fetchProjects } from '../../store/slices/projectsSlice';
import { filterBytes, fetchBytes } from '../../store/slices/bytesSlice';
import ProjectCard from '../../components/global/projectCard';
import ByteCard from '../../components/global/byteCard';
import SEO from '../../components/global/SEO';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { getWebsiteSchema } from '../../utils/schema';
import { MotionTitle, LinkTitle } from '../../components/global/Titles';
import './styles.css';

const Home = () => {
  // SEO data
  const seoDescription = "Jason McAlpin is a Full Stack Developer specializing in React, TypeScript, and modern web technologies. Explore my portfolio of projects and bytes.";
  const websiteSchema = getWebsiteSchema();
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { bytes } = useAppSelector((state) => state.bytes);
  
  const [heroRef, heroControls] = useScrollAnimation();
  const [aboutRef, aboutControls] = useScrollAnimation({ delay: 200 });
  const [projectsRef, projectsControls] = useScrollAnimation();
  const [bytesRef, bytesControls] = useScrollAnimation();
  
  useEffect(() => {
    // First fetch the data
    dispatch(fetchProjects());
    dispatch(fetchBytes());
    
    // Then apply filters
    dispatch(filterProjects('featured'));
    dispatch(filterBytes(null));
  }, [dispatch]);
  
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
  
  const recentBytes = [...bytes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 2);

  return (
    <div className="home pt-16">
      <SEO 
        title="Home"
        description={seoDescription}
        canonical="/"
        schema={websiteSchema}
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
      
      <motion.section 
        className="home-about py-16 bg-background-light"
        ref={aboutRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={aboutControls}
        variants={staggerContainer}
      >
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <MotionTitle>About Me</MotionTitle>
          
          <motion.div className="home-about__content grid grid-cols-1 md:grid-cols-2 gap-8" variants={fadeInUp}>
            <div className="home-about__text flex flex-col">
              <p className="home-about__paragraph text-gray-300 mb-4">
                I'm a passionate full stack developer with expertise in modern web technologies. 
                I specialize in building responsive, user-friendly applications with React, 
                TypeScript, and other cutting-edge tools.
              </p>
              <p className="home-about__paragraph text-gray-300 mb-4">
                With a background in both frontend and backend development, I create seamless 
                experiences that solve real-world problems.
              </p>
              
              <Link to="/about" className="btn btn-secondary home-about__cta mt-4 self-start">
                More About Me
              </Link>
            </div>
            
            <div className="home-about__skills grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="home-about__skill-category bg-background p-6 rounded-lg">
                <h3 className="home-about__skill-title text-xl font-heading font-semibold mb-4 text-neon-blue">Frontend</h3>
                <div className="home-about__skill-tags flex flex-wrap gap-2">
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">React</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">TypeScript</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">Redux</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">Tailwind</span>
                </div>
              </div>
              
              <div className="home-about__skill-category bg-background p-6 rounded-lg">
                <h3 className="home-about__skill-title  text-xl font-heading font-semibold mb-4 text-neon-blue">Backend</h3>
                <div className="home-about__skill-tags flex flex-wrap gap-2">
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">Node.js</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">Express</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">MongoDB</span>
                  <span className="home-about__skill-tag bg-primary-dark text-white text-sm py-1 px-3 rounded-full">GraphQL</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section 
        className="home-projects py-16"
        ref={projectsRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={projectsControls}
        variants={staggerContainer}
      >
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LinkTitle link='/projects' linkText='View All Projects'>Featured Projects</LinkTitle>
          
          <div className="home-projects__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="home-bytes py-16 bg-background-light"
        ref={bytesRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={bytesControls}
        variants={staggerContainer}
      >
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <LinkTitle link='/bytes' linkText='View All Bytes'>Recent Bytes</LinkTitle>
          <div className="home-bytes__grid">
            {recentBytes.map((byte, index) => (
              <ByteCard key={byte.id} byte={byte} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      <section className="home-contact">
        <div className="section-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            className="home-contact__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="home-contact__title">Let's Work Together</h2>
            <p className="home-contact__text">
              Have a project in mind or want to discuss potential opportunities?
            </p>
            <Link to="/contact" className="btn btn-primary home-contact__cta">
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
