import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TagManager from 'react-gtm-module'
import { hasConsentedTo } from './components/shared/CookieConsent'

// Initialize GTM if user has consented to analytics and GTM ID is not the placeholder
// The placeholder will be replaced with the actual GTM ID during production build
if (hasConsentedTo('analytics')) {
  const tagManagerArgs = {
    gtmId: '__GTM_ID_PLACEHOLDER__'
  }
  
  // Only initialize if GTM ID is not the placeholder (i.e., in production)
  if (tagManagerArgs.gtmId !== '__GTM_ID_PLACEHOLDER__') {
    TagManager.initialize(tagManagerArgs)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
