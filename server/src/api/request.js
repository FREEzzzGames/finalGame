'use strict';

/*
 * FREEzzzGames
 * API request module
 *
 * Provides safe helpers for reading HTTP request bodies.
 * Authentication, authorization, persistence and game logic
 * are handled by separate modules.
 */

const MAX_BODY_SIZE = 64 * 1024;

const readJsonBody = request => {
    return new Promise((resolve, reject) => {
        let body = '';
        let finished = false;

        const fail = (error, statusCode) => {
            if (finished) {
                return;
            }

            finished = true;

            reject({
                error,
                statusCode
            });
        };

        request.setEncoding('utf8');

        request.on('data', chunk => {
            if (finished) {
                return;
            }

            body += chunk;

            if (Buffer.byteLength(body, 'utf8') > MAX_BODY_SIZE) {
                fail('REQUEST_BODY_TOO_LARGE', 413);
            }
        });

        request.on('end', () => {
            if (finished) {
                return;
            }

            finished = true;

            if (body.trim().length === 0) {
                resolve({});
                return;
            }

            let parsed;

            try {
                parsed = JSON.parse(body);
            } catch {
                reject({
                    error: 'INVALID_JSON',
                    statusCode: 400
                });

                return;
            }

            if (
                parsed === null ||
                typeof parsed !== 'object' ||
                Array.isArray(parsed)
            ) {
                reject({
                    error: 'INVALID_REQUEST_BODY',
                    statusCode: 400
                });

                return;
            }

            resolve(parsed);
        });

        request.on('error', () => {
            fail('REQUEST_READ_ERROR', 400);
        });
    });
};

module.exports = {
    MAX_BODY_SIZE,
    readJsonBody
};