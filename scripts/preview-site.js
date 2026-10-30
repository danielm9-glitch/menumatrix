const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../site-release');
const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };
http.createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end(); return; }
  let target = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!target.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  if (!fs.existsSync(target) && !path.extname(target) && fs.existsSync(target + '.html')) target += '.html';
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { response.writeHead(404).end('Not found'); return; }
  response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' });
  fs.createReadStream(target).pipe(response);
}).listen(4186, '127.0.0.1', () => console.log('Menu Matrix preview: http://localhost:4186'));
