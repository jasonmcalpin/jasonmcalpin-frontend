import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { fetchExperiences } from '../../store/slices/experienceSlice';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { Skill, Experience, Education, Awards } from '../../types';
import SEO from '../../components/global/SEO';
import { getPersonSchema } from '../../utils/schema';
import Hero from '../../components/global/Hero';
import './styles.css';

const About = () => {
  const dispatch = useAppDispatch();
  const { experiences }: { experiences: Experience[] } = useAppSelector((state) => state.experience);  

  useEffect(() => {
    dispatch(fetchExperiences());
  }, [dispatch]);
  const seoDescription = "Learn more about Jason McAlpin, a Full Stack Developer with expertise in React, TypeScript, Node.js, and modern web technologies. View my skills, experience, and background.";
  const personSchema = getPersonSchema();
  const [introRef, introControls] = useScrollAnimation();
  const [skillsRef, skillsControls] = useScrollAnimation();
  const [experienceRef, experienceControls] = useScrollAnimation();
  const [educationRef, educationControls] = useScrollAnimation();
  const [awardRef, awardControls] = useScrollAnimation();
  const skills: Skill[] = [
  // Frontend
  { name: 'React', level: 8, category: 'frontend' },
  { name: 'TypeScript', level: 4, category: 'frontend' },
  { name: 'React-Native', level: 2, category: 'frontend' },
  { name: 'HTML/CSS', level: 15, category: 'frontend' },
  { name: 'Redux', level: 6, category: 'frontend' },
  { name: 'Tailwind CSS', level: 4, category: 'frontend' },
  { name: 'SASS', level: 6, category: 'frontend' },
  { name: 'JavaScript', level: 10, category: 'frontend' },
  { name: 'jQuery', level: 4, category: 'frontend' },
  { name: 'Responsive Design', level: 10, category: 'frontend' },
  { name: 'UI/UX Design', level: 10, category: 'frontend' },
  { name: 'Figma', level: 5, category: 'frontend' },
  { name: 'Angular', level: 1, category: 'frontend' },
  { name: 'ActionScript', level: 2, category: 'frontend' },
  { name: 'SVG Animation', level: 1, category: 'frontend' },
  { name: 'Flash', level: 3, category: 'frontend' },

  // Backend
  { name: 'Node.js', level: 6, category: 'backend' },
  { name: 'Next.js', level: 4, category: 'backend' },
  { name: 'Node-RED', level: 2, category: 'backend' },
  { name: 'MySQL', level: 6, category: 'backend' },
  { name: 'REST APIs', level: 8, category: 'backend' },
  { name: 'PostgreSQL', level: 8, category: 'backend' },
  { name: 'JWT', level: 4, category: 'backend' },
  { name: 'Wordpress', level: 8, category: 'backend' },
  { name: 'Drupal', level: 3, category: 'backend' },
  { name: 'MongoDB', level: 2, category: 'backend' },
  { name: 'PHP', level: 10, category: 'backend' },
  { name: 'Python', level: 5, category: 'backend' },
  { name: 'SQL', level: 10, category: 'backend' },
  { name: 'Carbon Framework', level: 1, category: 'backend' },
  { name: 'Bash', level: 2, category: 'backend' },
  { name: 'Apache', level: 2, category: 'backend' },
  { name: 'Objective-C', level: 2, category: 'backend' },

  // DevOps
  { name: 'Agile Methodologies', level: 10, category: 'DevOps' },
  { name: 'Kubernetes', level: 2, category: 'DevOps' },
  { name: 'Cloudflare', level: 3, category: 'DevOps' },
  { name: 'Git', level: 10, category: 'DevOps' },
  { name: 'Docker', level: 6, category: 'DevOps' },
  { name: 'AWS', level: 4, category: 'DevOps' },
  { name: 'Vite', level: 2, category: 'DevOps' },
  { name: 'Webpack', level: 8, category: 'DevOps' },
  { name: 'Jenkins', level: 4, category: 'DevOps' },
  { name: 'Akamai', level: 2, category: 'DevOps' },
  { name: 'Amazon EC2', level: 2, category: 'DevOps' },
  { name: 'Ubuntu Server', level: 2, category: 'DevOps' },
  { name: 'SSO', level: 3, category: 'DevOps' },
  { name: 'IBM Watson', level: 3, category: 'DevOps' }
];
  
  
  const education: Education[] = [
    {
      degree: "Associate's Degree in Computer Science",
      institution: 'Albert Merrill',
      location: 'New York, NY',
      startYear: 1986,
      endYear: 1987,
      description: 'Pascal, COBOL, RPGII, C, C++, IBM Mainframes'
    },
    {
      degree: 'Commercial Photography',
      institution: 'School of Visual Arts',
      location: 'New York, NY',
      startYear: 1988,
      endYear: 1988,
      description: 'Commercial Photography'
    }
  ];
  
  const awards: Awards[] = [
    {
      awardTitle: 'The Sammy Sales and Marketing Technology Award 2023',
      institution: 'Business Intelligence Group',
      awardYear: 2023,
      description: 'Award for the IBM SlackBot for Sales Intelligence in the Large Company category. I acted as a consultant helping the developers connect the bot to Watson AI and define the models and API needed to pass the results back to slack.'
    },
  ];
  

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="about">
      <SEO 
        title="About Me"
        description={seoDescription}
        canonical="/about"
        type="profile"
        schema={personSchema}
      />

      <Hero 
        heroTitle="About Me"
        heroSubtitle="Full Stack Developer with a passion for creating modern web experiences"
        heroImage="linear-gradient(to right, #2a3b4ce6, #1a2a3ce6), url(/assets/images/code-bg.jpg)"
      />

      <motion.section 
        className="about-intro"
        ref={introRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={introControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <div className="about-intro__content">
            <motion.div className="about-intro__text" variants={fadeInUp}>
              <h2 className="section-title">Who I Am</h2>
              <p className="about-intro__paragraph">
                I'm Jason McAlpin, a passionate full stack developer with over 8 years of experience 
                in building web applications. I specialize in creating responsive, user-friendly 
                interfaces with modern JavaScript frameworks like React, while also having strong 
                backend skills with Node.js and various databases.
              </p>
              <p className="about-intro__paragraph">
                My approach to development focuses on creating clean, maintainable code that delivers 
                exceptional user experiences. I'm constantly learning and adapting to new technologies 
                to stay at the forefront of web development.
              </p>
              <p className="about-intro__paragraph">
                When I'm not coding, you can find me exploring new technologies, contributing to open 
                source projects, or sharing my knowledge through writing technical bytes.
              </p>
            </motion.div>
            
            <motion.div className="about-intro__image-container" variants={fadeInUp}>
              <div className="about-intro__image">
                
                <div className="about-intro__image-placeholder">
                  
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="about-skills"
        ref={skillsRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={skillsControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            My Skills
          </motion.h2>
          
          <motion.div className="about-skills__categories" variants={fadeInUp}>
            <div className="about-skills__category">
              <h3 className="about-skills__category-title">Frontend</h3>
              <div className="about-skills__list">
                {skills
                  .filter(skill => skill.category === 'frontend')
                  .map((skill, index) => (
                    <div key={index} className="about-skills__item">
                      <div className="about-skills__info">
                        <span className="about-skills__name">{skill.name}</span>
                        <span className="about-skills__level">{skill.level} Years</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level*6.5}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="about-skills__category">
              <h3 className="about-skills__category-title">Backend</h3>
              <div className="about-skills__list">
                {skills
                  .filter(skill => skill.category === 'backend')
                  .map((skill, index) => (
                    <div key={index} className="about-skills__item">
                      <div className="about-skills__info">
                        <span className="about-skills__name">{skill.name}</span>
                        <span className="about-skills__level">{skill.level} Years</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level*6.5}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
            <div className="about-skills__category">
              <h3 className="about-skills__category-title">DevOps & Tooling</h3>
              <div className="about-skills__list">
                {skills
                  .filter(skill => skill.category === 'DevOps')
                  .map((skill, index) => (
                    <div key={index} className="about-skills__item">
                      <div className="about-skills__info">
                        <span className="about-skills__name">{skill.name}</span>
                        <span className="about-skills__level">{skill.level} Years</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level*6.5}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      

      <motion.section 
        className="about-experience"
        ref={experienceRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={experienceControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            Work Experience
          </motion.h2>
          
          <div className="about-experience__timeline">
            {experiences.map((experience, index) => (
              <motion.div 
                key={index} 
                className="about-experience__item"
                variants={fadeInUp}
                custom={index}
              >
                <div className="about-experience__marker"></div>
                <div className="about-experience__content">
                  <div className="about-experience__header">
                    <h3 className="about-experience__title">{experience.title}</h3>
                    <span className="about-experience__company">{experience.company}</span>
                  </div>
                  
                  <div className="about-experience__meta">
                    <span className="about-experience__location">{experience.location}</span>
                    <span className="about-experience__date">
                      {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                    </span>
                  </div>
                  
                  <p className="about-experience__description">
                    {experience.description}
                  </p>
                  
                  <div className="about-experience__technologies">
                    {experience.technologies.map((tech: string, i: number) => (
                      <span key={i} className="about-experience__tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="about-education"
        ref={educationRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={educationControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            Education
          </motion.h2>
          
          <div className="about-education__list">
            {education.map((edu, index) => (
              <motion.div 
                key={index} 
                className="about-education__item"
                variants={fadeInUp}
                custom={index}
              >
                <div className="about-education__year">
                  <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                </div>
                
                <div className="about-education__content">
                  <h3 className="about-education__degree">{edu.degree}</h3>
                  <div className="about-education__institution">
                    <span>{edu.institution}</span>
                    <span className="about-education__location">{edu.location}</span>
                  </div>
                  {edu.description && (
                    <p className="about-education__description">{edu.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="about-education"
        ref={awardRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={awardControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            Awards
          </motion.h2>
          
          <div className="about-awards__list">
            {awards.map((award, index) => (
              <motion.div 
                key={index} 
                className="about-awards__item"
                variants={fadeInUp}
                custom={index}
              >
                <div className="about-awards__year">
                  <span>{award.awardYear}</span>
                </div>
                
                <div className="about-awards__content">
                  <h3 className="about-awards__title">{award.awardTitle}</h3>
                  <div className="about-awards__institution">
                    <span>{award.institution}</span>
                  </div>
                  {award.description && (
                    <p className="about-awards__description">{award.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {/* Contact CTA Section */}
      <section className="about-contact">
        <div className="section-container">
          <motion.div 
            className="about-contact__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="about-contact__title">Interested in working together?</h2>
            <p className="about-contact__text">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
            </p>
            <Link to="/contact" className="btn btn-primary about-contact__cta">
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
