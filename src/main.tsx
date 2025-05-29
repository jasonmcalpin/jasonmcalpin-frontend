import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import TagManager from 'react-gtm-module';
import { hasConsentedTo } from './components/shared/CookieConsent';
import { checkGTMInitialization } from './utils/gtmDebugger';

// Debug logs to help troubleshoot GTM initialization
console.log('Analytics consent status:', hasConsentedTo('analytics'));
console.log('Environment GTM ID:', import.meta.env.VITE_GTM_ID || 'Not set');

// Initialize GTM if user has consented to analytics and GTM ID is available
if (hasConsentedTo('analytics')) {
  const tagManagerArgs = {
    gtmId: import.meta.env.VITE_GTM_ID || '',
  };

  // Only initialize if GTM ID is available
  if (tagManagerArgs.gtmId) {
    console.log('Initializing GTM with ID:', tagManagerArgs.gtmId);
    TagManager.initialize(tagManagerArgs);

    // Check if GTM was successfully initialized after a short delay
    setTimeout(() => {
      checkGTMInitialization();
    }, 1000);
  } else {
    console.log('GTM initialization skipped: No GTM ID available');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
