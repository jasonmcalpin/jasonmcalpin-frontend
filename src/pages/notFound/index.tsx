import { Link } from 'react-router-dom';
import SEO from '../../components/global/SEO';
import './styles.css';

const NotFound = () => {

  return (
    <div className='not-found'>
      <SEO 
        title='404 - Page Not Found'
        description='The page you are looking for does not exist.'
        canonical='/404'
      />
      
      <div 
        className='not-found__container'
        
        
        
        
       data-reveal="viewport">
        <div className='not-found__content'  data-reveal="viewport">
          <h1 
            className='not-found__title'
            
            
            
           data-reveal="viewport">
            404
          </h1>
          
          <h2 className='not-found__subtitle'  data-reveal="viewport">
            Page Not Found
          </h2>
          
          <p className='not-found__text'  data-reveal="viewport">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className='not-found__actions'  data-reveal="viewport">
            <Link to='/' className='btn btn-primary'>
              Back to Home
            </Link>
            

          </div>
        </div>
        
        <div 
          className='not-found__visual'
          
          
         data-reveal="scale">
          <div className='not-found__grid'>
            <div className='not-found__grid-item not-found__grid-item--1'></div>
            <div className='not-found__grid-item not-found__grid-item--2'></div>
            <div className='not-found__grid-item not-found__grid-item--3'></div>
            <div className='not-found__grid-item not-found__grid-item--4'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
