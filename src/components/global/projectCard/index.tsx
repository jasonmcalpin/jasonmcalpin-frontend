import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Project } from '../../../store/slices/projectsSlice';
import OptimizedImage from '../OptimizedImage';
import './styles.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const delay = index * 0.1;

  return (
    <motion.div 
      className="project-card highlight-outline"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          delay 
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="project-card__image-container">
        <OptimizedImage 
          src={project.imageUrl} 
          alt={project.title} 
          className="project-card__image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {project.featured && (
          <div className="project-card__featured">
            <span>Featured</span>
          </div>
        )}
      </div>
      
      <div className="project-card__content">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        
        <div className="project-card__technologies">
          {project.technologies.map((tech, i) => (
            <span key={i} className="project-card__tech-tag">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="project-card__links">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-card__link project-card__link--github"
              aria-label={`View ${project.title} on GitHub`}
            >
              GitHub
            </a>
          )}
          
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-card__link project-card__link--live"
              aria-label={`View live demo of ${project.title}`}
            >
              Live Demo
            </a>
          )}
          
          <Link 
            to={`/projects/${project.slug}`} 
            className="project-card__link project-card__link--details"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
