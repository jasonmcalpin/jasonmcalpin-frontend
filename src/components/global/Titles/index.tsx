import { motion } from 'framer-motion';
import './styles.css';
import { fadeInUp } from '../../../utils/animations';
import { Link } from 'react-router-dom';
import type { TitleProps, LinkTitleProps } from '../../../types';

const FlatTitle = ({ children }: TitleProps) => {
  return (
    <h2 className='title'>
      {children}
    </h2>
  );
};

const MotionTitle = ({ children }: TitleProps) => {
  return (
    <motion.h2 className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white' variants={fadeInUp}>
      {children}
    </motion.h2>
  );
};

const LinkTitle = ({ children, link, linkText }: LinkTitleProps) => {
  return (
    <motion.div className='section-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12' variants={fadeInUp}>
      <h2 className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white'>{children}</h2>
      <Link to={link ? link : '#'} className='section-link text-neon-blue hover:text-blue-400 transition-colors duration-300 flex items-center mt-4 sm:mt-0'>
        {linkText ? linkText : 'View More'}
        <span className='fa-icon ml-2' aria-hidden='true'><i className='fa-solid fa-angle-right text-xs'></i></span>
      </Link>
    </motion.div>
  );
};

const CenterTitle = ({ children }: TitleProps) => {
  return (
    <motion.h2
      className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white text-center'
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );
};

export { FlatTitle, MotionTitle, LinkTitle, CenterTitle };
