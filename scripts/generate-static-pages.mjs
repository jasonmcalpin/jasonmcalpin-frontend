import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const site = 'https://jasonmcalpin.com';
const dist = resolve('dist');
const dataDir = resolve('public/data');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const absolute = path => /^https?:\/\//.test(path) ? path : site + path;
const url = path => site + path;
const jsonLd = object => JSON.stringify(object).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
const elem = (tag, contents, attrs = '') => '<' + tag + attrs + '>' + contents + '</' + tag + '>';
const link = (path, label) => '<a href="' + escapeHtml(path) + '">' + escapeHtml(label) + '</a>';
const paragraph = value => elem('p', escapeHtml(value));
const image = (src, alt) => src ? '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(alt) + '" loading="lazy">' : '';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateRecord(item, label, fields) {
  if (!item || typeof item !== 'object' || Array.isArray(item))
    throw new Error(label + ': expected object');
  for (const field of fields) {
    if (typeof item[field] !== 'string' || !item[field].trim())
      throw new Error(label + '.' + field + ': expected nonempty string');
  }
  if (!slugPattern.test(item.slug)) throw new Error(label + ': invalid URL slug');
  return item;
}
function validateCatalog(items, label, fields) {
  if (!Array.isArray(items)) throw new Error(label + ': expected array');
  const slugs = new Set();
  for (const [index, item] of items.entries()) {
    validateRecord(item, label + '[' + index + ']', fields);
    if (slugs.has(item.slug)) throw new Error(label + ': duplicate slug ' + item.slug);
    slugs.add(item.slug);
  }
  return items;
}
const consulting = JSON.parse(await readFile(join(dataDir, 'consulting.json'), 'utf8'));
const projects = validateCatalog(JSON.parse(await readFile(join(dataDir, 'projects.json'), 'utf8')),
  'projects', ['id', 'slug', 'title', 'description']);
const bytes = validateCatalog(JSON.parse(await readFile(join(dataDir, 'bytes.json'), 'utf8')),
  'bytes',
  ['id', 'slug', 'title', 'excerpt', 'content', 'author', 'date']);

const responsiveImages = JSON.parse(await readFile(resolve('src/generated/image-manifest.json'), 'utf8'));
const heroPreload = source => {
  if (!source) return '';
  const entry = responsiveImages[source];
  if (!entry?.variants?.length) throw new Error('Missing responsive hero image: ' + source);
  const variants = entry.variants;
  const srcSet = variants.map(variant => variant.src + ' ' + variant.width + 'w').join(', ');
  return '<link rel="preload" as="image" type="image/webp" fetchpriority="high" ' +
    'href="' + escapeHtml(variants[0].src) + '" imagesrcset="' + escapeHtml(srcSet) +
    '" imagesizes="100vw">\n  ';
};

const htmlTemplate = await readFile(join(dist, 'index.html'), 'utf8');
if (!htmlTemplate.includes('<div id="root"></div>'))
  throw new Error('Vite output no longer contains the expected React mount point');

const shell = content =>
  '<div class="app"><header class="header"><nav aria-label="Primary">' +
  link('/', 'Home') + ' · ' + link('/about', 'About') + ' · ' +
  link('/projects', 'Projects') + ' · ' + link('/bytes', 'Bytes') + ' · ' +
  link('/services', 'Services') + ' · ' + link('/contact', 'Contact') +
  '</nav></header><main class="main"><div class="section-container">' +
  content + '</div></main><footer>' + link('/privacy', 'Privacy Policy') + '</footer></div>';

const pages = [];
function register(path, title, description, body, options = {}) {
  if (pages.some(page => page.path === path)) throw new Error('Duplicate route ' + path);
  pages.push({ path, title, description, body, ...options });
}

const personSchema = { '@context': 'https://schema.org', '@type': 'Person',
  '@id': site + '/about#person', name: consulting.identity.name,
  url: site + '/about', jobTitle: consulting.identity.role,
  description: consulting.identity.summary,
  sameAs: [consulting.identity.linkedin, consulting.identity.github],
  knowsAbout: consulting.services.map(service => service.title) };
const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite',
  '@id': site + '/#website', name: 'Jason McAlpin: Independent Software Engineering',
  url: site, description: consulting.identity.summary,
  about: { '@id': personSchema['@id'] } };
const serviceSchema = {
  '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'Software engineering services',
  itemListElement: consulting.services.map(service => ({ '@type': 'OfferCatalog', name: service.title,
    description: service.description, url: site + '/services' }))
};

