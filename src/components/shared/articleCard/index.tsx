import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Article } from '../../../store/slices/articlesSlice';
import './styles.scss';

interface ArticleCardProps {
  article: Article;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  const delay = index * 0.1;
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className="article-card highlight-outline"
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
    >
      <div className="article-card__image-container">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="article-card__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const container = target.parentElement;
            if (container) {
              container.style.backgroundColor = '#1E1E1E';
              container.style.display = 'flex';
              container.style.alignItems = 'center';
              container.style.justifyContent = 'center';
              
              const placeholder = document.createElement('div');
              placeholder.textContent = article.title;
              placeholder.style.color = '#9D00FF';
              placeholder.style.fontWeight = 'bold';
              placeholder.style.textAlign = 'center';
              placeholder.style.padding = '2rem';
              
              container.appendChild(placeholder);
            }
          }}
        />
      </div>
      
      <div className="article-card__content">
        <div className="article-card__meta">
          <span className="article-card__date">{formatDate(article.date)}</span>
          <span className="article-card__reading-time">{article.readingTime} min read</span>
        </div>
        
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__excerpt">{article.excerpt}</p>
        
        <div className="article-card__tags">
          {article.tags.map((tag, i) => (
            <span key={i} className="article-card__tag">
              {tag}
            </span>
          ))}
        </div>
        
        <Link 
          to={`/articles/${article.slug}`} 
          className="article-card__link"
          aria-label={`Read ${article.title}`}
        >
          Read Article
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
