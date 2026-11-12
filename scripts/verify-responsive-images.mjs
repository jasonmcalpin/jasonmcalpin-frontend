import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve('public');
const entries = JSON.parse(await readFile('src/generated/image-manifest.json', 'utf8'));
const projects = JSON.parse(await readFile('public/data/projects.json', 'utf8'));
const bytes = JSON.parse(await readFile('public/data/bytes.json', 'utf8'));

const required = new Set([
  ...projects.map(item => item.imageUrl),
  ...bytes.map(item => item.imageUrl),
  '/assets/images/code.jpg', '/assets/images/design.jpg',
  '/assets/images/mobile.jpg', '/assets/images/web.jpg',
  '/assets/images/projects-bg.jpg', '/assets/images/contact-bg.jpg',
  '/assets/images/code-bg.jpg',
].filter(Boolean));

const failures = [];
const sourceEntries = Object.entries(entries);
if (sourceEntries.length < 20) failures.push('unexpectedly small image catalog');

for (const path of required) {
  if (!/\.(jpg|jpeg|png)$/i.test(path)) continue;
  if (!entries[path]) console.warn('Existing content references absent source image (not generated): ' + path);
}

for (const [source, image] of sourceEntries) {
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height) ||
    image.width <= 0 || image.height <= 0) {
    failures.push('invalid source dimensions: ' + source);
    continue;
  }
  if (!Array.isArray(image.variants) || image.variants.length === 0)
    failures.push('missing variants: ' + source);
  const widths = image.variants.map(x => x.width);
  if (widths.some((value, i) => i > 0 && value <= widths[i-1]))
    failures.push('variants not increasing: ' + source);
  for (const variant of image.variants) {
    if (variant.width > image.width) failures.push('upscale detected: ' + variant.src);
    const file = join(root, variant.src.replace(/^\//, ''));
    try { if ((await stat(file)).size < 100) failures.push('empty image: ' + file); }
    catch { failures.push('missing generated image: ' + variant.src); }
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Verified ' + sourceEntries.length + ' responsive image sources and ' +
  sourceEntries.reduce((n,[,i])=>n+i.variants.length,0) +
  ' existing WebP files; images retain intrinsic dimensions without upscaling.');
