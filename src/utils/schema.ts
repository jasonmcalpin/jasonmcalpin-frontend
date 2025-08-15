/**
 * Utility functions for generating structured data (JSON-LD) schemas
 * for different page types to improve SEO and enable rich snippets in search results.
 */

// Base website schema
export const getWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jason McAlpin',
    url: 'https://jasonmcalpin.com',
    description: 'Full Stack Developer specializing in React, TypeScript, and modern web technologies',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://jasonmcalpin.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
};

// Person schema for About page
export const getPersonSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jason McAlpin',
    url: 'https://jasonmcalpin.com',
    image: 'https://jasonmcalpin.com/assets/images/jason-mcalpin.jpg',
    jobTitle: 'Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'IBM'
    },
    sameAs: [
      'http://www.linkedin.com/in/jasondennismcalpin',
      'http://www.github.com/jasonmcalpin',
      'http://www.twitter.com/jasonmcalpin'
    ],
    description: 'Full Stack Developer with expertise in React, TypeScript, and modern web technologies',
    knowsAbout: [
      'React',
      'TypeScript',
      'Node.js',
      'Web Development',
      'JavaScript',
      'Frontend Development',
      'Backend Development'
    ]
  };
};

// Byte schema for blog posts
export const getByteSchema = (byte: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author: string;
  imageUrl: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Byte',
    headline: byte.title,
    description: byte.description,
    image: `https://jasonmcalpin.com${byte.imageUrl}`,
    datePublished: byte.date,
    author: {
      '@type': 'Person',
      name: byte.author,
      url: 'https://jasonmcalpin.com/about'
    },
    publisher: {
      '@type': 'Person',
      name: 'Jason McAlpin',
      url: 'https://jasonmcalpin.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jasonmcalpin.com/favicon.svg'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://jasonmcalpin.com/bytes/${byte.slug}`
    }
  };
};

// Project schema for portfolio items
export const getProjectSchema = (project: {
  title: string;
  description: string;
  slug: string;
  imageUrl: string;
  technologies: string[];
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: `https://jasonmcalpin.com${project.imageUrl}`,
    creator: {
      '@type': 'Person',
      name: 'Jason McAlpin'
    },
    keywords: project.technologies.join(', '),
    url: `https://jasonmcalpin.com/projects/${project.slug}`
  };
};

// BreadcrumbList schema for navigation paths
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://jasonmcalpin.com${item.url}`
    }))
  };
};

// FAQ schema for FAQ sections
export const getFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
};