const featuredSlugs = ['ibm-research-tool', 'ford-website', 'mcp-stitch', 'browser-model-lab'];
const featuredProjects = featuredSlugs.map(slug => projects.find(project => project.slug === slug))
  .filter(Boolean);
register('/', 'Independent Software Engineering & Consulting', consulting.identity.summary,
  elem('h1', escapeHtml(consulting.identity.headline)) +
  paragraph(consulting.identity.summary) +
  elem('p', link('/contact', 'Discuss a project') + ' · ' + link('/projects', 'See selected work')) +
  elem('h2', 'What I can help you accomplish') +
  elem('ul', consulting.services.map(service => elem('li',
    elem('h3', escapeHtml(service.title)) + paragraph(service.description) +
    link('/projects/' + service.evidence, 'Relevant work'))).join('')) +
  elem('h2', 'Selected work') +
  elem('ul', featuredProjects.map(project => elem('li',
    elem('h3', link('/projects/' + project.slug, project.title)) +
    paragraph(project.outcome || project.description))).join('')) +
  elem('h2', 'Recent Bytes') +
  elem('ul', [...bytes].sort((a,b) => b.date.localeCompare(a.date)).slice(0, 2)
    .map(byte => elem('li', link('/bytes/' + byte.slug, byte.title))).join('')) +
  elem('p', link('/contact', 'Tell me about your project')),
  { schema: websiteSchema });

register('/about', 'About Jason McAlpin',
  'Independent software engineer with 15+ years of production experience across enterprise web, data, APIs and AI integration.',
  elem('h1', 'A senior engineer who cares about the result') +
  paragraph('I am Jason McAlpin, an independent software engineer and consultant based near Atlanta. For more than 15 years I have helped teams build, modernize and improve applications they depend on.') +
  paragraph('My background spans digital experiences, data migration, APIs, enterprise publishing, performance work and applied AI, including contributions to projects for IBM and Ford.') +
  elem('h2', 'Selected recognition') +
  paragraph('The IBM Sales Intelligence Slack bot received a 2023 Sammy Award. I consulted on the Watson AI model and API integration; recognition belongs to the wider team.') +
  elem('h2', 'Current engineering') +
  paragraph('Published developer tools and ongoing work on model evaluation, agent coordination and project knowledge.') +
  link('/projects', 'Explore engineering work') + ' · ' + link('/contact', 'Get in touch'),
  { schema: personSchema });

register('/projects', 'Selected Engineering Work',
  'Case studies and public engineering projects across modernization, AI, performance and developer tools.',
  elem('h1', 'What I built. Why it mattered.') +
  paragraph('Enterprise work, published tools and ongoing systems research, with clear contributions and maturity labels.') +
  elem('ul', projects.map(project => elem('li',
    elem('h2', link('/projects/' + project.slug, project.title)) +
    (project.kind ? paragraph(project.kind) : '') +
    paragraph(project.outcome || project.description) + image(project.imageUrl, project.title))).join('')));

register('/bytes', 'Bytes', 'Technical articles, tutorials, and thoughts on software development',
  elem('h1', 'Bytes') +
  elem('ul', [...bytes].sort((a, b) => b.date.localeCompare(a.date)).map(byte => elem('li',
    elem('h2', link('/bytes/' + byte.slug, byte.title)) + paragraph(byte.excerpt))).join('')),
  {});

register('/contact', 'Discuss a Software Project',
  'Contact Jason McAlpin for application modernization, AI integration, performance or technical consulting.',
  elem('h1', escapeHtml(consulting.contact.heading)) +
  paragraph(consulting.contact.description) +
  elem('p', 'Use the project inquiry form on this page, protected by Cloudflare Turnstile, or connect through LinkedIn.') +
  paragraph(consulting.identity.location) +
  elem('p', link(consulting.identity.linkedin, 'LinkedIn') + ' · ' +
    link(consulting.identity.github, 'GitHub')));

register('/services', 'Software Engineering Services',
  'Independent engineering for application modernization, AI integration, performance and technical consulting.',
  elem('h1', 'Experienced engineering for the work that matters') +
  paragraph(consulting.identity.summary) +
  elem('ul', consulting.services.map(service => elem('li',
    elem('h2', escapeHtml(service.title)) + paragraph(service.description) +
    elem('ul', service.deliverables.map(item => elem('li', escapeHtml(item))).join('')) +
    link('/projects/' + service.evidence, 'See relevant work'))).join('')) +
  elem('h2', 'Ways to work together') +
  elem('ul', consulting.engagements.map(item => elem('li',
    elem('h3', escapeHtml(item.name)) + paragraph(item.description))).join('')) +
  elem('h2', 'How an engagement works') +
  elem('ol', consulting.process.map(step => elem('li',
    elem('h3', escapeHtml(step.title)) + paragraph(step.description))).join('')) +
  paragraph('Confidentiality, intellectual-property ownership and payment terms are agreed in writing when appropriate.') +
  link('/contact', 'Discuss your project'),
  { schema: serviceSchema });

