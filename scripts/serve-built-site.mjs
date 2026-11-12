import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const dist = resolve('dist');
const port = Number(process.env.PORT || 4173);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

async function file(path) {
  try {
    if (!(await stat(path)).isFile()) return null;
    return await readFile(path);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    const decoded = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (decoded.includes('\0') || decoded.includes('\\') ||
        decoded.split('/').some(segment => segment === '..' || segment.startsWith('.'))) {
      res.writeHead(400).end();
      return;
    }
    const relative = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
    const base = join(dist, relative);
    if (base !== dist && !base.startsWith(dist + sep)) {
      res.writeHead(400).end();
      return;
    }
    const candidates = relative === '' ? [join(dist, 'index.html')] :
      [base, base + '.html', join(base, 'index.html'), join(dist, 'index.html')];
    for (const candidate of candidates) {
      const bytes = await file(candidate);
      if (!bytes) continue;
      const type = mime[extname(candidate)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : bytes);
      return;
    }
    res.writeHead(404).end('Not found');
  } catch (error) {
    console.error('Preview error:', error);
    res.writeHead(500).end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('Static preview listening at http://127.0.0.1:' + port);
});
