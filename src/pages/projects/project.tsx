import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/useAppStore';
import { fetchProjects } from '../../store/slices/projectsSlice';
import OptimizedImage from '../../components/global/OptimizedImage';
import SEO from '../../components/global/SEO';

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { projects, isLoading, hasLoaded, error } = useAppSelector(state => state.projects);
  const project = projects.find(item => item.slug === slug);
  useEffect(() => {
    if (!hasLoaded && !isLoading && !error) dispatch(fetchProjects());
  }, [dispatch, hasLoaded, isLoading, error]);

  if (!hasLoaded && !error) return <div className="consulting-page consulting-inner-page"><div className="consulting-container consulting-page-intro" role="status">Loading project…</div></div>;
  if (error || !project) return <div className="consulting-page consulting-inner-page"><div className="consulting-container consulting-page-intro">
    <h1>{error ? 'Unable to load this case study' : 'Project not found'}</h1>
    <Link to="/projects" className="consulting-text-link">Back to selected work →</Link>
  </div></div>;

  return (
    <article className="consulting-page consulting-inner-page project-page">
      <SEO title={project.title} description={project.outcome || project.description} canonical={'/projects/' + project.slug}
        schema={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title,
          description: project.outcome || project.description,
          creator: { '@type': 'Person', name: 'Jason McAlpin', url: 'https://jasonmcalpin.com/about' } }} />
      <header className="consulting-page-intro consulting-container">
        <Link to="/projects" className="consulting-text-link">← All work</Link>
        <p className="consulting-eyebrow">{project.category || 'Engineering'}{project.kind ? ' · ' + project.kind : ''}</p>
        <h1>{project.title}</h1>
        <p className="consulting-lead">{project.outcome || project.description}</p>
      </header>
      <div className="consulting-container consulting-case-study">
        {project.imageUrl && <div className="consulting-case-study__image"><OptimizedImage src={project.imageUrl}
          alt={project.title} sizes="(max-width: 768px) 100vw, 1000px" /></div>}
        {project.challenge ? <>
          <section><p className="consulting-eyebrow">The challenge</p><h2>What needed to change</h2><p>{project.challenge}</p></section>
          <section><p className="consulting-eyebrow">My contribution</p><h2>What I was responsible for</h2><p>{project.role}</p><p>{project.approach}</p></section>
          <section><p className="consulting-eyebrow">The outcome</p><h2>What the work achieved</h2><p>{project.outcome}</p></section>
        </> : <section><h2>Project overview</h2><p>{project.description}</p></section>}
        <section><p className="consulting-eyebrow">Technical context</p><h2>Tools and technologies</h2>
          <div className="consulting-tags">{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></section>
        <div className="consulting-actions">
          {project.githubUrl && <a className="consulting-button consulting-button--outline" href={project.githubUrl} target="_blank" rel="noopener noreferrer">View source repository</a>}
          {project.liveUrl && <a className="consulting-button consulting-button--outline" href={project.liveUrl} target={project.liveUrl.startsWith('http') ? '_blank' : undefined} rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>Visit project or demo</a>}
          <Link to="/contact" className="consulting-button consulting-button--primary">Discuss similar work</Link>
        </div>
      </div>
    </article>
  );
}
