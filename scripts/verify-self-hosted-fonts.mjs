import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const fonts = [
  ['Inter', 'inter-latin-400-700.woff2', 200_000],
  ['Orbitron', 'orbitron-latin-400-700.woff2', 90_000],
];

const css = await readFile(resolve('src/styles/fonts.css'), 'utf8');
const main = await readFile(resolve('src/styles/index.css'), 'utf8');
const html = await readFile(resolve('index.html'), 'utf8');
const apache = await readFile(resolve('.htaccess'), 'utf8');

if (!main.includes("@import './fonts.css';"))
  throw new Error('Critical font CSS is not included');

for (const [family, filename, maxBytes] of fonts) {
  const path = resolve('public/assets/fonts', filename);
  const bytes = await readFile(path);
  if (bytes.toString('ascii', 0, 4) !== 'wOF2')
    throw new Error(filename + ': not a genuine WOFF2 binary');
  if ((await stat(path)).size > maxBytes)
    throw new Error(filename + ': font asset exceeds size budget');
  const rule = css.split(/(?=@font-face)/).find(
    x => x.includes("font-family: '" + family + "'")
  );
  if (!rule || !rule.includes("font-weight: 400 700;") ||
      !rule.includes('font-display: swap;') ||
      !rule.includes(filename))
    throw new Error(family + ': missing variable 400–700 @font-face with swap');
  if (!html.includes('href="/assets/fonts/' + filename + '"'))
    throw new Error(filename + ': local font preload missing');
  const license = await readFile(resolve('public/assets/fonts',
    'LICENSE-' + family.toLowerCase() + '.txt'), 'utf8');
  if (!license.includes('SIL OPEN FONT LICENSE'))
    throw new Error(family + ': original OFL license missing');
}

for (const [name, text] of [['CSS', main], ['HTML', html], ['Apache', apache]]) {
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com/i.test(text))
    throw new Error(name + ': external Google font dependency remains');
}

console.log('Verified Inter and Orbitron WOFF2 fonts, 400–700, swap, preload, size and OFL licenses.');
