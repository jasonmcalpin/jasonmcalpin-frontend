import { Link } from 'react-router-dom';
import consulting from '../../../public/data/consulting.json';

export default function Footer() {
  return <footer className="consulting-footer">
    <div className="consulting-container consulting-footer__grid">
      <div>
        <Link to="/" className="consulting-footer__brand">Jason McAlpin</Link>
        <p>Independent software engineering & consulting.</p>
        <p className="consulting-small">Modernization · AI integration · Performance · Architecture</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/services">Services</Link><Link to="/projects">Selected work</Link>
        <Link to="/about">About</Link><Link to="/bytes">Writing</Link>
      </nav>
      <div>
        <strong>Have a difficult problem to solve?</strong>
        <Link to="/contact" className="consulting-text-link">Discuss a project →</Link>
        <a href={'mailto:' + consulting.identity.email}>{consulting.identity.email}</a>
      </div>
    </div>
    <div className="consulting-container consulting-footer__bottom">
      <span>© {new Date().getFullYear()} Jason McAlpin</span>
      <Link to="/privacy">Privacy</Link>
      <a href="https://www.svgrepo.com/collection/dazzle-line-icons/" target="_blank" rel="noopener noreferrer">Dazzle interface icon credits</a>
    </div>
  </footer>;
}
