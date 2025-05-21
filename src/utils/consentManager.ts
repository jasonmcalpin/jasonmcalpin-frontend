import { hasUserConsented, hasConsentedTo } from '../components/shared/CookieConsent';

/**
 * Check if the user has given consent for cookies/localStorage
 * @returns boolean indicating if consent has been given
 */
export const hasUserConsent = (): boolean => {
  return hasUserConsented();
};

/**
 * Safe version of localStorage that respects user consent
 */
export const safeStorage = {
  getItem: (key: string): string | null => {
    if (hasUserConsent()) {
      return localStorage.getItem(key);
    }
    return null;
  },
  
  setItem: (key: string, value: string): boolean => {
    if (hasUserConsent()) {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  },
  
  removeItem: (key: string): boolean => {
    if (hasUserConsent()) {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  }
};

/**
 * Check if the user has consented to a specific type of storage
 * @param option The consent option to check (preferences, analytics)
 * @returns boolean indicating if consent has been given for the option
 */
export const hasConsentFor = (option: 'preferences' | 'analytics'): boolean => {
  return hasConsentedTo(option);
};
