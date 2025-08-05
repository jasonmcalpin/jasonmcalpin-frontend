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
      className="project-card highlight-outline bg-background-light rounded-lg overflow-hidden transition-all duration-300"
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
      <div className="project-card__image-container relative w-full h-48 overflow-hidden">
        <OptimizedImage 
          src={project.imageUrl} 
          alt={project.title} 
          className="project-card__image w-full h-full object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {project.featured && (
          <div className="project-card__featured absolute top-3 right-3 bg-secondary text-white text-xs font-bold py-1 px-2 rounded">
            <span className='relative z-10'>Featured</span>
          </div>
        )}
      </div>
      
      <div className="project-card__content p-6">
        <h3 className="project-card__title text-xl font-heading font-bold mb-2 text-white">{project.title}</h3>
        <p className="project-card__description text-gray-300 mb-4 line-clamp-3">{project.description}</p>
        
        <div className="project-card__technologies flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span key={i} className="project-card__tech-tag bg-primary-dark text-white text-xs py-1 px-2 rounded-full">
              {tech}
            </span>
          ))}
        </div>
        
        <div className="project-card__links flex flex-wrap gap-3 mt-auto">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded transition-all duration-300 bg-gray-800 text-white hover:bg-gray-700 project-card__link--github "
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
              className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded transition-all duration-300 project-card__link--live bg-neon-blue text-white hover:bg-blue-600"
              aria-label={`View live demo of ${project.title}`}
            >
              Live Demo
            </a>
          )}
          
          <Link 
            to={`/projects/${project.slug}`} 
            className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded transition-all duration-300 project-card__link--details bg-secondary text-white hover:bg-secondary-light"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
