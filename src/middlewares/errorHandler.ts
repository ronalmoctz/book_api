import type { Request, Response, NextFunction } from 'express';
import { logger } from '../helpers/logger.js';
import { BaseException } from '../exceptions/BaseException.js';

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (err instanceof BaseException) {
        logger.warn(`[BaseException] ${err.name}: ${err.message}`);
        return res.status(err.statusCode).json({
            error: {
                name: err.name,
                message: err.message,
            },
        });
    }

    logger.warn('[UnhandledError]', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
    });

    return res.status(500).json({
        error: {
            name: 'InternalServerError',
            message: 'Something went wrong. Please try again later.',
        },
    });
};
