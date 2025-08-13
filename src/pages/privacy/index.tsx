import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils/animations';
import Hero from '../../components/global/Hero';
import './styles.css';

const Privacy = () => {
  return (
    <div className='privacy'>
      <Hero 
        heroTitle='Privacy Policy'
        heroSubtitle='How we handle your data and respect your privacy'
        heroImage='/assets/images/contact-bg.jpg'
      />
      
      
      <section className='privacy-content'>
        <div className='section-container'>
          <motion.div 
            className='privacy-content__wrapper'
            variants={fadeInUp}
            initial='hidden'
            animate='visible'
          >
            <h2>Introduction</h2>
            <p>
              This Privacy Policy explains how Jason McAlpin collects, uses, and protects 
              your personal information when you visit jasonmcalpin.com ('the Website').
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We collect the following types of information:
            </p>
            <ul>
              <li>
                <strong>Local Storage Data:</strong> We use browser local storage to enhance your experience by 
                remembering your preferences, saving game states in interactive features, and storing conversation 
                history in AI-enabled pages (coming soon).
              </li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>
              We use the collected information for the following purposes:
            </p>
            <ul>
              <li>To send you newsletters and updates if you've subscribed</li>
              <li>To improve your browsing experience on our website</li>
              <li>To remember your preferences</li>
              <li>To save your progress in interactive games</li>
              <li>To maintain conversation context in AI-enabled features (coming soon)</li>
            </ul>
            <p>
              <strong>Important:</strong> All game states, preferences, and AI conversation data are stored 
              exclusively in your browser's local storage. This data remains on your device and is not 
              transmitted to or stored on our servers.
            </p>
            
            <h2>Cookie Policy</h2>
            <p>
              This website uses local storage, which functions similarly to cookies, to enhance your experience. 
              You can choose to accept or decline the use of non-essential storage when visiting the website.
            </p>
            <p>
              Unlike traditional cookies, our localStorage implementation keeps your data entirely on your device:
            </p>
            <ul>
              <li>Game progress is saved locally to allow you to continue where you left off</li>
              <li>Site preferences are stored to maintain your customized experience</li>
              <li>AI conversation history (coming soon) will be stored locally to provide context for ongoing interactions</li>
            </ul>
            <p>
              This approach enhances your privacy by keeping your data under your control. You can clear this data 
              at any time by clearing your browser's local storage or site data.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Under the General Data Protection Regulation (GDPR), you have the following rights:
            </p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
            
            <h2>Data Retention</h2>
            <p>
              We retain your email address for newsletter subscriptions until you unsubscribe. 
              Local storage data (including preferences, game states, and AI conversation history) 
              is retained in your browser until you clear your browser data or revoke consent. 
              This data is not backed up on our servers and will be lost if you clear your browser data.
            </p>
            
            <h2>Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact me at:
              contact@jasonmcalpin.com
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version will always be 
              available on this page.
            </p>
            
            <p className='privacy-content__last-updated'>
              Last updated: May 20, 2025
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
