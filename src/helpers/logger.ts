import { createLogger, transports, format, addColors } from 'winston';
import { config } from 'dotenv';

config();

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
};

const logColors = {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    trace: 'magenta',
};

addColors(logColors);

const logger = createLogger({
    levels: logLevels,
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service: 'admin-service' },
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack, ...meta }) => {
            const base = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            const metaString = Object.keys(meta).length ? `\nMETA: ${JSON.stringify(meta, null, 2)}` : '';
            return stack ? `${base}\nSTACK: ${stack}${metaString}` : `${base}${metaString}`;
        }),
        ...(process.env.NODE_ENV === 'development' ? [format.colorize({ all: true })] : [])
    ),
});

export { logger };
