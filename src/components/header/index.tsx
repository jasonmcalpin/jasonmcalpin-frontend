import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleMobileMenu, closeMobileMenu, setIsScrolled } from '../../store/slices/uiSlice';
import type { NavLink } from '../../types';

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
    <header
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'shadow-md' : ''
  }`}
  style={{
    background: isScrolled ? 'rgba(18, 18, 18, 0.95)' : 'rgba(18, 18, 18, 0.8)',
    backdropFilter: 'blur(10px)',
  }}
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    <motion.div
      className="flex items-center"
      initial="hidden"
      animate={mounted ? 'visible' : 'hidden'}
      variants={logoVariants}
    >
      <Link to="/" className="flex items-center no-underline">
        <div className="text-xl sm:text-2xl font-heading font-bold">
          <span className="neon-text mr-1">Jason McAlpin</span>
        </div>
      </Link>
    </motion.div>

    <motion.nav
      className="hidden md:block"
      initial="hidden"
      animate={mounted ? 'visible' : 'hidden'}
      variants={navVariants}
    >
      <ul className="flex space-x-8 list-none p-0 m-0">
        {navLinks.map(link => (
          <motion.li key={link.path} className="relative" variants={linkVariants}>
            <Link
              to={link.path}
              className={`text-white hover:text-neonBlue transition-colors duration-300 text-base font-medium ${
                location.pathname === link.path ? 'text-neonBlue relative' : ''
              }`}
            >
              {link.label}
              {location.pathname === link.path && (
                <span
                  className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-neon-blue"
                  style={{boxShadow: '0 0 5px var(--color-neonBlue), 0 0 10px var(--color-neonBlue)'}}
                />
              )}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>

    <div className="block md:hidden">
      <button
        className={`w-8 h-8 flex flex-col justify-center items-center bg-transparent border-0 cursor-pointer relative ${
          isMobileMenuOpen ? 'relative' : ''
        }`}
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-[2px] bg-white block transition-all duration-300 ${
            isMobileMenuOpen ? 'transform rotate-45 translate-y-[8px] mb-0' : 'mb-[6px]'
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-white block transition-all duration-300 ${
            isMobileMenuOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`w-6 h-[2px] bg-white block transition-all duration-300 ${
            isMobileMenuOpen ? 'transform -rotate-45 -translate-y-[8px] mt-0' : 'mt-[6px]'
          }`}
        />
      </button>
    </div>
  </div>

  <AnimatePresence>
    {isMobileMenuOpen && (
      <motion.div
        className="w-full bg-background-light overflow-hidden md:hidden"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={mobileMenuVariants}
      >
        <ul className="list-none p-0 m-0">
          {navLinks.map(link => (
            <motion.li
              key={link.path}
              className="border-b border-gray-800"
              variants={linkVariants}
              whileHover={{ x: 10 }}
            >
              <Link
                to={link.path}
                className={`block py-4 px-6 text-white hover:text-neonBlue transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-neonBlue' : ''
                }`}
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
