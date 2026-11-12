import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/consulting.css';
import App from './App.tsx';
import { initializeAnalytics } from './services/analytics';
import { initializeReveals } from './services/reveals';

// Initialize only for an existing, explicit analytics opt-in. New consent is handled by App.
initializeAnalytics();
initializeReveals();

const head = createHead();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
  </StrictMode>
);
