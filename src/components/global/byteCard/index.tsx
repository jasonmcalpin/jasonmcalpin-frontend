import { Link } from 'react-router-dom';
import type { Byte } from '@/store/slices/bytesSlice';
import OptimizedImage from '../OptimizedImage';
import './styles.css';

interface ByteCardProps { byte: Byte; index: number; }

export default function ByteCard({ byte }: ByteCardProps) {
  const published = new Date(byte.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  return <article className="consulting-writing-card">
    {byte.imageUrl && <div className="consulting-writing-card__image"><OptimizedImage src={byte.imageUrl}
      alt={byte.title} sizes="(max-width: 768px) 100vw, 50vw" /></div>}
    <div className="consulting-writing-card__body">
      <p className="consulting-project-card__category">{published} · {byte.readingTime} min read</p>
      <h3><Link to={'/bytes/' + byte.slug}>{byte.title}</Link></h3>
      <p>{byte.excerpt}</p>
      <Link to={'/bytes/' + byte.slug} className="consulting-text-link">Read article →</Link>
    </div>
  </article>;
}
