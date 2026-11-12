import TagManager from 'react-gtm-module';
import { hasConsentedTo } from '../components/global/CookieConsent/consentUtils';

let initialized = false;

/** GTM is never injected by index.html; this is its only initialization boundary. */
export function initializeAnalytics(): boolean {
  if (initialized || !hasConsentedTo('analytics')) return false;
  const gtmId = import.meta.env.VITE_GTM_ID?.trim();
  if (!gtmId) return false;
  TagManager.initialize({ gtmId });
  initialized = true;
  return true;
}
