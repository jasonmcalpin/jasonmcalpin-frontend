import { Link } from 'react-router-dom';
import type { Project } from '../../../store/slices/projectsSlice';
import OptimizedImage from '../OptimizedImage';
import './styles.css';

interface ProjectCardProps { project: Project; index: number; }

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="consulting-project-card project-card">
      {project.imageUrl ? (
        <div className="consulting-project-card__image"><OptimizedImage src={project.imageUrl}
          alt={project.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" /></div>
      ) : (
        <div className="consulting-project-card__graphic" aria-hidden="true">
          <span>ENGINEERING / {project.category || 'SYSTEMS'}</span>
          <strong>{project.title.split(': ')[0]}</strong>
        </div>
      )}
      <div className="consulting-project-card__body">
        <p className="consulting-project-card__category">{project.category || 'Engineering'}{project.kind ? ' · ' + project.kind : ''}</p>
        <h3><Link to={'/projects/' + project.slug}>{project.title}</Link></h3>
        <p>{project.outcome || project.description}</p>
        <Link to={'/projects/' + project.slug} className="consulting-text-link">Read the case study →</Link>
      </div>
    </article>
  );
}
