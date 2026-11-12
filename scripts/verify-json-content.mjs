import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Run before build. The published catalog must remain valid JSON with the
// same article and Markdown contracts consumed by the client and publisher.
const path = resolve('public/data/bytes.json');
const articles = JSON.parse(await readFile(path, 'utf8'));
if (!Array.isArray(articles)) throw new Error('bytes.json must contain an array');
const slugs = new Set();
const ids = new Set();
let codeFences = 0;
for (const [index, article] of articles.entries()) {
  const label = 'bytes[' + index + ']';
  if (!article || typeof article !== 'object' || Array.isArray(article))
    throw new Error(label + ': expected object');
  for (const key of ['id','slug','title','excerpt','date','imageUrl','author','content']) {
    if (typeof article[key] !== 'string')
      throw new Error(label + '.' + key + ': expected string');
  }
  if (!article.content.trim() || !article.title.trim() ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug))
    throw new Error(label + ': missing body/title or invalid slug');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(article.date) ||
      Number.isNaN(Date.parse(article.date)))
    throw new Error(label + ': invalid published date');
  if (!Array.isArray(article.tags) ||
      !article.tags.every(tag => typeof tag === 'string') ||
      typeof article.readingTime !== 'number' ||
      !Number.isFinite(article.readingTime) || article.readingTime < 0)
    throw new Error(label + ': invalid tags or reading time');
  if (ids.has(article.id) || slugs.has(article.slug))
    throw new Error(label + ': duplicate ID or slug');
  ids.add(article.id);
  slugs.add(article.slug);
  const fences = (article.content.match(/```/g) ?? []).length;
  if (fences % 2 !== 0) throw new Error(label + ': unbalanced Markdown code fences');
  codeFences += fences;
}
try {
  await access(resolve('public/data/bytes.toml'));
  throw new Error('Legacy bytes.toml must not be published');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
console.log('Verified ' + articles.length + ' JSON articles, ' + codeFences +
  ' Markdown fence delimiters, unique IDs and slugs.');
