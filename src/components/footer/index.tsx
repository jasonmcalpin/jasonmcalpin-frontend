import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './styles.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
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
              <span className="neon-text">Jason McAlpin</span>
            </div>
          </Link>
        </motion.div>

        <motion.div className="footer__links" variants={itemVariants}>
          <ul className="footer__link-list">
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer__bottom" variants={itemVariants}>
        <div className="footer__copyright">
          &copy; {currentYear} Jason McAlpin. All rights reserved.
        </div>
        <div className="footer__credits">Built with React, TypeScript, and Tailwind CSS</div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
