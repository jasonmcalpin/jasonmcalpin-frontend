import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SocialLink } from '../../types';
import './styles.scss';
import socialLinkData from '../../data/social.json';

const socialLinks: SocialLink[] = socialLinkData as SocialLink[];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  return (
    <motion.footer 
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="footer__container">
        <motion.div className="footer__logo" variants={itemVariants}>
          <Link to="/" className="footer__logo-link">
            <div className="footer__logo-text">
              <span className="neon-text">Jason</span>
              <span className="neon-purple-text">McAlpin</span>
            </div>
          </Link>
        </motion.div>

        <motion.div className="footer__social" variants={itemVariants}>
          <h3 className="footer__heading">Connect</h3>
          <ul className="footer__social-list">
            {socialLinks.map((link) => (
              <li key={link.platform} className="footer__social-item">
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={link.label}
                >
                  <i className={`footer__social-icon icon-${link.icon}`}></i>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer__bottom" variants={itemVariants}>
        <div className="footer__copyright">
          &copy; {currentYear} Jason McAlpin. All rights reserved.
        </div>
        <div className="footer__credits">
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
