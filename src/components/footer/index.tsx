import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer
      className='bg-background-dark text-white py-4 mt-4'
      
      
      
      
     data-reveal="viewport">
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='flex flex-col'  data-reveal="viewport">
          <Link to='/' className='inline-flex no-underline mb-4'>
            <div className='text-2xl font-heading font-bold'>
              <span className='neon-text mr-1'>Jason McAlpin</span>
            </div>
          </Link>
        </div>

        <div className='flex flex-col'  data-reveal="viewport">
          <h2
            className='text-lg font-heading font-semibold mb-4 text-neonBlue'
            style={{
              textShadow: '0 0 5px var(--color-neonBlue)',
            }}
          >
            Links
          </h2>
          <ul className='list-none p-0 m-0 space-y-3'>
            <li className='flex items-center'>
              <Link
                to='/privacy'
                className='text-white hover:text-neonBlue transition-colors duration-300'
              >
                <span className='mr-2 text-secondary'>{'>'}</span>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 mt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center'
        
       data-reveal="viewport">
        <div className='text-sm text-gray-400 mb-2 md:mb-0'>
          &copy; {currentYear} Jason McAlpin. All rights reserved.
        </div>
        <div className='text-sm text-gray-400'>
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </footer>
  );
};

export default Footer;