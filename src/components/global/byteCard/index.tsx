import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Byte } from '@/store/slices/bytesSlice';
import OptimizedImage from '../OptimizedImage';
import { InlineIcon } from '@/components/global/Icons';
import './styles.css';

interface ByteCardProps {
  byte: Byte;
  index: number;
}

const ByteCard: React.FC<ByteCardProps> = ({ byte, index }) => {
  const delay = index * 0.1;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className='byte-card highlight-outline bg-background-light rounded-lg overflow-hidden transition-all duration-300'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          delay 
        }
      }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      role='article'
      aria-labelledby={`byte-title-${byte.id}`}
    >
      <div className='byte-card__image-container relative w-full h-48 overflow-hidden'>
        <OptimizedImage 
          src={byte.imageUrl} 
          alt={byte.title} 
          className='byte-card__image w-full h-full object-cover transition-transform duration-500'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>
      
      <div className='byte-card__content p-6'>
        <div className='byte-card__meta flex justify-between text-xs text-gray-400 mb-3' aria-label='Article metadata'>
          <span className='byte-card__date flex items-center' aria-label='Publication date'>
            <InlineIcon iconName='calendar-days' />
            {formatDate(byte.date)}
          </span>
          <span className='byte-card__reading-time flex items-center' aria-label='Reading time'>
            <InlineIcon iconName='clock' />
            {byte.readingTime} min read
          </span>
        </div>
        
        <h3 id={`byte-title-${byte.id}`} className='byte-card__title text-xl font-heading font-bold mb-2 text-white'>{byte.title}</h3>
        <p className='byte-card__excerpt text-gray-300 mb-4 line-clamp-3'>{byte.excerpt}</p>
        
        <div className='byte-card__tags flex flex-wrap gap-2 mb-4' role='list' aria-label='Article tags'>
          {byte.tags.map((tag, i) => (
            <span key={i} className='byte-card__tag bg-primary-dark text-white text-xs py-1 px-2 rounded-full' role='listitem'>
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/bytes/${byte.slug}`} 
          className='byte-card__link inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded transition-all duration-300 bg-neon-purple text-white hover:bg-purple-700 mt-2'
          aria-label={`Read ${byte.title}`}
        >
          Take A Byte <span className='fa-icon' aria-hidden='true'><i className='fa-solid fa-angle-right'></i></span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ByteCard;
