import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const assetsDir = path.join(publicDir, 'assets');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

const jpegQuality = 70;
const pngQuality = 70;
const webpQuality = 70;

const maxWidth = 1200;

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  if (!imageExtensions.includes(ext)) {
    return;
  }
  
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  const optimizedPath = path.join(dir, `${baseName}${ext}`);
  const webpPath = path.join(dir, `${baseName}.webp`);
  
  console.log(`Processing: ${filePath}`);
  
  try {
    let image = sharp(filePath);
    const metadata = await image.metadata();
    
    if (metadata.width > maxWidth) {
      image = image.resize(maxWidth);
    }
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ quality: jpegQuality, progressive: true })
        .toFile(optimizedPath + '.tmp');
    } else if (ext === '.png') {
      await image
        .png({ quality: pngQuality, progressive: true })
        .toFile(optimizedPath + '.tmp');
    } else if (ext === '.gif') {
      await fs.promises.copyFile(filePath, optimizedPath + '.tmp');
    }
    
    await image
      .webp({ quality: webpQuality })
      .toFile(webpPath);
    
    const originalSize = (await fs.promises.stat(filePath)).size;
    const optimizedSize = (await fs.promises.stat(optimizedPath + '.tmp')).size;
    
    if (optimizedSize < originalSize) {
      await fs.promises.rename(optimizedPath + '.tmp', filePath);
      console.log(`  Reduced from ${formatBytes(originalSize)} to ${formatBytes(optimizedSize)} (${Math.round((1 - optimizedSize / originalSize) * 100)}% smaller)`);
    } else {
      await fs.promises.unlink(optimizedPath + '.tmp');
      console.log(`  Original is already optimized (${formatBytes(originalSize)})`);
    }
    
    console.log(`  Created WebP version: ${webpPath} (${formatBytes((await fs.promises.stat(webpPath)).size)})`);
  } catch (error) {
    console.error(`  Error processing ${filePath}:`, error);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function processDirectory(directory) {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      await processImage(fullPath);
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  
  try {
    await processDirectory(assetsDir);
    console.log('Image optimization completed successfully!');
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

main();
