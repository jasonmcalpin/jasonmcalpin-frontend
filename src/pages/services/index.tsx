import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import SEO from '../../components/global/SEO';
import Hero from '../../components/global/Hero';
import { MotionTitle } from '../../components/global/Titles';
import './styles.css';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface Technology {
  name: string;
  category: string;
}

const Services = () => {
  const [introRef, introControls] = useScrollAnimation();
  const [servicesRef, servicesControls] = useScrollAnimation();
  const [techRef, techControls] = useScrollAnimation();
  const [pricingRef, pricingControls] = useScrollAnimation();
  const [ctaRef, ctaControls] = useScrollAnimation();

  const seoDescription = "Professional software development and consulting services. Full-stack development, WordPress expertise, AI/ML integration, performance optimization, and technical consulting. Available for contract and project-based work.";

  const services: Service[] = [
    {
      title: 'Full-Stack Development',
      icon: '💻',
      description: 'End-to-end web application development with modern frameworks and best practices.',
      features: [
        'React, Next.js, TypeScript application development',
        'Node.js backend and RESTful API development',
        'Python (Django/Flask) applications',
        'Database design and optimization (MySQL, PostgreSQL, MongoDB)',
        'React Native mobile applications'
      ]
    },
    {
      title: 'WordPress Development & Optimization',
      icon: '⚡',
      description: 'Enterprise-grade WordPress solutions backed by Fortune 500 experience.',
      features: [
        'Enterprise WordPress implementation',
        'Custom plugin and theme development',
        'Performance optimization and security hardening',
        'WordPress migration and modernization',
        'Integration with modern tech stacks'
      ]
    },
    {
      title: 'AI/ML Integration',
      icon: '🤖',
      description: 'Leverage the power of AI to transform your applications and workflows.',
      features: [
        'LLM integration (OpenAI, Claude, local models)',
        'AI-powered application development',
        'Prompt engineering and optimization',
        'Custom AI tooling and automation',
        'RAG (Retrieval-Augmented Generation) systems'
      ]
    },
    {
      title: 'Performance Optimization',
      icon: '🚀',
      description: 'Make your applications faster, more efficient, and more scalable.',
      features: [
        'Application performance audits',
        'Database query optimization',
        'Frontend performance (code splitting, lazy loading)',
        'Scalability consulting',
        'Cloud infrastructure optimization (AWS)'
      ]
    },
    {
      title: 'Technical Consulting & Code Reviews',
      icon: '🎯',
      description: 'Strategic technical guidance from a senior engineer with 15+ years of experience.',
      features: [
        'Architecture design and review',
        'Code quality assessments',
        'Technology stack recommendations',
        'Team mentoring and training',
        'Best practices implementation'
      ]
    },
    {
      title: 'Team Development & Technical Training',
      icon: '👥',
      description: 'Empowering teams through tailored training and development programs.',
      features: [
        'Technical workshops on React, Git, Node.js, and AI/ML',
        'Code review training and best practices implementation',
        'One-on-one mentoring for junior and mid-level engineers',
        'Pair programming and knowledge transfer sessions',
        'Building technical learning culture and internal communities'
      ]
    }
  ];

  const technologies: Technology[] = [
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'Django', category: 'Backend' },
    { name: 'Flask', category: 'Backend' },
    { name: 'WordPress', category: 'CMS' },
    { name: 'MySQL', category: 'Database' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'LangChain', category: 'AI/ML' },
    { name: 'LangGraph', category: 'AI/ML' },
    { name: 'OpenAI', category: 'AI/ML' },
    { name: 'Ollama', category: 'AI/ML' }
  ];
  const getEmail = () => {
    // encoded email to prevent scraping
    return atob('aGlAamFzb25tY2FscGluLmNvbQ==');
  };
  return (
    <div className="services">
      <SEO
        title="Services - Contract & Consulting"
        description={seoDescription}
        canonical="/services"
        type="website"
      />

      <Hero
        heroTitle="Professional Development Services"
        heroSubtitle="Senior Full-Stack Engineer | 15+ Years Experience | IBM & Ford Motor Company Alumni"
        heroImage="/assets/images/code-bg.jpg"
      />

      {/* Introduction */}
      <motion.section
        className="services-intro"
        ref={introRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={introControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="services-intro__content" variants={fadeInUp}>
            <p className="services-intro__text">
              I'm a Senior Full-Stack Software Engineer with over 15 years of experience building
              enterprise-grade applications for Fortune 500 companies including <strong>IBM</strong> and <strong>Ford Motor Company</strong>.
              I specialize in modern web technologies, AI/ML integration, and performance optimization.
            </p>
            <p className="services-intro__text">
              Currently available for contract work, consulting engagements, and project-based collaborations.
              Whether you need a technical co-founder for your startup, short-term contract expertise, or
              ongoing consulting support, I bring enterprise-level experience with startup agility.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        className="services-offerings"
        ref={servicesRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={servicesControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <MotionTitle>What I Offer</MotionTitle>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__description">{service.description}</p>
                <ul className="service-card__features">
                  {service.features.map((feature, i) => (
                    <li key={i} className="service-card__feature">
                      <span className="service-card__check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Technologies */}
      <motion.section
        className="services-tech"
        ref={techRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={techControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <MotionTitle>Technologies & Expertise</MotionTitle>

          <motion.div className="services-tech__grid" variants={fadeInUp}>
            {['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'CMS', 'AI/ML'].map((category) => (
              <div key={category} className="services-tech__category">
                <h3 className="services-tech__category-title">{category}</h3>
                <div className="services-tech__tags">
                  {technologies
                    .filter(tech => tech.category === category)
                    .map((tech, i) => (
                      <span key={i} className="services-tech__tag">
                        {tech.name}
                      </span>
                    ))
                  }
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing & Engagement */}
      <motion.section
        className="services-pricing"
        ref={pricingRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={pricingControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <MotionTitle>Flexible Engagement Models</MotionTitle>

          <motion.div className="services-pricing__grid" variants={fadeInUp}>
            <div className="pricing-card">
              <h3 className="pricing-card__title">Hourly Consulting</h3>
              <div className="pricing-card__price">$80-120<span>/hour</span></div>
              <p className="pricing-card__description">
                Perfect for ongoing support, code reviews, technical advice, and short-term needs.
              </p>
              <ul className="pricing-card__features">
                <li>Flexible scheduling</li>
                <li>No long-term commitment</li>
                <li>Direct communication</li>
                <li>Quick turnaround</li>
              </ul>
            </div>

            <div className="pricing-card pricing-card--featured">
              <div className="pricing-card__badge">Most Popular</div>
              <h3 className="pricing-card__title">Project-Based</h3>
              <div className="pricing-card__price">Custom Quote</div>
              <p className="pricing-card__description">
                Fixed-price projects with clear scope, timeline, and deliverables. Ideal for well-defined work.
              </p>
              <ul className="pricing-card__features">
                <li>Detailed project planning</li>
                <li>Milestone-based payments</li>
                <li>Predictable costs</li>
                <li>Full project ownership</li>
              </ul>
            </div>

            <div className="pricing-card">
              <h3 className="pricing-card__title">Contract Work</h3>
              <div className="pricing-card__price">Let's Talk</div>
              <p className="pricing-card__description">
                Part-time or full-time contract engagements for extended projects or team augmentation.
              </p>
              <ul className="pricing-card__features">
                <li>Team integration</li>
                <li>Long-term collaboration</li>
                <li>Competitive rates</li>
                <li>Dedicated availability</li>
              </ul>
            </div>
          </motion.div>

          <motion.div className="services-pricing__note" variants={fadeInUp}>
            <p>
              <strong>All engagements include:</strong> Clear communication, regular updates, clean documented code,
              and a commitment to quality. Enterprise clients from Fortune 500 companies have trusted my work.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section
        className="services-cta"
        ref={ctaRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={ctaControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="services-cta__content" variants={fadeInUp}>
            <h2 className="services-cta__title">Ready to Start Your Project?</h2>
            <p className="services-cta__text">
              Let's discuss how I can help bring your vision to life. Whether you need a full application,
              AI integration, performance optimization, or technical guidance, I'm here to help.
            </p>

            <div className="services-cta__buttons">
              <a
                href={`mailto:${getEmail()}`}
                className="btn btn-primary services-cta__button"
              >
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/jasondennismcalpin"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline services-cta__button"
              >
                Connect on LinkedIn
              </a>
            </div>

            <div className="services-cta__contact-info">
              <p><strong>Email:</strong> {getEmail()}</p>
              <p><strong>Response Time:</strong> Typically within 24 hours</p>
              <p><strong>Location:</strong> Available for remote work worldwide</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
