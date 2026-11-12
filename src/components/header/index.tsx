import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleMobileMenu, closeMobileMenu, setIsScrolled } from '../../store/slices/uiSlice';

const navLinks = [
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Work' },
  { path: '/about', label: 'About' },
  { path: '/bytes', label: 'Bytes' },
];

export default function Header() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isMobileMenuOpen, isScrolled } = useAppSelector(state => state.ui);
  useEffect(() => { dispatch(closeMobileMenu()); }, [location.pathname, dispatch]);
  useEffect(() => {
    const handleScroll = () => dispatch(setIsScrolled(window.scrollY > 50));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  return (
    <><a href="#main-content" className="consulting-skip-link">Skip to main content</a>
    <header className={'consulting-nav ' + (isScrolled ? 'consulting-nav--scrolled' : '')}>
      <div className="consulting-nav__inner">
        <Link to="/" className="consulting-nav__brand" aria-label="Jason McAlpin, home">Jason McAlpin<span> / software consultant</span></Link>
        <nav className="consulting-nav__links" aria-label="Primary navigation">
          {navLinks.map(link => <Link key={link.path} to={link.path}
            aria-current={location.pathname === link.path ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <Link to="/contact" className="consulting-nav__cta">Discuss a project <span aria-hidden="true">↗</span></Link>
        <button type="button" className="consulting-nav__toggle" onClick={() => dispatch(toggleMobileMenu())}
          aria-expanded={isMobileMenuOpen} aria-controls="mobile-site-nav" aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
          <span aria-hidden="true">{isMobileMenuOpen ? '×' : '☰'}</span>
        </button>
      </div>
      {isMobileMenuOpen && <nav id="mobile-site-nav" className="consulting-nav__mobile" aria-label="Mobile navigation">
        {navLinks.map(link => <Link to={link.path} key={link.path} aria-current={location.pathname === link.path ? 'page' : undefined}>{link.label}</Link>)}
        <Link to="/contact">Discuss a project</Link>
      </nav>}
    </header></>
  );
}
