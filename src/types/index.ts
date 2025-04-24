// Common types used throughout the application

// Navigation link type
export interface NavLink {
  path: string;
  label: string;
  subLinks?: NavLink[];
}

// Social media link type
export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'facebook' | 'instagram';
  url: string;
  icon: string;
  linkText: string;
  label: string;
}

// Skill type for About page
export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'design' | 'other';
}

// Experience type for About page
export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null; // null means "Present"
  description: string;
  technologies: string[];
}

// Education type for About page
export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | null; // null means "Present"
  description?: string;
}

// Contact form data type
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Theme type
export interface Theme {
  isDark: boolean;
}

// SEO metadata type
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

// Route type
export interface Route {
  path: string;
  element: React.ReactNode;
}
