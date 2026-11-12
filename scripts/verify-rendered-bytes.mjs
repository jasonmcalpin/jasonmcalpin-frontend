import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const published = resolve('public/data/byte-html');
const bytes = JSON.parse(await readFile('public/data/bytes.json', 'utf8'));
const index = JSON.parse(await readFile('public/data/bytes-index.json', 'utf8'));
if (!Array.isArray(index) || index.length !== bytes.length ||
    index.some((entry, i) => entry.slug !== bytes[i].slug ||
      Object.hasOwn(entry, 'content') ||
      JSON.stringify(entry) !== JSON.stringify(
        Object.fromEntries(Object.entries(bytes[i]).filter(([key]) => key !== 'content')))))
  throw new Error('Runtime article index does not match the authored metadata catalog');
const expected = new Set(bytes.map(byte => byte.slug + '.html'));
const actual = new Set(await readdir(published));
const problems = [];
if (expected.size !== bytes.length) problems.push('duplicate article slugs');
for (const filename of expected) if (!actual.has(filename)) problems.push('missing ' + filename);
for (const filename of actual) if (!expected.has(filename)) problems.push('stale output ' + filename);

let codeBlocks = 0;
for (const byte of bytes) {
  const file = join(published, byte.slug + '.html');
  const html = await readFile(file, 'utf8');
  if (!(await stat(file)).size || !/<p(?:\s|>)/.test(html))
    problems.push('no article body: ' + byte.slug);
  const fenced = (byte.content.match(/^```/gm) || []).length;
  if (fenced && !html.includes('<pre>'))
    problems.push('missing fenced blocks: ' + byte.slug);
  codeBlocks += (html.match(/class="language-/g) || []).length;
  if (/<\/?(?:script|iframe|object|embed|style)(?:\s|>)/i.test(html) ||
      /<[a-z][^>]*\son[a-z]+\s*=/i.test(html) ||
      /(?:href|src)\s*=\s*["']\s*(?:javascript|data):/i.test(html))
    problems.push('unsafe generated markup: ' + byte.slug);
  if (/<pre[^>]*>\s*<pre/i.test(html))
    problems.push('nested pre blocks: ' + byte.slug);
}
if (codeBlocks < 1) problems.push('missing syntax-highlighted code fences');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Verified ' + expected.size + ' compiled articles and ' + codeBlocks +
    ' highlighted blocks; no stale or unsafe output.');
}
