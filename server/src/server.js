'use strict';

/*
 * FREEzzzGames
 * Server entry point
 *
 * Connects the HTTP server to the API foundation.
 * Authentication, game state, economy and realtime
 * modules remain separate.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const { startIdBot } = require('./telegram/id-bot');

const {
    handleApi
} = require('./api');

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 3000;
const CLIENT_ROOT = path.resolve(__dirname, '../../client');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const serveClient = (request, response) => {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        return false;
    }

    const requestPath = (request.url || '/').split('?')[0];
    const relativePath = requestPath === '/'
        ? 'index.html'
        : requestPath.replace(/^\/+/, '');
    const filePath = path.resolve(CLIENT_ROOT, relativePath);

    if (!filePath.startsWith(CLIENT_ROOT + path.sep)) {
        return false;
    }

    try {
        let target = filePath;
        if (fs.statSync(target).isDirectory()) {
            target = path.join(target, 'index.html');
        }

        const stat = fs.statSync(target);
        if (!stat.isFile()) return false;

        response.statusCode = 200;
        response.setHeader(
            'Content-Type',
            MIME_TYPES[path.extname(target).toLowerCase()] ||
                'application/octet-stream'
        );
        response.setHeader(
            'Cache-Control',
            target.endsWith('index.html')
                ? 'no-cache'
                : 'public, max-age=3600'
        );

        if (request.method === 'HEAD') {
            response.end();
        } else {
            fs.createReadStream(target).pipe(response);
        }

        return true;
    } catch (_) {
        return false;
    }
};

const host = process.env.HOST || DEFAULT_HOST;
const port = Number.parseInt(
    process.env.PORT || DEFAULT_PORT,
    10
);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('Invalid server port');
}

const server = http.createServer(async (request, response) => {
    response.setHeader(
        'Content-Type',
        'application/json; charset=utf-8'
    );

    try {
        const handledByApi = await handleApi(
            request,
            response
        );

        if (handledByApi) {
            return;
        }

        if (
            request.method === 'GET' &&
            request.url === '/health'
        ) {
            response.statusCode = 200;

            response.end(JSON.stringify({
                status: 'ok'
            }));

            return;
        }

        if (serveClient(request, response)) {
            return;
        }

        response.statusCode = 404;

        response.end(JSON.stringify({
            error: 'Not Found'
        }));
    } catch (error) {
        if (response.headersSent) {
            response.end();
            return;
        }

        response.statusCode = 500;

        response.end(JSON.stringify({
            error: 'Internal Server Error'
        }));
    }
});

const start = () => new Promise((resolve, reject) => {
    const handleError = error => {
        server.removeListener('listening', handleListening);
        reject(error);
    };

    const handleListening = () => {
        server.removeListener('error', handleError);
        resolve(server);
    };

    server.once('error', handleError);
    server.once('listening', handleListening);

    server.listen(port, host);
});

const stop = () => new Promise((resolve, reject) => {
    if (!server.listening) {
        resolve();
        return;
    }

    server.close(error => {
        if (error) {
            reject(error);
            return;
        }

        resolve();
    });
});

module.exports = {
    server,
    start,
    stop,
    host,
    port
};

if (require.main === module) {
    start()
        .then(() => {
            console.log(
                `FREEzzzGames server listening on ${host}:${port}`
            );

            startIdBot();
        })
        .catch(error => {
            console.error(
                'Failed to start FREEzzzGames server:',
                error
            );

            process.exitCode = 1;
        });
}