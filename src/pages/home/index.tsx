import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { filterProjects } from '../../store/slices/projectsSlice';
import { filterArticles } from '../../store/slices/articlesSlice';
import ProjectCard from '../../components/shared/projectCard';
import ArticleCard from '../../components/shared/articleCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animations';
import './styles.scss';

const Home = () => {
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);
  const { articles } = useAppSelector((state) => state.articles);
  
  const [heroRef, heroControls] = useScrollAnimation();
  const [aboutRef, aboutControls] = useScrollAnimation({ delay: 200 });
  const [projectsRef, projectsControls] = useScrollAnimation();
  const [articlesRef, articlesControls] = useScrollAnimation();
  
  useEffect(() => {
    dispatch(filterProjects('featured'));
    dispatch(filterArticles('recent'));
    
  }, [dispatch]);
  
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
  
  const recentArticles = [...articles].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 2);

  return (
    <div className="home">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        ref={heroRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={heroControls}
        variants={staggerContainer}
      >
        <div className="hero__content">
          <motion.h1 className="hero__title" variants={fadeInUp}>
            <span className="hero__title-line">Hi, I'm</span>
            <span className="hero__title-line neon-text">Jason McAlpin</span>
            <span className="hero__title-line">Full Stack Developer</span>
          </motion.h1>
          
          <motion.p className="hero__subtitle" variants={fadeInUp}>
            Building modern web experiences with cutting-edge technologies
          </motion.p>
          
          <motion.div className="hero__cta" variants={fadeInUp}>
            <Link to="/projects" className="btn btn-primary">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get In Touch
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.8, delay: 0.2 }
          }}
        >
          <div className="hero__grid">
            <div className="hero__grid-item hero__grid-item--1"></div>
            <div className="hero__grid-item hero__grid-item--2"></div>
            <div className="hero__grid-item hero__grid-item--3"></div>
            <div className="hero__grid-item hero__grid-item--4"></div>
          </div>
        </motion.div>
      </motion.section>
      
      {/* About Section Preview */}
      <motion.section 
        className="home-about"
        ref={aboutRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={aboutControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.h2 className="section-title" variants={fadeInUp}>
            About Me
          </motion.h2>
          
          <motion.div className="home-about__content" variants={fadeInUp}>
            <div className="home-about__text">
              <p className="home-about__paragraph">
                I'm a passionate full stack developer with expertise in modern web technologies. 
                I specialize in building responsive, user-friendly applications with React, 
                TypeScript, and other cutting-edge tools.
              </p>
              <p className="home-about__paragraph">
                With a background in both frontend and backend development, I create seamless 
                experiences that solve real-world problems.
              </p>
              
              <Link to="/about" className="btn btn-secondary home-about__cta">
                More About Me
              </Link>
            </div>
            
            <div className="home-about__skills">
              <div className="home-about__skill-category">
                <h3 className="home-about__skill-title">Frontend</h3>
                <div className="home-about__skill-tags">
                  <span className="home-about__skill-tag">React</span>
                  <span className="home-about__skill-tag">TypeScript</span>
                  <span className="home-about__skill-tag">Redux</span>
                  <span className="home-about__skill-tag">Tailwind</span>
                </div>
              </div>
              
              <div className="home-about__skill-category">
                <h3 className="home-about__skill-title">Backend</h3>
                <div className="home-about__skill-tags">
                  <span className="home-about__skill-tag">Node.js</span>
                  <span className="home-about__skill-tag">Express</span>
                  <span className="home-about__skill-tag">MongoDB</span>
                  <span className="home-about__skill-tag">GraphQL</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Featured Projects Section */}
      <motion.section 
        className="home-projects"
        ref={projectsRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={projectsControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Featured Projects</h2>
            <Link to="/projects" className="section-link">
              View All Projects
            </Link>
          </motion.div>
          
          <div className="home-projects__grid">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Recent Articles Section */}
      <motion.section 
        className="home-articles"
        ref={articlesRef as unknown as React.RefObject<HTMLElement>}
        initial="hidden"
        animate={articlesControls}
        variants={staggerContainer}
      >
        <div className="section-container">
          <motion.div className="section-header" variants={fadeInUp}>
            <h2 className="section-title">Recent Articles</h2>
            <Link to="/articles" className="section-link">
              View All Articles
            </Link>
          </motion.div>
          
          <div className="home-articles__grid">
            {recentArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Contact CTA Section */}
      <section className="home-contact">
        <div className="section-container">
          <motion.div 
            className="home-contact__content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }}
            viewport={{ once: true }}
          >
            <h2 className="home-contact__title">Let's Work Together</h2>
            <p className="home-contact__text">
              Have a project in mind or want to discuss potential opportunities?
            </p>
            <Link to="/contact" className="btn btn-primary home-contact__cta">
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
