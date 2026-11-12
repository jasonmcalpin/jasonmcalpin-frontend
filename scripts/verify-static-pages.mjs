import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const dist = resolve('dist');
const manifest = JSON.parse(await readFile(join(dist, 'static-pages-manifest.json'), 'utf8'));
const paths = new Set();
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(Array.isArray(manifest) && manifest.length > 10, 'Static page catalog unexpectedly small');
for (const page of manifest) {
  assert(!paths.has(page.path), 'Duplicate route ' + page.path);
  paths.add(page.path);
  const file = join(dist, page.path === '/' ? 'index.html' : page.path.slice(1) + '.html');
  const html = await readFile(file, 'utf8');
  const canonical = 'https://jasonmcalpin.com' + page.canonical;
  assert(html.includes('<div id="root"><div data-static-content><div class="app">'), page.path + ': static content missing');
  assert(html.includes('<h1'), page.path + ': semantic heading missing');
  assert(html.includes('document.documentElement.classList.add(\'js-enabled\')'),
    page.path + ': early JS capability marker missing');
  assert(html.includes('.js-enabled [data-static-content] { display: none !important; }'),
    page.path + ': JS-first-paint flash protection missing');
  assert(html.includes('<div data-static-loading role="status"'),
    page.path + ': loading transition not available');
  assert(html.indexOf("classList.add('js-enabled')") < html.indexOf('<div id="root">'),
    page.path + ': pre-paint JS detection appears after content');
  assert(!html.includes('<div data-static-content hidden'),
    page.path + ': crawler fallback must not be hidden without JavaScript');
  assert(html.includes('<title>' + escaped(page.title) + ' | Jason McAlpin</title>'),
    page.path + ': title does not match');
  assert(html.includes('rel="canonical" href="' + canonical + '"'), page.path + ': canonical does not match');
  assert(html.includes('name="description" content="' + escaped(page.description) + '"'),
    page.path + ': description does not match');
  assert(html.includes('type="module"'), page.path + ': client React bootstrap missing');
  assert(html.includes('<meta property="og:title"'), page.path + ': Open Graph metadata missing');
  assert((html.match(/rel="canonical"/g) || []).length === 1,
    page.path + ': multiple canonical links');
  assert((html.match(/name="description"/g) || []).length === 1,
    page.path + ': multiple descriptions');
  if (!page.excludeSitemap) assert(sitemap.includes('<loc>' + canonical + '</loc>'),
    page.path + ': missing from sitemap');
  else assert(!sitemap.includes('<loc>https://jasonmcalpin.com' + page.path + '</loc>'),
    page.path + ': alias should be excluded from sitemap');
  if (page.path.startsWith('/bytes/') && page.path !== '/bytes/') {
    assert(html.includes('"@type":"BlogPosting"'), page.path + ': invalid article schema');
    assert(html.includes('class="markdown-content'), page.path + ': article content not rendered');
    assert(html.includes('<p>'), page.path + ': article body missing');
  }
  if (page.path.startsWith('/projects/') && page.path !== '/projects/') {
    assert(html.includes('"@type":"CreativeWork"'), page.path + ': project schema missing');
    assert(html.includes('project-page'), page.path + ': project content missing');
  }
}
function escaped(input) {
  return String(input).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

const index = await readFile(join(dist, 'index.html'), 'utf8');
assert(index.includes('Full Stack Developer'), 'Homepage body is not present in initial HTML');
assert(!sitemap.includes('/search?'), 'Sitemap advertises an unimplemented search endpoint');
assert((sitemap.match(/<loc>/g) || []).length === manifest.filter(page => !page.excludeSitemap).length,
  'Sitemap and static page manifest differ');

if (failures.length) {
  for (const failure of failures) console.error('Static HTML contract: ' + failure);
  process.exitCode = 1;
} else {
  console.log('Verified ' + manifest.length + ' routes, metadata, content, sitemap, and React bootstrap.');
}
