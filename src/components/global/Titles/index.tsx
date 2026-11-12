import './styles.css';
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
    <h2 className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white'  data-reveal="viewport">
      {children}
    </h2>
  );
};

const LinkTitle = ({ children, link, linkText }: LinkTitleProps) => {
  return (
    <div className='section-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12'  data-reveal="viewport">
      <h2 className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white'>{children}</h2>
      <Link to={link ? link : '#'} className='section-link text-neon-blue hover:text-blue-400 transition-colors duration-300 flex items-center mt-4 sm:mt-0'>
        {linkText ? linkText : 'View More'}
        <span className='fa-icon ml-2' aria-hidden='true'><i className='fa-solid fa-angle-right text-xs'></i></span>
      </Link>
    </div>
  );
};

const CenterTitle = ({ children }: TitleProps) => {
  return (
    <h2
      className='section-title text-3xl md:text-4xl font-heading font-bold mb-12 text-white text-center'
      
      
      
      
     data-reveal="viewport">
      {children}
    </h2>
  );
};

export { FlatTitle, MotionTitle, LinkTitle, CenterTitle };
