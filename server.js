/* Adel & Roaa — Katb Ketab invitation server
   Zero-dependency Node server: serves the static site and a tiny
   wishes API persisted to wishes.json. Run: node server.js        */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 510;
const ROOT = __dirname;
const WISHES_FILE = path.join(ROOT, 'wishes.json');

const MAX_NAME = 40;
const MAX_MESSAGE = 220;
const MAX_WISHES = 2000;
const MAX_BODY = 16 * 1024;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/* ---------- wishes storage ---------- */

function readWishes() {
  try {
    const data = JSON.parse(fs.readFileSync(WISHES_FILE, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeWishes(wishes) {
  const tmp = WISHES_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(wishes, null, 2));
  fs.renameSync(tmp, WISHES_FILE);
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function handleWishes(req, res) {
  if (req.method === 'GET') {
    return send(res, 200, readWishes());
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_BODY) req.destroy();
    });
    req.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(body || '{}');
      } catch {
        return send(res, 400, { error: 'Invalid JSON' });
      }

      const name = String(parsed.name ?? '').trim().slice(0, MAX_NAME);
      const message = String(parsed.message ?? '').trim().slice(0, MAX_MESSAGE);
      if (!name || !message) {
        return send(res, 400, { error: 'Name and message are required' });
      }

      const wishes = readWishes();
      const wish = { name, message, ts: Date.now() };
      wishes.push(wish);
      if (wishes.length > MAX_WISHES) wishes.splice(0, wishes.length - MAX_WISHES);
      try {
        writeWishes(wishes);
      } catch {
        return send(res, 500, { error: 'Could not save wish' });
      }
      send(res, 201, wish);
    });
    return;
  }

  send(res, 405, { error: 'Method not allowed' });
}

/* ---------- static files ---------- */

function serveStatic(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.normalize(path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath));

  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, { error: 'Forbidden' });
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // fall back to index.html for unknown paths (single-page site)
      filePath = path.join(ROOT, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if ((req.url || '').startsWith('/api/wishes')) return handleWishes(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { error: 'Method not allowed' });
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Adel & Roaa — Katb Ketab invitation running at http://localhost:${PORT}`);
});
