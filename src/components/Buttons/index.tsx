import { Link, useLocation } from 'react-router-dom';
import type { ChoiceButton } from '../../types';

export const Button: React.FC<ChoiceButton> = ({ path, children, type, additionalClasses }) => {
    const location = useLocation();

    const isActive = location.pathname === path;

    let typeClass = additionalClasses ? ' ' + additionalClasses : '';
    if (isActive) {
      /**
       * this is a placeholder for if active states are needed. this would probably change the other colors and  replace hover color.
       */
        // typeClass = 'btn-active ';
    }

    switch (type) {
        case 'primary':
            typeClass += 'bg-primary text-white hover:bg-primary-light';
            break;
        case 'secondary':
            typeClass += 'bg-secondary text-white hover:bg-secondary-light';
            break;
        case 'outline':
            typeClass += 'border border-neon-blue text-neon-blue hover:bg-neon-blue/10 shadow-[var(--shadow-neon-blue)]';
            break;
        default:
            break;
    }

    return (
        <Link to={path} className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${typeClass}`}>
            {children}
        </Link>
    );
}


