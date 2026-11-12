import { Link } from 'react-router-dom';
import { Layers3, Workflow, Gauge, Compass } from 'lucide-react';
import SEO from '../../components/global/SEO';
import consulting from '../../../public/data/consulting.json';
import { getServicesSchema } from '../../utils/schema';

const icons = { layers: Layers3, workflow: Workflow, gauge: Gauge, compass: Compass };

export default function Services() {
  return (
    <div className="consulting-page consulting-inner-page services">
      <SEO title="Software Engineering Services" canonical="/services"
        description="Independent engineering for application modernization, AI integration, performance and technical consulting." schema={getServicesSchema()} />
      <header className="consulting-page-intro consulting-container">
        <p className="consulting-eyebrow">Services</p>
        <h1>Experienced engineering for the work that matters.</h1>
        <p className="consulting-lead">Whether you need to modernize an existing system, connect AI to business workflows or solve a costly performance problem, I help define the right solution and deliver it.</p>
        <Link to="/contact" className="consulting-button consulting-button--primary">Discuss your project</Link>
      </header>
      <section className="consulting-section consulting-section--subtle" aria-labelledby="services-heading">
        <div className="consulting-container">
          <h2 className="consulting-visually-hidden" id="services-heading">Services offered</h2>
          <div className="consulting-service-grid">
            {consulting.services.map(service => {
              const Icon = icons[service.icon as keyof typeof icons];
              return (
                <article key={service.id} className="consulting-service-tile consulting-service-tile--detailed">
                  <Icon className="consulting-service-icon" size={29} strokeWidth={1.6} aria-hidden="true" />
                  <h3>{service.title}</h3><p>{service.description}</p>
                  <h4>Typical engagements</h4>
                  <ul>{service.deliverables.map(deliverable => <li key={deliverable}>{deliverable}</li>)}</ul>
                  <Link to={'/projects/' + service.evidence}>See relevant work →</Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="consulting-section" aria-labelledby="engagement-heading">
        <div className="consulting-container">
          <div className="consulting-section-heading"><p className="consulting-eyebrow">Working together</p><h2 id="engagement-heading">Choose the engagement that fits the problem.</h2></div>
          <div className="consulting-three-column">
            {consulting.engagements.map((engagement, index) =>
              <article className="consulting-simple-card" key={engagement.name}>
                <span className="consulting-service-tile__number">0{index + 1}</span>
                <h3>{engagement.name}</h3><p>{engagement.description}</p>
              </article>)}
          </div>
          <p className="consulting-small">Scope, timing and fees are agreed directly based on the work, not guessed from a generic price list.</p>
        </div>
      </section>
      <section className="consulting-cta"><div className="consulting-container">
        <p className="consulting-eyebrow">Tell me what needs to change</p><h2>{consulting.contact.heading}</h2>
        <p>{consulting.contact.description}</p>
        <Link to="/contact" className="consulting-button consulting-button--primary">Start a conversation</Link>
      </div></section>
    </div>
  );
}
