import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/global/SEO';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer, neonFlicker } from '../../utils/animations';
import './styles.css';

const NotFound = () => {
  const [contentRef, contentControls] = useScrollAnimation();

  return (
    <div className="not-found">
      <SEO 
        title="404 - Page Not Found"
        description="The page you are looking for does not exist."
        canonical="/404"
      />
      
      <motion.div 
        className="not-found__container"
        ref={contentRef}
        initial="hidden"
        animate={contentControls}
        variants={staggerContainer}
      >
        <motion.div className="not-found__content" variants={fadeInUp}>
          <motion.h1 
            className="not-found__title"
            variants={neonFlicker}
            initial="hidden"
            animate="visible"
          >
            404
          </motion.h1>
          
          <motion.h2 className="not-found__subtitle" variants={fadeInUp}>
            Page Not Found
          </motion.h2>
          
          <motion.p className="not-found__text" variants={fadeInUp}>
            The page you are looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div className="not-found__actions" variants={fadeInUp}>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
            

          </motion.div>
        </motion.div>
        
        <motion.div 
          className="not-found__visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, delay: 0.2 }
          }}
        >
          <div className="not-found__grid">
            <div className="not-found__grid-item not-found__grid-item--1"></div>
            <div className="not-found__grid-item not-found__grid-item--2"></div>
            <div className="not-found__grid-item not-found__grid-item--3"></div>
            <div className="not-found__grid-item not-found__grid-item--4"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
