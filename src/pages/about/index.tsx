import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { fetchLogos } from '../../store/slices/logoSlice';
import SEO from '../../components/global/SEO';
import { getPersonSchema } from '../../utils/schema';

export default function About() {
  const dispatch = useAppDispatch();
  const { logos } = useAppSelector(state => state.logos);
  useEffect(() => { dispatch(fetchLogos()); }, [dispatch]);
  return (
    <div className="consulting-page consulting-inner-page about">
      <SEO title="About Jason McAlpin" canonical="/about" type="profile"
        description="Independent software engineer with 15+ years of production experience across enterprise web, data, APIs and AI integration."
        schema={getPersonSchema()} />
      <header className="consulting-page-intro consulting-container">
        <p className="consulting-eyebrow">About</p>
        <h1>A senior engineer who cares about the result.</h1>
        <p className="consulting-lead">I'm Jason McAlpin, an independent software engineer and consultant based near Atlanta. For more than 15 years I've helped teams build, modernize and improve applications that people depend on.</p>
      </header>
      <section className="consulting-section consulting-section--subtle">
        <div className="consulting-container consulting-two-column">
          <div>
            <p className="consulting-eyebrow">Experience and approach</p>
            <h2>From technical ambiguity to working systems.</h2>
            <p className="consulting-body">My background spans customer-facing digital experiences, complex data migrations, APIs, enterprise publishing, performance work and applied AI. I've contributed to projects for IBM, Ford and teams working across several industries.</p>
            <p className="consulting-body">I work across architectural decisions and implementation, with attention to what the organization needs to maintain after delivery—not just the code needed for a demonstration.</p>
            <Link to="/projects" className="consulting-text-link">See the work behind the claims →</Link>
          </div>
          <aside className="consulting-simple-card">
            <p className="consulting-eyebrow">Selected recognition</p>
            <h3>2023 Sammy Award</h3>
            <p>The IBM Sales Intelligence Slack bot received a Business Intelligence Group Sammy Award. I consulted on connecting the bot to Watson AI and defining the models and APIs used for Slack responses.</p>
            <p className="consulting-small">Recognition belongs to the team and project; my involvement was a contributing engineering role.</p>
          </aside>
        </div>
      </section>
      {logos.length > 0 && <section className="consulting-section">
        <div className="consulting-container">
          <div className="consulting-section-heading"><p className="consulting-eyebrow">Professional experience</p><h2>Clients I've worked with.</h2>
            </div>
          <ul className="consulting-client-logos">
            {logos.map(logo => <li key={logo.companyName}><img loading="lazy" src={logo.logoSrc} alt={logo.companyName} /></li>)}
          </ul>
        </div>
      </section>}
      <section className="consulting-section consulting-section--subtle">
        <div className="consulting-container consulting-two-column">
          <div><p className="consulting-eyebrow">Current engineering</p><h2>Working at the boundaries of AI systems.</h2></div>
          <div><p className="consulting-body">Alongside client and enterprise work, I build tools for model evaluation, agent coordination and durable project knowledge. Some are published for anyone to install; others remain active engineering projects with their maturity documented openly.</p>
            <Link className="consulting-text-link" to="/projects">Explore AI and open-source projects →</Link></div>
        </div>
      </section>
      <section className="consulting-cta"><div className="consulting-container">
        <p className="consulting-eyebrow">Work together</p><h2>Need experienced engineering on your next challenge?</h2>
        <p>Let's discuss the outcome you're after and whether I'm the right person to help.</p>
        <Link to="/contact" className="consulting-button consulting-button--primary">Start a conversation</Link>
      </div></section>
    </div>
  );
}
