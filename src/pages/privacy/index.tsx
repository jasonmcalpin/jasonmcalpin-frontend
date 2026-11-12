import { Link } from 'react-router-dom';
import SEO from '../../components/global/SEO';

export default function Privacy() {
  return <div className="consulting-page consulting-inner-page privacy">
    <SEO title="Privacy Policy" canonical="/privacy"
      description="How jasonmcalpin.com handles contact inquiries, analytics consent and local website storage." />
    <header className="consulting-page-intro consulting-container">
      <p className="consulting-eyebrow">Privacy</p>
      <h1>Privacy policy.</h1>
      <p className="consulting-lead">How information is handled when you use this website or send a project inquiry.</p>
      <p className="consulting-small">Last updated: November 12, 2026</p>
    </header>
    <section className="consulting-section consulting-section--subtle">
      <div className="consulting-container consulting-case-study">
        <section><h2>Contact inquiries</h2>
          <p>When you submit the contact form, you provide your name, email address, project description and optionally a timeline. This information is used to review your inquiry and reply to you. The contact endpoint verifies the anti-spam challenge and sends the message to a private business inbox through Amazon Web Services (AWS Lambda and Amazon SES).</p>
          <p>The website does not publish your message. The form does not store drafts in browser local storage. Email providers may retain delivered messages in mailboxes, backups and delivery systems according to their retention practices. Inquiries are retained as necessary for correspondence and business records, then deleted when no longer needed.</p>
        </section>
        <section><h2>Spam prevention</h2>
          <p>The form uses Cloudflare Turnstile to reduce automated submissions. The challenge communicates with Cloudflare, which may process browser and connection information to evaluate potential abuse. The server verifies the submitted token before attempting email delivery.</p>
        </section>
        <section><h2>Analytics and local storage</h2>
          <p>Optional website analytics are loaded only if you consent to analytics. When enabled, Google Tag Manager and associated analytics services may receive information about site use. You can decline optional analytics using the website's consent controls.</p>
          <p>Browser storage is also used for preferences and for progress in interactive features such as games. This local state can generally be cleared using your browser's site-data controls. Essential operational requests and hosting logs may include technical request metadata.</p>
        </section>
        <section><h2>Sharing and security</h2>
          <p>Inquiry information is handled using AWS infrastructure and email delivery services, and Turnstile verification uses Cloudflare. Information is not sold to advertisers. Access to inquiry delivery is limited through infrastructure permissions, and the website does not publicly expose the destination mailbox.</p>
        </section>
        <section><h2>Your choices and requests</h2>
          <p>You can clear browser-local site data, decline optional analytics, or ask about access, correction or deletion of information provided in an inquiry, subject to applicable legal and business retention obligations. Use the <Link to="/contact">contact page</Link> or its linked professional profile to make a request.</p>
        </section>
        <section><h2>Changes</h2>
          <p>This policy may be updated when website features or processing practices change. The current version is published on this page.</p>
        </section>
      </div>
    </section>
  </div>;
}
