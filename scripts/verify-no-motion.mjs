import { readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const excluded = new Set(['node_modules', 'dist', '.git', '.lighthouseci']);
const forbidden = [
  /from\s+['"]framer-motion['"]/,
  /from\s+['"]react-intersection-observer['"]/,
  /<\/?motion\./,
  /useScrollAnimation/,
  /<\/?AnimatePresence/,
];
async function scan(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    if (!['.tsx', '.ts', '.css'].includes(extname(entry.name))) continue;
    const source = await readFile(file, 'utf8');
    for (const pattern of forbidden) {
      if (pattern.test(source)) throw new Error(file + ' still has obsolete animation dependency or syntax: ' + pattern);
    }
  }
}
await scan(resolve('src'));
const pkg = JSON.parse(await readFile(resolve('package.json'), 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
for (const name of ['framer-motion', 'react-intersection-observer']) {
  if (name in deps) throw new Error('Obsolete dependency in package.json: ' + name);
}
const lock = await readFile(resolve('yarn.lock'), 'utf8');
for (const name of ['framer-motion', 'motion-dom', 'motion-utils', 'react-intersection-observer']) {
  if (new RegExp('^' + name + '@', 'm').test(lock))
    throw new Error('Obsolete package in yarn.lock: ' + name);
}
const css = await readFile(resolve('src/styles/reveals.css'), 'utf8');
if (!css.includes('prefers-reduced-motion') || !css.includes('[data-reveal]'))
  throw new Error('Native reveal CSS / accessibility contract missing');
console.log('No animation library, imports or obsolete Motion markup remain in source or lockfile.');
