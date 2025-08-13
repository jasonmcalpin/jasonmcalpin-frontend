
export interface NavLink {
  path: string;
  label: string;
  subLinks?: NavLink[];
}

export interface TitleProps {
  children: React.ReactNode;
}

export interface iconProps {
  iconName: string;
  weight?: 'solid' | 'regular' | 'brands';
  className?: string;
}

export interface LinkTitleProps {
  children: React.ReactNode;
  link?: string;
  linkText?: string;
}

export interface Title {
  children: string;
  link?: string;
  linkText?: string;
}

export interface ChoiceButton {
  path: string;
  children: string;
  additionalClasses?: string;
  type: 'flat' | 'primary' | 'secondary' | 'outline';
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'facebook' | 'instagram';
  url: string;
  icon: string;
  linkText: string;
  label: string;
}

export interface Hero {
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: string;
}

export interface Skill {
  name: string;
  level: number; // 0-15 YEARS
  category: 'frontend' | 'backend' | 'DevOps' | 'other';
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null; 
  description: string;
  technologies: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | null; 
  description?: string;
}

export interface Awards {
  awardTitle: string,
  institution: string,
  awardYear: number,
  description: string
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Theme {
  isDark: boolean;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
}

export interface Route {
  path: string;
  element: React.ReactNode;
}

// Panic 66 Game Types


export interface Effects {
  megacorporationInfluence?: number;
  rogueAIProgress?: number;
  survivorTrust?: number;
  resources?: number;
  [key: string]: number | undefined;
}

export interface Choice {
  text: string;
  effects: Effects;
}

export interface Card {
  id: number;
  text: string;
  leftChoice: Choice;
  rightChoice: Choice;
  background?: string;
  requirements?: {
    [key: string]: number | undefined;
  };
}

export interface Pacts {
  megacorporationInfluence: number;
  rogueAIProgress: number;
  survivorTrust: number;
  resources: number;
  [key: string]: number;
}

export interface GameData {
  cards: Card[];
  pacts: Pacts;
}
