import winston from 'winston';
import { format } from 'winston';
import { join } from 'path';
import fs from 'fs';

const { combine, timestamp, printf, colorize } = format;

// Ensure logs directory exists
const logsDir = join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFormat = printf((info) => {
  const { level, message, timestamp, ...metadata } = info;
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection', {
    error: reason.message,
    stack: reason.stack
  });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

export default logger;

// Export a type-safe logging interface
export interface LogMetadata {
  [key: string]: any;
}

export interface TypedLogger {
  error(message: string, metadata?: LogMetadata): void;
  warn(message: string, metadata?: LogMetadata): void;
  info(message: string, metadata?: LogMetadata): void;
  debug(message: string, metadata?: LogMetadata): void;
}

// Create a typed logger instance
export const typedLogger: TypedLogger = {
  error: (message: string, metadata?: LogMetadata) => {
    logger.error(message, metadata);
  },
  warn: (message: string, metadata?: LogMetadata) => {
    logger.warn(message, metadata);
  },
  info: (message: string, metadata?: LogMetadata) => {
    logger.info(message, metadata);
  },
  debug: (message: string, metadata?: LogMetadata) => {
    logger.debug(message, metadata);
  }
};
