import express, { Express, RequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
import { connectDatabase } from './config/database';
import http from 'http';
import logger from './utils/logger';
import mongoose from 'mongoose';
import app from './app';
import { typedLogger } from './utils/logger';

// Create Express app
const app: Express = express();

// Create HTTP server
const server = http.createServer(app);

// CORS configuration - must be before other middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['set-cookie']
}));

// Middleware
app.use(express.json());
app.use(cookieParser as unknown as () => RequestHandler);

// Add request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock_hr';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    typedLogger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      typedLogger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    typedLogger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Handle server shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export default app;