register('/privacy', 'Privacy Policy', 'Privacy information for jasonmcalpin.com',
  elem('h1', 'Privacy Policy') +
  paragraph('Project inquiries are protected by Cloudflare Turnstile and delivered through AWS Lambda and Amazon SES. Optional analytics require consent; game preferences are stored locally. Use the contact page for privacy requests.'));
register('/privacy-policy', 'Privacy Policy', 'Privacy information for jasonmcalpin.com',
  elem('h1', 'Privacy Policy') +
  paragraph('Privacy settings can be managed using the controls on this website.'),
  { canonicalPath: '/privacy', excludeSitemap: true });

for (const byte of bytes) {
  const path = '/bytes/' + byte.slug;
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: byte.title, description: byte.excerpt, datePublished: byte.date,
    ...(byte.imageUrl ? { image: absolute(byte.imageUrl) } : {}),
    author: { '@type': 'Person', name: byte.author, url: site + '/about' },
    publisher: { '@type': 'Person', name: 'Jason McAlpin', url: site },
    mainEntityOfPage: url(path),
  };
  register(path, byte.title, byte.excerpt,
    elem('article', elem('h1', escapeHtml(byte.title)) +
      elem('p', escapeHtml(byte.author + ' · ' + byte.date)) +
      image(byte.imageUrl, byte.title) +
      elem('div', await readFile(join(dataDir, 'byte-html', byte.slug + '.html'), 'utf8'), ' class="markdown-content prose prose-invert"'),
    ' class="byte-page"'), {
      schema: articleSchema, imageUrl: byte.imageUrl, date: byte.date, type: 'article',
    });
}

for (const project of projects) {
  const path = '/projects/' + project.slug;
  const description = project.outcome || project.description;
  const projectSchema = {
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    '@id': url(path) + '#work', name: project.title, description,
    ...(project.imageUrl ? { image: absolute(project.imageUrl) } : {}),
    creator: { '@id': personSchema['@id'] },
    keywords: project.technologies.join(', '), url: url(path),
  };
  const detail = project.challenge ?
    elem('h2', 'The challenge') + paragraph(project.challenge) +
    elem('h2', 'My contribution') + paragraph(project.role) + paragraph(project.approach) +
    elem('h2', 'The outcome') + paragraph(description) :
    elem('h2', 'Project overview') + paragraph(project.description);
  register(path, project.title, description,
    elem('article', elem('h1', escapeHtml(project.title)) +
      (project.category ? paragraph(project.category + (project.kind ? ' · ' + project.kind : '')) : '') +
      image(project.imageUrl, project.title) +
      detail + elem('h2', 'Technical context') +
      paragraph(project.technologies.join(', ')) +
      (project.githubUrl ? elem('p', link(project.githubUrl, 'View source repository')) : '') +
      (project.liveUrl ? elem('p', link(project.liveUrl, 'Visit project or demo')) : '') +
      elem('p', link('/contact', 'Discuss similar work')),
    ' class="project-page"'),
    { schema: projectSchema, imageUrl: project.imageUrl });
}

