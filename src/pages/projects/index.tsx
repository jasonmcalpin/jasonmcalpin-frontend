import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterProjects, fetchProjects, selectFilteredProjects } from '../../store/slices/projectsSlice';
import ProjectCard from '../../components/global/projectCard';
import SEO from '../../components/global/SEO';
import { Link } from 'react-router-dom';

const orderedCategories = ['Modernization', 'AI & Automation', 'Open Source & AI', 'AI Infrastructure', 'Performance', 'Digital Experience', 'Enterprise Delivery', 'Interactive Systems'];

export default function Projects() {
  const dispatch = useAppDispatch();
  const { projects, activeFilter, isLoading, error } = useAppSelector(state => state.projects);
  const filteredProjects = useAppSelector(selectFilteredProjects);
  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);
  const categories = orderedCategories.filter(category => projects.some(project => project.category === category));

  return (
    <div className="consulting-page consulting-inner-page projects">
      <SEO title="Selected Engineering Work" canonical="/projects"
        description="Case studies and public engineering projects: enterprise modernization, AI integrations, performance and open-source tools." />
      <header className="consulting-page-intro consulting-container">
        <p className="consulting-eyebrow">Selected work and open-source engineering</p>
        <h1>What I built. Why it mattered.</h1>
        <p className="consulting-lead">Enterprise work, published tools and ongoing systems research—presented with my responsibilities, outcomes and the maturity of each project.</p>
      </header>
      <section className="consulting-section consulting-section--subtle">
        <div className="consulting-container">
          <div className="consulting-filters" role="group" aria-label="Filter work by problem area">
            <button type="button" aria-pressed={activeFilter === null} className={activeFilter === null ? 'is-active' : ''} onClick={() => dispatch(filterProjects(null))}>All work</button>
            {categories.map(category => <button type="button" key={category} aria-pressed={activeFilter === category}
              className={activeFilter === category ? 'is-active' : ''} onClick={() => dispatch(filterProjects(category))}>{category}</button>)}
          </div>
          {isLoading && projects.length === 0 ? <p role="status">Loading work…</p> : error ?
            <p role="alert">Unable to load work. Please refresh and try again.</p> :
            <div className="consulting-project-grid">
              {filteredProjects.map(project => <ProjectCard key={project.id} project={project} index={0} />)}
            </div>}
          {!isLoading && !error && filteredProjects.length === 0 && <p>No projects match this category.</p>}
        </div>
      </section>
      <section className="consulting-cta"><div className="consulting-container">
        <p className="consulting-eyebrow">Have a similar challenge?</p><h2>Let's talk about your system.</h2>
        <p>Share what isn't working, what you need to build, or what needs to become simpler.</p>
        <Link to="/contact" className="consulting-button consulting-button--primary">Discuss a project</Link>
      </div></section>
    </div>
  );
}
