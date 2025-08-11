import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/useAppStore';
import type { Project } from '../../store/slices/projectsSlice';
import { fadeInUp } from '../../utils/animations';
import './styles.css';

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { projects } = useAppSelector((state) => state.projects);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Projects:', projects);
    console.log('Current slug:', slug);
    
    const foundProject = projects.find((p) => p.slug === slug);
    console.log('Found project:', foundProject);
    
    if (foundProject) {
      console.log('Setting project:', foundProject);
      setProject(foundProject);
      setIsLoading(false);
    } else {
      if (projects.length > 0) {
        console.log('No project found with slug:', slug);
        console.log('Available slugs:', projects.map(p => p.slug).join(', '));
        
        // Try to find a close match
        const closeMatch = projects.find(p => 
          p.slug?.includes(slug || '') || (slug || '').includes(p.slug || '')
        );
        if (closeMatch) {
          console.log('Found close match:', closeMatch);
          setProject(closeMatch);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [projects, slug, navigate]);

  if (isLoading) {
    return (
      <div className="project-page">
        <div className="section-container">
          <div className="project-page__loading">
            <p>Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-page">
        <div className="section-container">
          <div className="project-page__not-found">
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-page">
      {/* Project Hero */}
      <section className="project-page__hero">
        <div className="project-page__hero-container">
          <motion.h1 
            className="project-page__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.title}
          </motion.h1>
          
          <motion.div 
            className="project-page__technologies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {project.technologies.map((tech, i) => (
              <span key={i} className="project-page__tech-tag">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Project Content */}
      <section className="project-page__content">
        <div className="section-container">
          {project.imageUrl && (
            <motion.div 
              className="project-page__image-container"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="project-page__image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </motion.div>
          )}
          
          <motion.div 
            className="project-page__description"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h2>Project Overview</h2>
            <p>{project.description}</p>
          </motion.div>
          
          <motion.div 
            className="project-page__links"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View on GitHub
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Visit Live Site
              </a>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Back to Projects Button */}
      <section className="project-page__footer">
        <div className="section-container">
          <motion.div 
            className="project-page__navigation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
