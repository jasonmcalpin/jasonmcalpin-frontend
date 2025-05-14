import { Variants } from 'framer-motion';

/**
 * Animation for page transitions
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Animation for staggered children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Animation for fading in from bottom
 */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

/**
 * Animation for fading in
 */
export const fadeIn: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

/**
 * Animation for scaling in
 */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

/**
 * Animation for sliding in from left
 */
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

/**
 * Animation for sliding in from right
 */
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

/**
 * Animation for neon text flicker
 */
export const neonFlicker: Variants = {
  hidden: { 
    opacity: 0.8,
    textShadow: '0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(0, 240, 255, 0.3)',
  },
  visible: { 
    opacity: [0.8, 1, 0.9, 1],
    textShadow: [
      '0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(0, 240, 255, 0.3)',
      '0 0 5px rgba(0, 240, 255, 0.8), 0 0 15px rgba(0, 240, 255, 0.6), 0 0 25px rgba(0, 240, 255, 0.4)',
      '0 0 5px rgba(0, 240, 255, 0.6), 0 0 10px rgba(0, 240, 255, 0.4)',
      '0 0 5px rgba(0, 240, 255, 0.8), 0 0 15px rgba(0, 240, 255, 0.6), 0 0 25px rgba(0, 240, 255, 0.4)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

/**
 * Animation for hover effects on cards
 */
export const cardHover = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  hover: { 
    scale: 1.03,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 126, 0, 0.6)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * Animation for button hover effects
 */
export const buttonHover = {
  rest: { 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
};
