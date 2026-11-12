import { mkdir, readdir, readFile, writeFile, stat, access } from 'node:fs/promises';
import { join, resolve, extname, relative, dirname, basename, posix } from 'node:path';
import sharp from 'sharp';

/**
 * Publish responsive WebP derivatives without changing checked-in image sources.
 * Manifest is generated before TypeScript/Vite so consumers know exactly which
 * widths exist (no 404s and no upscaled/duplicate derivatives).
 */
const publicDir = resolve('public');
const assetsDir = join(publicDir, 'assets');
const outputDir = join(assetsDir, 'responsive');
const manifestPath = resolve('src/generated/image-manifest.json');
const widths = [320, 640, 960, 1280, 1600];
const formats = new Set(['.jpg', '.jpeg', '.png']);
const quality = 74;

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'responsive') continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(file));
    else if (entry.isFile() && formats.has(extname(file).toLowerCase())) result.push(file);
  }
  return result;
}

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

const catalog = {};
let generated = 0, skipped = 0, originalBytes = 0, variantBytes = 0;
await mkdir(outputDir, { recursive: true });

for (const file of (await walk(assetsDir)).sort()) {
  const source = '/' + posix.join('assets', relative(assetsDir, file).split('\\').join('/'));
  const meta = await sharp(file).metadata();
  if (!meta.width || !meta.height) throw new Error('Image lacks intrinsic dimensions: ' + source);
  originalBytes += (await stat(file)).size;

  const ext = extname(file);
  const stem = basename(file, ext);
  const folder = relative(assetsDir, dirname(file)).split('\\').join('/');
  // Include original extension: prevents same-stem PNG/JPEG collisions.
  const variantBase = posix.join('assets/responsive', folder, stem + ext.toLowerCase());
  const variants = [];

  for (const width of widths) {
    if (width >= meta.width) continue; // Never upscale.
    const outRelative = variantBase + '-' + width + '.webp';
    const out = join(publicDir, outRelative);
    await mkdir(dirname(out), { recursive: true });
    if (!await exists(out) || (await stat(out)).mtimeMs < (await stat(file)).mtimeMs) {
      await sharp(file).rotate().resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4 }).toFile(out);
      generated++;
    } else skipped++;
    variantBytes += (await stat(out)).size;
    variants.push({ width, src: '/' + outRelative });
  }

  const fullWebp = join(dirname(file), stem + '.webp');
  // The existing build already has full-size WebP copies; create only when missing.
  if (!await exists(fullWebp)) {
    await sharp(file).rotate().webp({ quality, effort: 4 }).toFile(fullWebp);
    generated++;
  }
  variants.push({ width: meta.width, src: '/' + posix.join('assets', folder, stem + '.webp') });
  catalog[source] = {
    width: meta.width, height: meta.height,
    variants: variants.sort((a,b) => a.width-b.width),
  };
}

// Keep the manifest deliberately small and completely data-driven.
await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, JSON.stringify(catalog, null, 2) + '\n');
console.log('Image catalog: ' + Object.keys(catalog).length +
  ' sources, ' + generated + ' derivatives written, ' + skipped + ' reused');
console.log('Source bytes scanned: ' + originalBytes +
  ', responsive derivative bytes (generated set): ' + variantBytes);
