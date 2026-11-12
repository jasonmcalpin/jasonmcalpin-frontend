import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const forbidden = /@fortawesome\/|\bfa-(?:solid|brands|regular|icon)\b/;
async function check(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await check(path);
    } else if (!/\.test\.tsx?$/.test(entry.name) && /\.(tsx?|css)$/.test(entry.name)) {
      const source = await readFile(path, 'utf8');
      if (forbidden.test(source)) throw new Error(path + ': Font Awesome markup/import found');
    }
  }
}
await check(resolve('src'));

const pkg = JSON.parse(await readFile(resolve('package.json'), 'utf8'));
if ('@fortawesome/fontawesome-free' in { ...pkg.dependencies, ...pkg.devDependencies })
  throw new Error('Font Awesome still declared in package.json');
const lock = await readFile(resolve('yarn.lock'), 'utf8');
if (lock.includes('@fortawesome/fontawesome-free@'))
  throw new Error('Font Awesome still present in yarn.lock');

const css = await readFile(resolve('src/styles/App.css'), 'utf8');
if (!css.includes('min-height: 100svh;'))
  throw new Error('Main content must reserve at least one viewport to prevent loading-footer CLS');

const assets = await readdir(resolve('dist/assets'));
for (const name of assets) {
  if (/fa-(?:solid|brands|regular)|fontawesome/i.test(name))
    throw new Error('A Font Awesome artifact remains in dist/assets: ' + name);
}
console.log('Verified inline SVG icon architecture and first-viewport footer stability contract.');
