import http from 'node:http';
import { readFile } from 'node:fs/promises';
const page = await readFile(new URL('./public/index.html', import.meta.url));
const port = Number(process.env.PORT || 8080);
const server = http.createServer((req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; frame-ancestors 'none'");
  if (path === '/healthz') { res.writeHead(200, {'Content-Type':'text/plain'}); return res.end('ok'); }
  if (path !== '/' && path !== '/index.html') { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
  res.end(req.method === 'HEAD' ? undefined : page);
});
server.listen(port, '0.0.0.0', () => console.log('Website listening on ' + port));
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 20000).unref();
});
