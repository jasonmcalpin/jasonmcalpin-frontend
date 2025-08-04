import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterProjects, fetchProjects } from '../../store/slices/projectsSlice';
import ProjectCard from '../../components/global/projectCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.css';

const Projects = () => {
  const dispatch = useAppDispatch();
  const { projects, filteredProjects, activeFilter } = useAppSelector((state) => state.projects);
  const [technologies, setTechnologies] = useState<string[]>([]);
  
  // Extract unique technologies from projects
  useEffect(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    setTechnologies(Array.from(techSet).sort());
  }, [projects]);
  
  // Fetch projects and initialize with all projects
  useEffect(() => {
    dispatch(fetchProjects())
      .then(() => {
        dispatch(filterProjects(null));
      });
  }, [dispatch]);
  
  // Handle filter change
  const handleFilterChange = (filter: string | null) => {
    dispatch(filterProjects(filter));
  };

  return (
    <div className="projects">
      <section className="projects-hero">
        <div className="projects-hero__container">
          <h1 className="projects-hero__title">My Projects</h1>
          <p className="projects-hero__subtitle">
            A collection of my work showcasing my skills and experience
          </p>
        </div>
      </section>
      
      <section className="projects-content">
        <div className="section-container">
          {/* Filters */}
          <motion.div 
            className="projects-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="projects-filters__title">Filter by:</h2>
            <div className="projects-filters__buttons">
              <button 
                className={`projects-filters__button ${activeFilter === null ? 'projects-filters__button--active' : ''}`}
                onClick={() => handleFilterChange(null)}
              >
                All
              </button>
              
              <button 
                className={`projects-filters__button ${activeFilter === 'featured' ? 'projects-filters__button--active' : ''}`}
                onClick={() => handleFilterChange('featured')}
              >
                Featured
              </button>
              
              {technologies.map((tech) => (
                <button 
                  key={tech}
                  className={`projects-filters__button ${activeFilter === tech ? 'projects-filters__button--active' : ''}`}
                  onClick={() => handleFilterChange(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="projects-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))
            ) : (
              <motion.div 
                className="projects-empty"
                variants={fadeInUp}
              >
                <p className="projects-empty__message">
                  No projects found with the selected filter.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleFilterChange(null)}
                >
                  Show All Projects
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      <section className="projects-process">
        <div className="section-container">
          <motion.h2 
            className="section-title text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            My Development Process
          </motion.h2>
          
          <div className="projects-process__steps">
            <motion.div 
              className="projects-process__step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="projects-process__step-number">01</div>
              <h3 className="projects-process__step-title">Discovery & Planning</h3>
              <p className="projects-process__step-description">
                I start by understanding the project requirements, goals, and target audience. 
                This phase includes research, wireframing, and creating a detailed project plan.
              </p>
            </motion.div>
            
            <motion.div 
              className="projects-process__step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="projects-process__step-number">02</div>
              <h3 className="projects-process__step-title">Design & Prototyping</h3>
              <p className="projects-process__step-description">
                Next, I create visual designs and interactive prototypes to establish the look and feel 
                of the project. This ensures we have a clear vision before development begins.
              </p>
            </motion.div>
            
            <motion.div 
              className="projects-process__step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="projects-process__step-number">03</div>
              <h3 className="projects-process__step-title">Development</h3>
              <p className="projects-process__step-description">
                During development, I write clean, maintainable code following best practices. 
                I use modern frameworks and tools to build scalable and performant applications.
              </p>
            </motion.div>
            
            <motion.div 
              className="projects-process__step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="projects-process__step-number">04</div>
              <h3 className="projects-process__step-title">Testing & Deployment</h3>
              <p className="projects-process__step-description">
                Finally, I thoroughly test the application to ensure it works flawlessly across all devices 
                and browsers. After testing, I deploy the project and provide ongoing support.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="projects-cta">
        <div className="section-container">
          <motion.div 
            className="projects-cta__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="projects-cta__title">Have a project in mind?</h2>
            <p className="projects-cta__text">
              I'm always looking for interesting projects to work on. Let's discuss how I can help bring your ideas to life.
            </p>
            <a href="/contact" className="btn btn-primary projects-cta__button">
              Start a Project
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
