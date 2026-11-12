import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const jsDir = resolve('dist/assets/js');
const jsFiles = (await readdir(jsDir)).filter(name => name.endsWith('.js'));
const below = jsFiles.filter(name => /^HomeBelowFold-[a-zA-Z0-9_-]+\.js$/.test(name));
if (below.length !== 1)
  throw new Error('Expected exactly one separately emitted HomeBelowFold JavaScript chunk; found: ' + below.join(', '));

const homeChunks = jsFiles.filter(name => /^index-[a-zA-Z0-9_-]+\.js$/.test(name));
const homeImporters = [];
for (const name of homeChunks) {
  const content = await readFile(join(jsDir, name), 'utf8');
  if (content.includes(below[0])) homeImporters.push(name);
}
if (homeImporters.length === 0)
  throw new Error('Homepage no longer dynamically imports HomeBelowFold');
const deferred = await readFile(join(jsDir, below[0]), 'utf8');
if (!deferred.includes('The work speaks.') || !deferred.includes('Recent Bytes.'))
  throw new Error('Below-the-fold sections are missing from deferred module');

console.log('Verified lazy homepage boundary: ' + below[0] + ' imported by ' + homeImporters.join(', '));
