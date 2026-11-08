const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const requestedPort = Number.parseInt(process.env.PORT || '8000', 10);
const port = Number.isInteger(requestedPort) && requestedPort > 0 && requestedPort < 65536
  ? requestedPort
  : 8000;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mov': 'video/quicktime',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function sendFile(filePath, request, response) {
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      response.writeHead(statError.code === 'ENOENT' ? 404 : 500);
      response.end(statError.code === 'ENOENT' ? 'Archivo no encontrado' : 'Error del servidor');
      return;
    }

    const resolvedPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;

    fs.readFile(resolvedPath, (readError, content) => {
      if (readError) {
        response.writeHead(readError.code === 'ENOENT' ? 404 : 500);
        response.end(readError.code === 'ENOENT' ? 'Archivo no encontrado' : 'Error del servidor');
        return;
      }

      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': mimeTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream',
      });

      response.end(request.method === 'HEAD' ? undefined : content);
    });
  });
}

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end('Método no permitido');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400);
    response.end('Solicitud inválida');
    return;
  }

  const requestedPath = path.resolve(projectRoot, pathname.replace(/^[/\\]+/, ''));
  if (requestedPath !== projectRoot && !requestedPath.startsWith(`${projectRoot}${path.sep}`)) {
    response.writeHead(403);
    response.end('Acceso denegado');
    return;
  }

  sendFile(requestedPath, request, response);
});

const tailwindCli = path.join(projectRoot, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
if (!fs.existsSync(tailwindCli)) {
  console.error('No se encontró Tailwind. Ejecuta primero: npm install');
  process.exit(1);
}

const tailwind = spawn(
  process.execPath,
  [tailwindCli, '-i', './src/css/input.css', '-o', './dist/output.css', '--watch'],
  { cwd: projectRoot, stdio: 'inherit' },
);

function shutdown(exitCode = 0) {
  if (!tailwind.killed) tailwind.kill();
  server.close(() => process.exit(exitCode));
}

tailwind.on('exit', (code) => {
  if (code && code !== 0) {
    console.error(`Tailwind terminó con el código ${code}.`);
    shutdown(code);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${port} ya está en uso. Prueba: set PORT=8001 && npm run dev`);
  } else {
    console.error(error);
  }
  shutdown(1);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`\nPrevisualización disponible en http://localhost:${port}`);
  console.log('Presiona Ctrl+C para detenerla.\n');
});

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
