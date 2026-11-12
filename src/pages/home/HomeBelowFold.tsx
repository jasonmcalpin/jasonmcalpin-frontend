import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { fetchProjects } from '../../store/slices/projectsSlice';
import { fetchBytes } from '../../store/slices/bytesSlice';
import ProjectCard from '../../components/global/projectCard';
import ByteCard from '../../components/global/byteCard';
import consulting from '../../../public/data/consulting.json';

export default function HomeBelowFold() {
  const dispatch = useAppDispatch();
  const { projects, hasLoaded: projectsLoaded, isLoading: projectsLoading } = useAppSelector(state => state.projects);
  const { bytes, hasLoaded: bytesLoaded, isLoading: bytesLoading } = useAppSelector(state => state.bytes);
  useEffect(() => {
    if (!projectsLoaded && !projectsLoading) dispatch(fetchProjects());
    if (!bytesLoaded && !bytesLoading) dispatch(fetchBytes());
  }, [dispatch, projectsLoaded, projectsLoading, bytesLoaded, bytesLoading]);

  const priority = ['ibm-research-tool', 'ford-website', 'mcp-stitch', 'browser-model-lab'];
  const featured = priority.map(slug => projects.find(project => project.slug === slug))
    .filter((project): project is (typeof projects)[number] => Boolean(project));
  const recentBytes = [...bytes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  return (
    <>
      <section className="consulting-section" aria-labelledby="capabilities-title">
        <div className="consulting-container">
          <div className="consulting-section-heading">
            <p className="consulting-eyebrow">What I can help you accomplish</p>
            <h2 id="capabilities-title">Complex problems. Simple answers.</h2>
            <p>Senior engineering guidance backed by hands-on implementation.</p>
          </div>
          <div className="consulting-service-grid">
            {consulting.services.map(service => (
              <article className="consulting-service-tile" key={service.id}>
                <span className="consulting-service-tile__number">0{consulting.services.indexOf(service) + 1}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link to="/services">Explore service <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="consulting-section consulting-section--subtle" aria-labelledby="work-title">
        <div className="consulting-container">
          <div className="consulting-section-heading consulting-section-heading--split">
            <div><p className="consulting-eyebrow">Selected work</p><h2 id="work-title">The work speaks.</h2></div>
            <Link to="/projects" className="consulting-text-link">View all work →</Link>
          </div>
          <div className="consulting-project-grid">{featured.map(project => <ProjectCard key={project.id} project={project} index={0} />)}</div>
          {!projectsLoaded && <p role="status">Loading selected work…</p>}
        </div>
      </section>
      <section className="consulting-section" aria-labelledby="approach-title">
        <div className="consulting-container consulting-two-column">
          <div><p className="consulting-eyebrow">How I work</p><h2 id="approach-title">Experience beats guesswork.</h2>
            <p className="consulting-body">You work with the person designing and implementing the solution. We establish the business objective, constraints and acceptance criteria before committing to the technical approach.</p>
            <Link to="/contact" className="consulting-text-link">Talk through your challenge →</Link>
          </div>
          <ul className="consulting-proof-list">{consulting.proof.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
      {recentBytes.length > 0 && (
        <section className="consulting-section consulting-section--subtle" aria-labelledby="writing-title">
          <div className="consulting-container">
            <div className="consulting-section-heading consulting-section-heading--split">
              <div><p className="consulting-eyebrow">Bits of thinking</p><h2 id="writing-title">Recent Bytes.</h2></div>
              <Link to="/bytes" className="consulting-text-link">Read the Bytes →</Link>
            </div>
            <div className="home-bytes__grid">{recentBytes.map((byte, index) => <ByteCard key={byte.id} byte={byte} index={index} />)}</div>
          </div>
        </section>
      )}
      <section className="consulting-cta">
        <div className="consulting-container"><p className="consulting-eyebrow">Start a conversation</p>
          <h2>{consulting.contact.heading}</h2><p>{consulting.contact.description}</p>
          <Link to="/contact" className="consulting-button consulting-button--primary">Discuss a project</Link>
        </div>
      </section>
    </>
  );
}
