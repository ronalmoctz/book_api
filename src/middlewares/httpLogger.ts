import morgan from 'morgan';
import { logger } from '../helpers/logger.js';

export const httpLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => logger.http?.(message.trim()),
        }
    }
)