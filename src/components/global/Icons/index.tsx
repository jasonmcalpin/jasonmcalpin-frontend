/**
 * Small, dependency-free SVG icon vocabulary used by the website.
 *
 * These shapes are presentation code, not icon-font or third-party runtime data.
 * SVG uses currentColor so existing Tailwind/text utility classes still apply.
 * Any new icon should be added intentionally instead of pulling in a font pack.
 */
import type { PropsWithChildren, ReactNode } from 'react';
import type { iconProps } from '@/types';
import './styles.css';

type InlineIconProps = iconProps;
type PrePostIconProps = PropsWithChildren<iconProps> & { iconClassName?: string };

const glyph = (name: string): ReactNode => {
  switch (name) {
    case 'angle-right':
      return <path d="m9 18 6-6-6-6" />;
    case 'calendar-days':
      return <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>;
    case 'clock':
      return <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>;
    case 'link':
      return <><path d="m10 13 4-4" /><path d="M8 16H7a4 4 0 0 1 0-8h3M16 8h1a4 4 0 0 1 0 8h-3" /></>;
    case 'envelope':
      return <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></>;
    case 'location-dot':
      return <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>;
    case 'building':
      return <><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 21v-4h6v4M8 7h1M15 7h1M8 11h1M15 11h1" /></>;
    case 'gauge-high':
      return <><path d="M4.9 19a9 9 0 1 1 14.2 0" /><path d="m12 13 4-5" /><circle cx="12" cy="13" r="1" /></>;
    case 'github':
      return <path fill="currentColor" stroke="none" d="M12 .6a11.4 11.4 0 0 0-3.6 22.2c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.6-1.2-1.6-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.2.4-2.2 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.1 1.2a10.8 10.8 0 0 1 5.6 0c2.1-1.5 3.1-1.2 3.1-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.1 0 4.4-2.8 5.4-5.4 5.7.4.4.7 1 .7 2v3c0 .3.2.7.8.6A11.4 11.4 0 0 0 12 .6Z" />;
    default:
      // Fail visibly in development rather than introducing an icon font.
      if (import.meta.env.DEV) console.warn('Unknown SVG icon:', name);
      return <circle cx="12" cy="12" r="9" />;
  }
};

export const InlineIcon = ({ iconName, className }: InlineIconProps) => {
  return (
    <span className={['site-icon', className].filter(Boolean).join(' ')} aria-hidden="true">
      <svg className="site-icon__svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        focusable="false" aria-hidden="true">
        {glyph(iconName)}
      </svg>
    </span>
  );
};

export const PreIcon = ({ iconClassName, children, className, ...props }: PrePostIconProps) => (
  <span className={['inline-flex', 'items-center', className].filter(Boolean).join(' ')}>
    <InlineIcon {...props} className={['mr-1', iconClassName].filter(Boolean).join(' ')} />
    {children}
  </span>
);

export const PostIcon = ({ iconClassName, children, className, ...props }: PrePostIconProps) => (
  <span className={['inline-flex', 'items-center', className].filter(Boolean).join(' ')}>
    {children}
    <InlineIcon {...props} className={['ml-1', iconClassName].filter(Boolean).join(' ')} />
  </span>
);

export default InlineIcon;