function renderPage(page) {
  const title = page.title + ' | Jason McAlpin';
  const canonical = url(page.canonicalPath || page.path);
  const fullImage = absolute(page.imageUrl || '/assets/images/code.jpg');
  const metas = [
    ['property', 'og:type', page.type || 'website'],
    ['property', 'og:url', canonical],
    ['property', 'og:title', title],
    ['property', 'og:description', page.description],
    ['property', 'og:image', fullImage],
    ['property', 'og:site_name', 'Jason McAlpin'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', page.description],
    ['name', 'twitter:image', fullImage],
  ].map(([attribute, key, value]) =>
    '<meta ' + attribute + '="' + escapeHtml(key) + '" content="' + escapeHtml(value) + '">').join('\n  ');
  const schema = page.schema ? '\n  <script type="application/ld+json">' + jsonLd(page.schema) + '</script>' : '';
  return htmlTemplate
    .replace('</head>', '\n  ' + heroPreload(page.heroImage) + '</head>')
    .replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtml(title) + '</title>')
    .replace(/<meta name="description"\s+content="[^"]*"\s*\/?>/,
      '<meta name="description" content="' + escapeHtml(page.description) + '">')
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/,
      '<link rel="canonical" href="' + escapeHtml(canonical) + '">')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/g, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace('</head>', `
  <!-- Hide the non-hydratable static fallback before first paint when JS is available.
       Without JavaScript, content stays visible and fully navigable. -->
  <style>
    .js-enabled [data-static-content] { display: none !important; }
    [data-static-loading] { display: none; }
    .js-enabled [data-static-loading] {
      display: flex; min-height: 65vh; align-items: center; justify-content: center;
      color: #e5e7eb; background: #121212; font: 500 1rem system-ui, sans-serif;
    }
  </style>
  <script>document.documentElement.classList.add('js-enabled');</script>
` + '\n  ' + metas + schema + '\n</head>')
    .replace('<div id="root"></div>',
      '<div id="root"><div data-static-content>' + shell(page.body) + '</div>' +
      '<div data-static-loading role="status" aria-live="polite">Loading page...</div></div>');
}

// A route that is also a directory prefix (e.g. /projects/ containing project
// detail HTML files) must have an index document. This works independently of
// Apache rewrite support and prevents web servers from listing directory files.
const routePaths = new Set(pages.map(page => page.path));
for (const page of pages) {
  const target = page.path === '/' ? join(dist, 'index.html') :
    join(dist, page.path.slice(1) + '.html');
  await mkdir(dirname(target), { recursive: true });
  const html = renderPage(page);
  await writeFile(target, html);

  if (page.path !== '/' && [...routePaths].some(path => path.startsWith(page.path + '/'))) {
    const directoryIndex = join(dist, page.path.slice(1), 'index.html');
    await mkdir(dirname(directoryIndex), { recursive: true });
    await writeFile(directoryIndex, html);
  }
}

const sitemapPaths = pages.filter(page => !page.excludeSitemap).map(page => ({
  url: url(page.path),
  ...(page.date ? { date: page.date } : {}),
}));
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  sitemapPaths.map(page => '  <url><loc>' + escapeHtml(page.url) + '</loc>' +
    (page.date ? '<lastmod>' + escapeHtml(page.date) + '</lastmod>' : '') +
    '</url>').join('\n') + '\n</urlset>\n';
await writeFile(join(dist, 'sitemap.xml'), sitemap);
// Optional LLM-oriented navigation index: derived from the same published
// business and project records as React and crawler-readable HTML.
const aiIndex = [
  '# Jason McAlpin: Independent Software Engineering',
  '',
  '> ' + consulting.identity.summary,
  '',
  '## Identity and contact',
  '- ' + consulting.identity.role,
  '- ' + consulting.identity.experience,
  '- Location: ' + consulting.identity.location,
  '- Project inquiries: ' + site + '/contact',
  '',
  '## Services',
  ...consulting.services.map(service =>
    '- [' + service.title + '](' + site + '/services): ' + service.description),
  '',
  '## Selected evidence',
  ...featuredProjects.map(project =>
    '- [' + project.title + '](' + site + '/projects/' + project.slug + '): ' +
    (project.outcome || project.description)),
  '',
  '## Public tools and ongoing architecture',
  ...projects.filter(project => project.kind).map(project =>
    '- [' + project.title + '](' + site + '/projects/' + project.slug + '): ' +
    project.kind + '. ' + project.description),
  '',
  '## Additional context',
  '- [About](' + site + '/about)',
  '- [Bytes: engineering writing](' + site + '/bytes)',
  '- [Contact](' + site + '/contact)',
  '',
  'This file is a navigation aid, not an API or a guarantee of AI indexing. Check the linked pages for source context.',
  ''
].join('\n');
await writeFile(join(dist, 'llms.txt'), aiIndex);

await writeFile(join(dist, 'static-pages-manifest.json'), JSON.stringify(
  pages.map(page => ({ path: page.path, canonical: page.canonicalPath || page.path,
    title: page.title, description: page.description, excludeSitemap: !!page.excludeSitemap })),
  null, 2));
// Published Apache configuration is part of the static output, not a shell
// post-build copy. Node's file API works on Windows, macOS, and Linux.
await copyFile(resolve('.htaccess'), join(dist, '.htaccess'));
console.log('Generated ' + pages.length + ' static HTML pages and sitemap from published catalogs.');
