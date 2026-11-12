import { useState } from 'react';
import type { FormEvent } from 'react';
import SEO from '../../components/global/SEO';
import consulting from '../../../public/data/consulting.json';

export default function Contact() {
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [project, setProject] = useState('');
  const [timeline, setTimeline] = useState('');
  const email = consulting.identity.email;
  const startEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = ['Name: ' + name, 'Email: ' + from, '', 'Project or challenge:', project,
      '', 'Timeline or constraints:', timeline].join('\n');
    window.location.href = 'mailto:' + email + '?subject=' +
      encodeURIComponent('Project inquiry from ' + name) + '&body=' + encodeURIComponent(body);
  };

  return (
    <div className="consulting-page consulting-inner-page contact">
      <SEO title="Discuss a Software Project" canonical="/contact"
        description="Contact Jason McAlpin to discuss application modernization, AI integration, performance engineering or technical consulting." />
      <header className="consulting-page-intro consulting-container">
        <p className="consulting-eyebrow">Contact</p>
        <h1>{consulting.contact.heading}</h1>
        <p className="consulting-lead">{consulting.contact.description}</p>
      </header>
      <section className="consulting-section consulting-section--subtle">
        <div className="consulting-container consulting-contact-grid">
          <div className="consulting-simple-card">
            <h2>Start with an email.</h2>
            <p>Describe the system, the problem and what a successful engagement would look like. You don't need a full specification to begin.</p>
            <a className="consulting-contact-email" href={'mailto:' + email}>{email}</a>
            <p className="consulting-small">Based near Atlanta, Georgia · Remote collaboration available</p>
            <div className="consulting-socials">
              <a href={consulting.identity.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href={consulting.identity.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="consulting-simple-card">
            <h2>Prepare a project inquiry.</h2>
            <p className="consulting-small">This form opens your email application with a prepared message. Nothing is submitted or stored by this website.</p>
            <form onSubmit={startEmail} className="consulting-inquiry-form">
              <label htmlFor="inquiry-name">Your name</label>
              <input id="inquiry-name" name="name" required maxLength={100} value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
              <label htmlFor="inquiry-email">Your email</label>
              <input id="inquiry-email" name="email" type="email" required maxLength={200} value={from} onChange={e => setFrom(e.target.value)} autoComplete="email" />
              <label htmlFor="inquiry-project">What are you trying to accomplish?</label>
              <textarea id="inquiry-project" name="project" required minLength={10} maxLength={2500} rows={5} value={project} onChange={e => setProject(e.target.value)} />
              <label htmlFor="inquiry-timeline">Timeline or constraints (optional)</label>
              <input id="inquiry-timeline" name="timeline" maxLength={250} value={timeline} onChange={e => setTimeline(e.target.value)} />
              <button type="submit" className="consulting-button consulting-button--primary">Open email draft</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
