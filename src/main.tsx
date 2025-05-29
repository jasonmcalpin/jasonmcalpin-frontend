import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import TagManager from 'react-gtm-module';
import { hasConsentedTo } from './components/shared/CookieConsent';
import { checkGTMInitialization } from './utils/gtmDebugger';

// Initialize GTM if user has consented to analytics and GTM ID is available
if (hasConsentedTo('analytics')) {
  const tagManagerArgs = {
    gtmId: import.meta.env.VITE_GTM_ID || '',
  };

  if (tagManagerArgs.gtmId) {
    console.log('Initializing GTM with ID:', tagManagerArgs.gtmId);
    TagManager.initialize(tagManagerArgs);

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
