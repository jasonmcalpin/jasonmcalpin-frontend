/**
 * Assorted icons used throughout the site.
 * Provides three variants:
 *  - InlineIcon: just the icon
 *  - PreIcon: icon before children
 *  - PostIcon: icon after children
 */
import type { iconProps } from '@/types';
import type { PropsWithChildren } from 'react';

type Weight = 'solid' | 'regular' | 'brands';

type InlineIconProps = iconProps;

type PrePostIconProps = PropsWithChildren<iconProps> & {
  iconClassName?: string; 
};

const setWeightClass = (weight: Weight) => {
  switch (weight) {
    case 'regular':
      return 'fa-regular';
    case 'brands':
      return 'fa-brands';
    case 'solid':
    default:
      return 'fa-solid';
  }
};

export const InlineIcon = ({ iconName, weight = 'solid', className }: InlineIconProps) => {
  const classes = ['fa-icon', className].filter(Boolean).join(' ');
  return (
    <span className={classes} aria-hidden='true'>
      <i className={`${setWeightClass(weight)} fa-${iconName}`}></i>
    </span>
  );
};

export const PreIcon = ({ iconName, weight = 'solid', className, iconClassName, children }: PrePostIconProps) => {
  const container = ['inline-flex', 'items-center', className].filter(Boolean).join(' ');
  const iconClasses = ['mr-1', iconClassName].filter(Boolean).join(' ');
  return (
    <span className={container}>
      <InlineIcon iconName={iconName} weight={weight} className={iconClasses} />
      {children}
    </span>
  );
};

export const PostIcon = ({ iconName, weight = 'solid', className, iconClassName, children }: PrePostIconProps) => {
  const container = ['inline-flex', 'items-center', className].filter(Boolean).join(' ');
  const iconClasses = ['ml-1', iconClassName].filter(Boolean).join(' ');
  return (
    <span className={container}>
      {children}
      <InlineIcon iconName={iconName} weight={weight} className={iconClasses} />
    </span>
  );
};

export default InlineIcon;