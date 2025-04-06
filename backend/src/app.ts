import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import { typedLogger } from './utils/logger';
import userRoutes from './routes/user.routes';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Compress all responses
app.use(compression());

// Routes
app.use('/api/v1/users', userRoutes);

// Error handling
app.use(errorHandler);

// Handle unhandled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
  typedLogger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  typedLogger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

export default app; 