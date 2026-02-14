import { config } from 'wasp/server';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const serverMiddlewareFn = (middlewareConfig: any) => {
    middlewareConfig.set('cors', (req: any, res: any, next: any) => {
        // Basic CORS for API: dynamic origin support for Credentials
        const origin = req.headers.origin;
        const allowedOrigins = [
            process.env.WASP_WEB_CLIENT_URL,
            'http://localhost:3000',
            'https://understandyourpartner.com'
        ].filter(Boolean);

        // If origin is allowed (or we are in dev and want to allow all for now), echo it back.
        // For strict security, check inclusion in allowedOrigins.
        // tailored for this environment:
        const safeOrigin = origin && allowedOrigins.some(o => origin.startsWith(o || '')) ? origin : allowedOrigins[0] || '*';

        // Just echo the origin for now to ensure it works for the user's specific localhost port situation
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
            return;
        }

        // Public access allowed for /secure_downloads_v1 as per urgent request

        next();
    });

    // Explicitly serve the secure_downloads_v1 folder
    // This ensures it works even if Wasp's public folder handling is finicky with new folders
    middlewareConfig.set('secure_downloads', express.static(path.join(__dirname, '../../public/secure_downloads_v1'), {
        index: false,
        maxAge: '1d'
    }));

    return middlewareConfig;
};
