/**
 * Node.js server adapter for Render deployment.
 * TanStack Start builds a standard Fetch API handler (dist/server/server.js).
 * This file wraps it as a Node.js HTTP server and serves static client assets.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import serverApp from './dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIR = path.join(__dirname, 'dist/client');
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.js':    'application/javascript; charset=utf-8',
  '.mjs':   'application/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.html':  'text/html; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.gif':   'image/gif',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':   'font/ttf',
  '.webp':  'image/webp',
  '.txt':   'text/plain; charset=utf-8',
};

/** Try to serve a file from dist/client. Returns true if served. */
function tryStatic(req, res) {
  const urlPath = req.url.split('?')[0];
  const filePath = path.join(CLIENT_DIR, urlPath);

  // Prevent path traversal
  if (!filePath.startsWith(CLIENT_DIR)) return false;

  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    // Immutable cache for hashed assets, no-cache for everything else
    const cacheControl = urlPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': cacheControl });
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  // 1. Serve static files first (JS, CSS, images, fonts)
  if (tryStatic(req, res)) return;

  // 2. Fall through to SSR handler
  const host = req.headers.host || `localhost:${PORT}`;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const url = `${proto}://${host}${req.url}`;

  // Collect request body for POST/PUT/PATCH
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const hasBody = chunks.length > 0
    && req.method !== 'GET'
    && req.method !== 'HEAD';

  // Build headers object (Node's IncomingMessage uses lowercase keys already)
  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value != null) {
      headers[key] = Array.isArray(value) ? value.join(', ') : String(value);
    }
  }

  try {
    const response = await serverApp.fetch(
      new Request(url, {
        method: req.method,
        headers,
        body: hasBody ? Buffer.concat(chunks) : undefined,
        // Required for Node.js 18+ when body is a Buffer
        duplex: 'half',
      })
    );

    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error('[server-node] SSR error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
    }
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Arth Sahayak running → http://0.0.0.0:${PORT}`);
});
