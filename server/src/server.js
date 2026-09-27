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

const {
    handleApi
} = require('./api');

const DEFAULT_HOST = '0.0.0.0';
const DEFAULT_PORT = 3000;

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
        })
        .catch(error => {
            console.error(
                'Failed to start FREEzzzGames server:',
                error
            );

            process.exitCode = 1;
        });
}