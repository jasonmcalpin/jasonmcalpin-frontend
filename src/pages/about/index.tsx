import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import { Skill, Experience, Education } from '../../types';
import './styles.scss';

const About = () => {
  const [introRef, introControls] = useScrollAnimation();
  const [skillsRef, skillsControls] = useScrollAnimation();
  const [experienceRef, experienceControls] = useScrollAnimation();
  const [educationRef, educationControls] = useScrollAnimation();
  
  // Skills data
  const skills: Skill[] = [
    { name: 'React', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'React-Native', level: 80, category: 'frontend' },
    { name: 'HTML/CSS', level: 90, category: 'frontend' },
    { name: 'Redux', level: 85, category: 'frontend' },
    { name: 'Tailwind CSS', level: 80, category: 'frontend' },
    { name: 'Sass', level: 75, category: 'frontend' },
    { name: 'JavaScript', level: 90, category: 'frontend' },
    { name: 'jQuery', level: 70, category: 'frontend' },

    { name: 'Node.js', level: 80, category: 'backend' },
    { name: 'Next.js', level: 75, category: 'backend' },
    { name: 'MySQL', level: 70, category: 'backend' },
    { name: 'GraphQL', level: 65, category: 'backend' },
    { name: 'REST APIs', level: 85, category: 'backend' },
    { name: 'PostgreSQL', level: 70, category: 'backend' },
    { name: 'JWT', level: 75, category: 'backend' },
    { name: 'Wordpress', level: 80, category: 'backend' },
    { name: 'Drupal', level: 75, category: 'backend' },
    { name: 'MongoDB', level: 80, category: 'backend' },
    { name: 'Docker', level: 85, category: 'backend' },
    { name: 'Kubernetes', level: 70, category: 'backend' },
    { name: 'Cloudflare', level: 65, category: 'backend' },
    { name: 'Git', level: 90, category: 'design' },
 
    { name: 'Agile Methodologies', level: 80, category: 'design' },
    { name: 'Responsive Design', level: 85, category: 'design' },
    { name: 'UI/UX Design', level: 75, category: 'design' },
    { name: 'Figma', level: 70, category: 'design' },

  ];
  
  // Experience data
  const experiences: Experience[] = [
    {
      title: 'Senior Mobile Developer',
      company: 'Subvrsive',
      location: 'San Francisco, CA',
      startDate: '2024-10',
      endDate: '2024-12',
      description: 'Optimized React Native components and implemented authentication and security features. Reduced development timeline by a week, allowing for additional features',
      technologies: ['React Native', 'TypeScript', 'SCSS', 'JWT', 'GraphQL']
    },
    {
      title: 'Senior Software Developer',
      company: 'IBM',
      location: 'New York, NA',
      startDate: '2022-01',
      endDate: '2024-10',
      description: `Led the migration of IBM's blogs to a unified platform, building security plugins and data
import tools. Developed an AI-driven sales tool using Watson, Python, and REST APIs, optimizing
service recommendations. Modernized a proprietary database, converting over 1M records to a structured SQL
system with RESTful access.

`,
      technologies: ['React', 'TypeScript', 'Next.js', 'MySQL', 'Watson AI', 'Python', 'REST APIs', 'Wordpress'] 
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions LLC',
      location: 'Austin, TX',
      startDate: '2019-03',
      endDate: '2021-12',
      description: 'Developed and maintained web applications using React on the frontend and Node.js with Express on the backend. Worked with MongoDB for data storage and implemented RESTful APIs.',
      technologies: ['React', 'JavaScript', 'Node.js', 'Express', 'MongoDB']
    },
    {
      title: 'Web Developer',
      company: 'Creative Web Agency',
      location: 'Chicago, IL',
      startDate: '2017-06',
      endDate: '2019-02',
      description: 'Created responsive websites for clients across various industries. Collaborated with designers to implement pixel-perfect designs and ensure cross-browser compatibility.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'PHP']
    }
  ];
  
  // Education data
  const education: Education[] = [
    {
      degree: 'Master of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startYear: 2015,
      endYear: 2017,
      description: 'Specialized in Web Technologies and Human-Computer Interaction'
    },
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'University of Illinois',
      location: 'Urbana-Champaign, IL',
      startYear: 2011,
      endYear: 2015,
      description: 'Minor in Mathematics'
    }
  ];
  
  // Format date for experience items
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__container">
          <h1 className="about-hero__title">About Me</h1>
          <p className="about-hero__subtitle">
            Full Stack Developer with a passion for creating modern web experiences
          </p>
        </div>
      </section>
      
      {/* Introduction Section */}
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
                source projects, or sharing my knowledge through writing technical articles.
              </p>
            </motion.div>
            
            <motion.div className="about-intro__image-container" variants={fadeInUp}>
              <div className="about-intro__image">
                {/* Placeholder for profile image */}
                <div className="about-intro__image-placeholder">
                  <span>JM</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Skills Section */}
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
                        <span className="about-skills__level">{skill.level}%</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
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
                        <span className="about-skills__level">{skill.level}%</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
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
              <h3 className="about-skills__category-title">Design</h3>
              <div className="about-skills__list">
                {skills
                  .filter(skill => skill.category === 'design')
                  .map((skill, index) => (
                    <div key={index} className="about-skills__item">
                      <div className="about-skills__info">
                        <span className="about-skills__name">{skill.name}</span>
                        <span className="about-skills__level">{skill.level}%</span>
                      </div>
                      <div className="about-skills__bar">
                        <motion.div 
                          className="about-skills__progress"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
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
      
      {/* Experience Section */}
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
                    {experience.technologies.map((tech, i) => (
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
      
      {/* Education Section */}
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
