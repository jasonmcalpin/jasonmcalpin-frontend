import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { fetchProjects } from '../../store/slices/projectsSlice';
import OptimizedImage from '../../components/global/OptimizedImage';
import './styles.css';

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, isLoading, hasLoaded, error } = useAppSelector(state => state.projects);
  const project = projects.find(item => item.slug === slug);

  useEffect(() => {
    if (!hasLoaded && !isLoading && !error) dispatch(fetchProjects());
  }, [dispatch, hasLoaded, isLoading, error]);

  if (!hasLoaded && !error) {
    return (
      <div className='project-page'>
        <div className='section-container'>
          <div className='project-page__loading'>
            <p>Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='project-page'><div className='section-container' role='alert'>
      <h1>Unable to load projects</h1><p>{error}</p>
      <button className='btn btn-primary' onClick={() => dispatch(fetchProjects())}>Retry</button>
    </div></div>;
  }

  if (!project) {
    return (
      <div className='project-page'>
        <div className='section-container'>
          <div className='project-page__not-found'>
            <h1>Project Not Found</h1>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <button 
              className='btn btn-primary'
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
    <div className='project-page'>
      {/* Project Hero */}
      <section className='project-page__hero'>
        <div className='project-page__hero-container'>
          <h1 
            className='project-page__title'
            
            
            
           data-reveal="viewport">
            {project.title}
          </h1>
          
          <div 
            className='project-page__technologies'
            
            
            
           data-reveal="viewport">
            {project.technologies.map((tech, i) => (
              <span key={i} className='project-page__tech-tag'>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Project Content */}
      <section className='project-page__content'>
        <div className='section-container'>
          {project.imageUrl && (
            <div 
              className='project-page__image-container'
              
              
              
             data-reveal="viewport">
              <OptimizedImage src={project.imageUrl} alt={project.title}
                  className="project-page__image w-full" sizes="(max-width: 768px) 100vw, 1000px" />
            </div>
          )}
          
          <div 
            className='project-page__description'
            
            
            
            
           data-reveal="viewport">
            <h2>Project Overview</h2>
            <p>{project.description}</p>
          </div>
          
          <div 
            className='project-page__links'
            
            
            
            
           data-reveal="viewport">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target='_blank' 
                rel='noopener noreferrer'
                className='btn btn-secondary'
              >
                View on GitHub
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target='_blank' 
                rel='noopener noreferrer'
                className='btn btn-primary'
              >
                Visit Live Site
              </a>
            )}
          </div>
        </div>
      </section>
      
      {/* Back to Projects Button */}
      <section className='project-page__footer'>
        <div className='section-container'>
          <div 
            className='project-page__navigation'
            
            
            
           data-reveal="viewport">
            <button 
              className='btn btn-primary'
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
