import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleMobileMenu, closeMobileMenu, setIsScrolled } from '../../store/slices/uiSlice';
import { NavLink } from '../../types';
import './styles.scss';

const navLinks: NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
  { path: '/projects', label: 'Projects' },
  { path: '/bytes', label: 'Bytes' },
  // { path: '/lessons', label: 'Lessons' },
];

const Header = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isMobileMenuOpen, isScrolled } = useAppSelector(state => state.ui);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      dispatch(setIsScrolled(scrollPosition > 50));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuToggle = () => {
    dispatch(toggleMobileMenu());
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      height: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <motion.div
          className="header__logo"
          initial="hidden"
          animate={mounted ? 'visible' : 'hidden'}
          variants={logoVariants}
        >
          <Link to="/" className="header__logo-link">
            <div className="header__logo-text">
              <span className="neon-text">Jason McAlpin</span>
            </div>
          </Link>
        </motion.div>

        <motion.nav
          className="header__nav"
          initial="hidden"
          animate={mounted ? 'visible' : 'hidden'}
          variants={navVariants}
        >
          <ul className="header__nav-list">
            {navLinks.map(link => (
              <motion.li key={link.path} className="header__nav-item" variants={linkVariants}>
                <Link
                  to={link.path}
                  className={`header__nav-link ${location.pathname === link.path ? 'header__nav-link--active' : ''}`}
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        <div className="header__mobile-menu-button">
          <button
            className={`hamburger ${isMobileMenuOpen ? 'hamburger--active' : ''}`}
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
          >
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
            <span className="hamburger__line"></span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <ul className="mobile-menu__list">
              {navLinks.map(link => (
                <motion.li
                  key={link.path}
                  className="mobile-menu__item"
                  variants={linkVariants}
                  whileHover={{ x: 10 }}
                >
                  <Link
                    to={link.path}
                    className={`mobile-menu__link ${location.pathname === link.path ? 'mobile-menu__link--active' : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
