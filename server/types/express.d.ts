// src/@types/express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Adjust 'any' to the specific type for user data if available
        }
    }
}
