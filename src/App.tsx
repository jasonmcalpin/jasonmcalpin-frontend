import { lazy, Suspense, useEffect, useState } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';

import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import Header from './components/header';
import Footer from './components/footer';
import {CookieConsent } from './components/global/CookieConsent';
import { ConsentOptions } from './components/global/CookieConsent/consentUtils';
import ScrollToTop from './components/scrollToTop';
import GTMTester from './components/global/GTMTester';

const Home = lazy(() => import('./pages/home'));
const Privacy = lazy(() => import('./pages/privacy'));
const About = lazy(() => import('./pages/about'));
const Contact = lazy(() => import('./pages/contact'));
const Projects = lazy(() => import('./pages/projects'));
const Bytes = lazy(() => import('./pages/bytes'));
const BytePage = lazy(() => import('./pages/bytes/byte'));
const ProjectPage = lazy(() => import('./pages/projects/project'));
const NotFound = lazy(() => import('./pages/notFound'));

// Game components
const IntroScreen = lazy(() => import('./components/survival-game/IntroScreen'));
const GameScreen = lazy(() => import('./components/survival-game/GameScreen'));
const LoseScreen = lazy(() => import('./components/survival-game/LoseScreen'));
const FactionWinScreen = lazy(() => import('./components/survival-game/FactionWinScreen'));
const WinScreen = lazy(() => import('./components/survival-game/WinScreen'));

// Lessons and training
const Lessons = lazy(() => import('./pages/lessons'));
const EDALesson = lazy(() => import('./pages/lessons/eda'));
const LLMBuildingLesson = lazy(() => import('./pages/lessons/llm-building'));

const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Component to detect query parameters
const QueryParamDetector = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [showGTMTester, setShowGTMTester] = useState(false);

  useEffect(() => {
    // Check for debug parameter
    const params = new URLSearchParams(location.search);
    setShowGTMTester(import.meta.env.DEV || params.has('debug') || params.has('gtm_debug'));
  }, [location]);

  return (
    <>
      {children}
      <GTMTester isVisible={showGTMTester} />
    </>
  );45
};

function App() {
  const handleAcceptConsent = (options: ConsentOptions) => {
    console.log('User has provided consent with options:', options);
    // GTM initialization is now handled in main.tsx
  };

  const handleDeclineConsent = () => {
    console.log('User has declined consent');
  };

  return (
    <Provider store={store}>
      
        <Router>
          <ScrollToTop />
          <QueryParamDetector>
            <div className="app">
              <Header />
              <main className="main">
                <AnimatePresence mode="wait">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/bytes" element={<Bytes />} />
                      <Route
                        path="/bytes/:slug"
                        element={<BytePage key={window.location.pathname} />}
                      />
                      <Route
                        path="/projects/:slug"
                        element={<ProjectPage key={window.location.pathname} />}
                      />
                      <Route path="/projects/route-66/" element={<IntroScreen />} />
                      <Route path="/projects/route-66/game" element={<GameScreen />} />
                      <Route path="/projects/route-66/lose" element={<LoseScreen />} />
                      <Route path="/projects/route-66/faction-win" element={<FactionWinScreen />} />
                      <Route path="/projects/route-66/win" element={<WinScreen />} />
                      <Route path="/privacy-policy" element={<Privacy />} />
                      <Route path="*" element={<NotFound />} />

                      <Route path="/lessons" element={<Lessons />} />
                      <Route path="/lessons/eda" element={<EDALesson />} />
                      <Route path="/lessons/llm-building" element={<LLMBuildingLesson />} />

                      <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                  </Suspense>
                </AnimatePresence>
              </main>
              <Footer />
              <CookieConsent
                policyVersion="1.0.0"
                onAccept={handleAcceptConsent}
                onDecline={handleDeclineConsent}
              />
            </div>
          </QueryParamDetector>
        </Router>
    
    </Provider>
  );
}

export default App;
