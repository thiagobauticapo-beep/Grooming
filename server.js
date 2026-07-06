const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    // Si la ruta es '/', redirigir a index.html
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Obtener la ruta absoluta
    const absolutePath = path.join(__dirname, filePath);
    
    // Obtener la extensión del archivo
    const extname = String(path.extname(absolutePath)).toLowerCase();
    
    // Determinar el Content-Type basado en la extensión
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    // Leer y servir el archivo
    fs.readFile(absolutePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Archivo no encontrado
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 - Archivo no encontrado</h1>', 'utf-8');
            } else {
                // Otro error del servidor
                res.writeHead(500);
                res.end(`Error del servidor: ${err.code}`);
            }
        } else {
            // Éxito: devolver el archivo con su tipo correcto
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 Servidor en funcionamiento en:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`=========================================\n`);
    console.log(`Presiona Ctrl+C para detener el servidor.`);
});
