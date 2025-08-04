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
    <div className="home">
      <SEO 
        title="Home"
        description={seoDescription}
        canonical="/"
        schema={websiteSchema}
      />
      {/* Hero Section */}
      <motion.section 
        className="hero"
        ref={heroRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={heroControls}
        variants={staggerContainer}
      >
        <div className="hero__content">
          <motion.h1 className="hero__title" variants={fadeInUp}>
            <span className="hero__title-line">Hi, I'm</span>
            <span className="hero__title-line neon-text">Jason McAlpin</span>
            <span className="hero__title-line">Full Stack Developer</span>
          </motion.h1>
          
          <motion.p className="hero__subtitle" variants={fadeInUp}>
            Building modern web experiences with cutting-edge technologies
          </motion.p>
          
          <motion.div className="hero__cta" variants={fadeInUp}>
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, delay: 0.2 }
          }}
        >
          <div className="hero__grid">
            <div className="hero__grid-item hero__grid-item--1"></div>
            <div className="hero__grid-item hero__grid-item--2"></div>
            <div className="hero__grid-item hero__grid-item--3"></div>
            <div className="hero__grid-item hero__grid-item--4"></div>
          </div>
        </motion.div>
      </motion.section>
      
      <motion.section 
        className="home-about"
        ref={aboutRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={aboutControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            About Me
          </motion.h2>
          
          <motion.div className="home-about__content" variants={fadeInUp}>
            <div className="home-about__text">
              <p className="home-about__paragraph">
                I'm a passionate full stack developer with expertise in modern web technologies. 
                I specialize in building responsive, user-friendly applications with React, 
                TypeScript, and other cutting-edge tools.
              </p>
              <p className="home-about__paragraph">
                With a background in both frontend and backend development, I create seamless 
                experiences that solve real-world problems.
              </p>
              
              <Link to="/about" className="btn btn-secondary home-about__cta">
                More About Me
              </Link>
            </div>
            
            <div className="home-about__skills">
              <div className="home-about__skill-category">
                <h3 className="home-about__skill-title">Frontend</h3>
                <div className="home-about__skill-tags">
                  <span className="home-about__skill-tag">React</span>
                  <span className="home-about__skill-tag">TypeScript</span>
                  <span className="home-about__skill-tag">Redux</span>
                  <span className="home-about__skill-tag">Tailwind</span>
                </div>
              </div>
              
              <div className="home-about__skill-category">
                <h3 className="home-about__skill-title">Backend</h3>
                <div className="home-about__skill-tags">
                  <span className="home-about__skill-tag">Node.js</span>
                  <span className="home-about__skill-tag">Express</span>
                  <span className="home-about__skill-tag">MongoDB</span>
                  <span className="home-about__skill-tag">GraphQL</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section 
        className="home-projects"
        ref={projectsRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={projectsControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Featured Projects</h2>
            <Link to="/projects" className="section-link">
              View All Projects
            </Link>
          </motion.div>
          
          <div className="home-projects__grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="home-bytes"
        ref={bytesRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={bytesControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Recent Bytes</h2>
            <Link to="/bytes" className="section-link">
              View All Bytes
            </Link>
          </motion.div>
          
          <div className="home-bytes__grid">
            {recentBytes.map((byte, index) => (
              <ByteCard key={byte.id} byte={byte} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      <section className="home-contact">
        <div className="section-container">
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
