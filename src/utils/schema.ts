import consulting from '../../public/data/consulting.json';

/** All public-facing entities derive from the consulting content contract. */
export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://jasonmcalpin.com/#website',
  name: 'Jason McAlpin: Independent Software Engineering',
  url: 'https://jasonmcalpin.com',
  description: consulting.identity.summary,
  about: { '@id': 'https://jasonmcalpin.com/about#person' },
});

export const getPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://jasonmcalpin.com/about#person',
  name: consulting.identity.name,
  url: 'https://jasonmcalpin.com/about',
  jobTitle: consulting.identity.role,
  description: consulting.identity.summary,
  sameAs: [consulting.identity.linkedin, consulting.identity.github],
  knowsAbout: consulting.services.map(service => service.title),
});

export const getServicesSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'Software engineering services',
  itemListElement: consulting.services.map(service => ({
    '@type': 'OfferCatalog',
    name: service.title,
    description: service.description,
    url: 'https://jasonmcalpin.com/services',
  })),
});

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
    '@type': 'BlogPosting',
    headline: byte.title,
    description: byte.description,
    ...(byte.imageUrl ? { image: `https://jasonmcalpin.com${byte.imageUrl}` } : {}),
    datePublished: byte.date,
    author: {
      '@type': 'Person',
      name: byte.author,
      url: 'https://jasonmcalpin.com/about'
    },
    publisher: {
      '@type': 'Person',
      name: 'Jason McAlpin',
      url: 'https://jasonmcalpin.com'
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
    ...(project.imageUrl ? { image: `https://jasonmcalpin.com${project.imageUrl}` } : {}),
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
