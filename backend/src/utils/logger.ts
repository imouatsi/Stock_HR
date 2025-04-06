import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Custom format for structured logging
const structuredFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  const meta = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '';
  return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
});

// Custom format to mask sensitive data
const maskSensitiveData = winston.format((info) => {
  const masked = { ...info };
  
  // List of fields to mask
  const sensitiveFields = ['password', 'token', 'authorization', 'cookie', 'apiKey'];
  
  // Recursive function to mask sensitive data
  const maskData = (obj: any) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object') {
        maskData(obj[key]);
      } else if (
        sensitiveFields.some(field => 
          key.toLowerCase().includes(field.toLowerCase())
        )
      ) {
        obj[key] = '[REDACTED]';
      }
    });
  };

  maskData(masked);
  return masked;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: winston.format.combine(
    maskSensitiveData(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'stock-hr-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        structuredFormat
      )
    }),
    // Combined logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        structuredFormat
      )
    })
  ]
});

// Add console transport in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      structuredFormat
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
  error: (message: string, metadata?: LogMetadata) => logger.error(message, metadata),
  warn: (message: string, metadata?: LogMetadata) => logger.warn(message, metadata),
  info: (message: string, metadata?: LogMetadata) => logger.info(message, metadata),
  debug: (message: string, metadata?: LogMetadata) => logger.debug(message, metadata),
};
