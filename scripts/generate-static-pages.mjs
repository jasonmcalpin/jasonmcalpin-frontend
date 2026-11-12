import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toml from 'toml';

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
const projects = validateCatalog(JSON.parse(await readFile(join(dataDir, 'projects.json'), 'utf8')),
  'projects', ['id', 'slug', 'title', 'description']);
const parsedBytes = toml.parse(await readFile(join(dataDir, 'bytes.toml'), 'utf8'));
const bytes = validateCatalog(parsedBytes.articles, 'bytes',
  ['id', 'slug', 'title', 'excerpt', 'content', 'author', 'date']);
const experiences = JSON.parse(await readFile(join(dataDir, 'experience.json'), 'utf8'));
const social = JSON.parse(await readFile(join(dataDir, 'social.json'), 'utf8'));
if (!Array.isArray(experiences) || !Array.isArray(social)) throw new Error('Invalid supporting content');

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

function markdown(source, title) {
  // Page heading is already outside the Markdown region; avoid duplicate H1 when identical.
  const cleaned = source.replace(/^#\s+([^\r\n]+)\r?\n/, (match, heading) =>
    heading.trim().toLowerCase() === title.trim().toLowerCase() ? '' : match);
  return renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, cleaned));
}
const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite',
  name: 'Jason McAlpin', url: site };
const personSchema = { '@context': 'https://schema.org', '@type': 'Person',
  name: 'Jason McAlpin', url: site, jobTitle: 'Full Stack Developer',
  sameAs: ['https://www.linkedin.com/in/jasondennismcalpin',
    'https://github.com/jasonmcalpin'] };

register('/', 'Home', 'Full-stack software engineering, projects, and technical writing by Jason McAlpin',
  elem('h1', 'Jason McAlpin — Full Stack Developer') +
  paragraph('Building modern web experiences with React, TypeScript, Node.js and AI.') +
  elem('h2', 'Featured Projects') +
  elem('ul', projects.filter(project => project.featured).slice(0, 3)
    .map(project => elem('li', link('/projects/' + project.slug, project.title))).join('')) +
  elem('h2', 'Recent Bytes') +
  elem('ul', [...bytes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
    .map(byte => elem('li', link('/bytes/' + byte.slug, byte.title))).join('')),
  { schema: websiteSchema, imageUrl: '/assets/images/code.jpg' });

register('/about', 'About Me', 'Experience, background and engineering skills of Jason McAlpin',
  elem('h1', 'About Jason McAlpin') +
  paragraph('Full-stack software developer specializing in React, TypeScript, backend systems and AI integration.') +
  elem('h2', 'Experience') +
  elem('ul', experiences.map(item => elem('li',
    elem('strong', escapeHtml(item.title + ' — ' + item.company)) +
    paragraph(item.description))).join('')), { schema: personSchema });

register('/projects', 'Projects', 'Software projects and selected engineering work',
  elem('h1', 'My Projects') +
  elem('ul', projects.map(project => elem('li',
    elem('h2', link('/projects/' + project.slug, project.title)) +
    paragraph(project.description) + image(project.imageUrl, project.title))).join('')));

register('/bytes', 'Bytes', 'Technical articles, tutorials, and thoughts on software development',
  elem('h1', 'Bytes') +
  elem('ul', [...bytes].sort((a, b) => b.date.localeCompare(a.date)).map(byte => elem('li',
    elem('h2', link('/bytes/' + byte.slug, byte.title)) + paragraph(byte.excerpt))).join('')));

register('/contact', 'Contact', 'Ways to contact Jason McAlpin for software engineering work',
  elem('h1', 'Get In Touch') +
  paragraph('Connect through the following professional profiles.') +
  elem('ul', social.map(entry => elem('li', link(entry.url, entry.label))).join('')));

register('/services', 'Services', 'Full-stack development, AI integration, and technical consulting services',
  elem('h1', 'Professional Development Services') +
  paragraph('Senior Full-Stack Engineer | React, TypeScript, Node.js, Python, AI/ML and software architecture.') +
  elem('ul', ['Full-Stack Development', 'WordPress Development & Optimization',
    'AI/ML Integration', 'Performance Optimization', 'Technical Consulting & Code Reviews',
    'Team Development & Technical Training'].map(name => elem('li', escapeHtml(name))).join('')));

register('/privacy', 'Privacy Policy', 'Privacy information for jasonmcalpin.com',
  elem('h1', 'Privacy Policy') +
  paragraph('Privacy settings can be managed using the controls on this website.'));
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
      elem('div', markdown(byte.content, byte.title), ' class="markdown-content prose prose-invert"'),
    ' class="byte-page"'), {
      schema: articleSchema, imageUrl: byte.imageUrl, date: byte.date, type: 'article',
    });
}

for (const project of projects) {
  const path = '/projects/' + project.slug;
  const projectSchema = {
    '@context': 'https://schema.org', '@type': 'CreativeWork',
    name: project.title, description: project.description,
    ...(project.imageUrl ? { image: absolute(project.imageUrl) } : {}),
    creator: { '@type': 'Person', name: 'Jason McAlpin' },
    keywords: project.technologies.join(', '), url: url(path),
  };
  register(path, project.title, project.description,
    elem('article', elem('h1', escapeHtml(project.title)) +
      image(project.imageUrl, project.title) +
      paragraph(project.description) +
      elem('p', escapeHtml(project.technologies.join(', '))) +
      (project.githubUrl ? paragraph('GitHub: ') + link(project.githubUrl, 'View on GitHub') : '') +
      (project.liveUrl ? link(project.liveUrl, 'Visit Live Site') : ''),
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
    .replace(/<title>[^<]*<\/title>/, '<title>' + escapeHtml(title) + '</title>')
    .replace(/<meta name="description"\s+content="[^"]*"\s*\/?>/,
      '<meta name="description" content="' + escapeHtml(page.description) + '">')
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/,
      '<link rel="canonical" href="' + escapeHtml(canonical) + '">')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/g, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace('</head>', '\n  ' + metas + schema + '\n</head>')
    .replace('<div id="root"></div>',
      '<div id="root">' + shell(page.body) + '</div>');
}

for (const page of pages) {
  const target = page.path === '/' ? join(dist, 'index.html') :
    join(dist, page.path.slice(1) + '.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, renderPage(page));
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
await writeFile(join(dist, 'static-pages-manifest.json'), JSON.stringify(
  pages.map(page => ({ path: page.path, canonical: page.canonicalPath || page.path,
    title: page.title, description: page.description, excludeSitemap: !!page.excludeSitemap })),
  null, 2));
console.log('Generated ' + pages.length + ' static HTML pages and sitemap from published catalogs.');
