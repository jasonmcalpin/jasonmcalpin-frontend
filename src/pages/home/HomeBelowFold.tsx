import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { fetchBytes } from '../../store/slices/bytesSlice';
import ProjectCard from '../../components/global/projectCard';
import ByteCard from '../../components/global/byteCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { MotionTitle, LinkTitle } from '../../components/global/Titles';

// Loaded only when the below-the-fold boundary approaches the viewport.
// Keep the page's existing sections and animations in this separate Vite chunk.
const HomeBelowFold = () => {
  const dispatch = useAppDispatch();
  const { projects, hasLoaded: projectsLoaded, isLoading: projectsLoading } =
    useAppSelector(state => state.projects);
  const { bytes, hasLoaded: bytesLoaded, isLoading: bytesLoading } =
    useAppSelector(state => state.bytes);

  const [aboutRef, aboutControls] = useScrollAnimation({ delay: 200 });
  const [projectsRef, projectsControls] = useScrollAnimation();
  const [bytesRef, bytesControls] = useScrollAnimation();

  useEffect(() => {
    if (!projectsLoaded && !projectsLoading) dispatch(fetchProjects());
    if (!bytesLoaded && !bytesLoading) dispatch(fetchBytes());
  }, [dispatch, projectsLoaded, projectsLoading, bytesLoaded, bytesLoading]);

  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
  const recentBytes = [...bytes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <>
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
    </>
  );
};

export default HomeBelowFold;
