import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Byte } from '../../../store/slices/bytesSlice';
import OptimizedImage from '../OptimizedImage';
import './styles.scss';

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
      className="byte-card highlight-outline"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          delay 
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      role="article"
      aria-labelledby={`byte-title-${byte.id}`}
    >
      <div className="byte-card__image-container">
        <OptimizedImage 
          src={byte.imageUrl} 
          alt={byte.title} 
          className="byte-card__image"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="byte-card__content">
        <div className="byte-card__meta" aria-label="Article metadata">
          <span className="byte-card__date" aria-label="Publication date">{formatDate(byte.date)}</span>
          <span className="byte-card__reading-time" aria-label="Reading time">{byte.readingTime} min read</span>
        </div>
        
        <h3 id={`byte-title-${byte.id}`} className="byte-card__title">{byte.title}</h3>
        <p className="byte-card__excerpt">{byte.excerpt}</p>
        
        <div className="byte-card__tags" role="list" aria-label="Article tags">
          {byte.tags.map((tag, i) => (
            <span key={i} className="byte-card__tag" role="listitem">
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/bytes/${byte.slug}`} 
          className="byte-card__link"
          aria-label={`Read ${byte.title}`}
        >
          Take A Byte
        </Link>
      </div>
    </motion.div>
  );
};

export default ByteCard;
