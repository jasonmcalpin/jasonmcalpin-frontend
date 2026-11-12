import { useState } from 'react';
import type { FormEvent } from 'react';
import SEO from '../../components/global/SEO';
import TurnstileChallenge from '../../components/contact/TurnstileChallenge';
import consulting from '../../../public/data/consulting.json';

const apiUrl = import.meta.env.VITE_CONTACT_API_URL?.trim() || '';
const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || '';
const ready = Boolean(apiUrl && siteKey && /^https:\/\//.test(apiUrl));

type SubmitStatus = 'idle' | 'sending' | 'accepted' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [timeline, setTimeline] = useState('');
  const [website, setWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [challengeKey, setChallengeKey] = useState(0);
  const [challengeError, setChallengeError] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ready || !turnstileToken || status === 'sending') return;
    setStatus('sending');
    setFeedback('');
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message, timeline, website, turnstileToken }),
        signal: AbortSignal.timeout(15000)
      });
      if (response.status !== 202) {
        let data: { code?: string } = {};
        try { data = await response.json(); } catch { /* no response body */ }
        if (data.code === 'verification_failed')
          throw new Error('Spam verification expired or failed. Please try again.');
        if (data.code === 'invalid_inquiry')
          throw new Error('Please check your information and try again.');
        throw new Error('Your inquiry could not be submitted. Please try again later.');
      }
      setStatus('accepted');
      setFeedback('Your inquiry was accepted for delivery. Thank you for reaching out.');
      setName('');
      setEmail('');
      setMessage('');
      setTimeline('');
      setWebsite('');
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error && !['Failed to fetch', 'TimeoutError'].includes(error.message)
        ? error.message : 'Your inquiry could not be submitted. Please try again later.');
    } finally {
      setTurnstileToken(null);
      setChallengeKey(value => value + 1);
    }
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
            <h2>Tell me about your project.</h2>
            <p>Describe the system, the problem and what a successful engagement would look like. You don't need a complete specification to start.</p>
            <p className="consulting-small">Based near Atlanta, Georgia · Remote collaboration available</p>
            <p>Your message goes directly to my private business inbox. I don't publish that address or pass your inquiry to a public discussion feed.</p>
            <div className="consulting-socials">
              <a href={consulting.identity.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn ↗</a>
              <a href={consulting.identity.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            </div>
          </div>
          <div className="consulting-simple-card">
            <h2>Send a project inquiry.</h2>
            {!ready ? (
              <div role="status">
                <p>The secure inquiry form is being connected. In the meantime, please reach out through LinkedIn.</p>
                <a className="consulting-text-link" href={consulting.identity.linkedin} target="_blank" rel="noopener noreferrer">Contact me on LinkedIn ↗</a>
              </div>
            ) : status === 'accepted' ? (
              <div role="status" className="consulting-inquiry-success">
                <h3>Inquiry submitted</h3>
                <p>{feedback}</p>
                <button className="consulting-button consulting-button--outline" onClick={() => { setStatus('idle'); setFeedback(''); }}>Send another inquiry</button>
              </div>
            ) : (
              <form onSubmit={submit} className="consulting-inquiry-form">
                <p className="consulting-small">Your details are used to respond to your inquiry. See the <a href="/privacy">privacy policy</a>.</p>
                <label htmlFor="inquiry-name">Your name</label>
                <input id="inquiry-name" name="name" required minLength={2} maxLength={100}
                  value={name} onChange={e => setName(e.target.value)} autoComplete="name" disabled={status==='sending'} />
                <label htmlFor="inquiry-email">Your email</label>
                <input id="inquiry-email" name="email" type="email" required maxLength={254}
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" disabled={status==='sending'} />
                <label htmlFor="inquiry-message">What are you trying to accomplish?</label>
                <textarea id="inquiry-message" name="message" required minLength={20} maxLength={3000} rows={6}
                  value={message} onChange={e => setMessage(e.target.value)} disabled={status==='sending'} />
                <label htmlFor="inquiry-timeline">Timeline or constraints (optional)</label>
                <input id="inquiry-timeline" name="timeline" maxLength={250} value={timeline}
                  onChange={e => setTimeline(e.target.value)} disabled={status==='sending'} />
                <div className="consulting-honeypot" aria-hidden="true">
                  <label htmlFor="inquiry-website">Leave this blank</label>
                  <input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off"
                    value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
                <TurnstileChallenge siteKey={siteKey} resetKey={challengeKey}
                  onToken={setTurnstileToken} onError={() => setChallengeError(true)} />
                {challengeError && <p role="alert">Verification could not load. Refresh the page or try again.</p>}
                {status==='error' && <p className="consulting-inquiry-error" role="alert">{feedback}</p>}
                <button type="submit" className="consulting-button consulting-button--primary"
                  disabled={!turnstileToken || status === 'sending' || challengeError}>
                  {status === 'sending' ? 'Sending inquiry…' : 'Send inquiry'}
                </button>
                <p className="consulting-small">Protected by Cloudflare Turnstile. This form does not save drafts to your browser storage.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
