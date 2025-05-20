import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SocialLink } from '../../types';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.scss';

const Contact = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await fetch('/data/social.json');
        if (!response.ok) {
          throw new Error('Failed to fetch social links');
        }
        const data = await response.json();
        setSocialLinks(data as SocialLink[]);
      } catch (error) {
        console.error('Error fetching social links:', error);
      }
    };
    
    fetchSocialLinks();
  }, []);

  return (
    <div className="contact">
      <section className="contact-hero">
        <div className="contact-hero__container">
          <h1 className="contact-hero__title">Get In Touch</h1>
          <p className="contact-hero__subtitle">
            Connect with me through social media or send me a message
          </p>
        </div>
      </section>
      
      <section className="contact-content">
        <div className="section-container">
          <div className="contact-content__grid">
            <motion.div 
              className="contact-social"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h2 className="section-title" variants={fadeInUp}>
                Connect With Me
              </motion.h2>
              
              <motion.p className="contact-social__text" variants={fadeInUp}>
                Feel free to reach out through any of these platforms. I'm always open to discussing new projects, 
                creative ideas, or opportunities to be part of your vision.
              </motion.p>
              
              <motion.ul className="contact-social__list" variants={staggerContainer}>
                {socialLinks.map((link, index) => (
                  <motion.li 
                    key={link.platform} 
                    className="contact-social__item"
                    variants={fadeInUp}
                    custom={index}
                  >
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`contact-social__link contact-social__link--${link.platform}`}
                      aria-label={link.label}
                    >
                      <span className="contact-social__icon">
                      <img 
                        src={link.icon} 
                        alt={`${link.label} icon`}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      </span>
                      <div className="contact-social__info">
                        <span className="contact-social__platform">{link.label}</span>
                        <span className="contact-social__username">{link.linkText}</span>
                      </div>
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            

            <motion.div 
              className="contact-info"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h2 className="section-title" variants={fadeInUp}>
                Contact Information
              </motion.h2>
              
              <motion.div className="contact-info__content" variants={fadeInUp}>
                <div className="contact-info__card">
                  <div className="contact-info__card-inner">
                    <div className="contact-info__card-front">
                      <div className="contact-info__logo">
                        <span className="neon-text">Jason McAlpin</span>
                      </div>
                      <div className="contact-info__title">Full Stack Developer</div>
                      <div className="contact-info__pattern"></div>
                    </div>
                    
                    <div className="contact-info__card-back">
                      <ul className="contact-info__list">
                        <li className="contact-info__item contact-info__item--email">
                          <span className="contact-info__label">Email</span>
                          <span className="contact-info__value">contact@jasonmcalpin.com</span>
                        </li>
                        <li className="contact-info__item contact-info__item--location">
                          <span className="contact-info__label">Location</span>
                          <span className="contact-info__value">Atlanta, GA</span>
                        </li>
                        <li className="contact-info__item contact-info__item--availability">
                          <span className="contact-info__label">Availability</span>
                          <span className="contact-info__value">Open to opportunities</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="contact-info__note">
                  <span className="contact-info__note-icon">ℹ️</span>
                  <span>Hover over the card to see contact details</span>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="contact-faq">
        <div className="section-container">
          <motion.h2 
            className="section-title text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="contact-faq__grid">
            <motion.div 
              className="contact-faq__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="contact-faq__question">What services do you offer?</h3>
              <p className="contact-faq__answer">
                I offer full-stack web development services, including frontend development with React, 
                backend development with Node.js, Next.js and database design. I can help with everything from 
                building a complete web application to improving specific aspects of your existing project.
              </p>
            </motion.div>
            
            <motion.div 
              className="contact-faq__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="contact-faq__question">How do you handle project pricing?</h3>
              <p className="contact-faq__answer">
                Project pricing depends on the scope, complexity, and timeline. I offer both hourly rates 
                and fixed-price quotes based on detailed project requirements. I'm happy to discuss your 
                specific needs and provide a transparent pricing structure.
              </p>
            </motion.div>
            
            <motion.div 
              className="contact-faq__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="contact-faq__question">What is your typical project process?</h3>
              <p className="contact-faq__answer">
                My process typically includes an initial consultation, requirements gathering, design approval, 
                development, testing, and deployment. I maintain clear communication throughout and provide 
                regular updates on progress. After launch, I also offer maintenance and support services.
              </p>
            </motion.div>
            
            <motion.div 
              className="contact-faq__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="contact-faq__question">Are you available for remote work?</h3>
              <p className="contact-faq__answer">
                Yes, I work remotely with clients from around the world. I use collaborative tools to 
                maintain effective communication and ensure project success regardless of location. I'm 
                flexible with scheduling meetings across different time zones.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
