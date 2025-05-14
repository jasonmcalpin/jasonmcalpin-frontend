import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { store } from './store';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Projects from './pages/projects';
import Articles from './pages/articles';
import ArticlePage from './pages/articles/article';
import ProjectPage from './pages/projects/project';

import IntroScreen from './components/survival-game/IntroScreen';
import GameScreen from './components/survival-game/GameScreen';
import LoseScreen from './components/survival-game/LoseScreen';
import FactionWinScreen from './components/survival-game/FactionWinScreen';
import WinScreen from './components/survival-game/WinScreen';

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
