import { useEffect, lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import Header from './components/header';
import Footer from './components/footer';

// Lazy load page components
const Home = lazy(() => import('./pages/home'));
const About = lazy(() => import('./pages/about'));
const Contact = lazy(() => import('./pages/contact'));
const Projects = lazy(() => import('./pages/projects'));
const Articles = lazy(() => import('./pages/articles'));
const ArticlePage = lazy(() => import('./pages/articles/article'));
const ProjectPage = lazy(() => import('./pages/projects/project'));

// Lazy load game components
const IntroScreen = lazy(() => import('./components/survival-game/IntroScreen'));
const GameScreen = lazy(() => import('./components/survival-game/GameScreen'));
const LoseScreen = lazy(() => import('./components/survival-game/LoseScreen'));
const FactionWinScreen = lazy(() => import('./components/survival-game/FactionWinScreen'));
const WinScreen = lazy(() => import('./components/survival-game/WinScreen'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <ScrollToTop />
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
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:slug" element={<ArticlePage key={window.location.pathname} />} />
                  <Route path="/projects/:slug" element={<ProjectPage key={window.location.pathname} />} />
                  <Route path="/projects/route-66/" element={<IntroScreen />} />
                  <Route path="/projects/route-66/game" element={<GameScreen />} />
                  <Route path="/projects/route-66/lose" element={<LoseScreen />} />
                  <Route path="/projects/route-66/faction-win" element={<FactionWinScreen />} />
                  <Route path="/projects/route-66/win" element={<WinScreen />} />
                  {/* Add more routes as needed */}
                </Routes>
              </Suspense>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
        </Router>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
