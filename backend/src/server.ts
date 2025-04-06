import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import companyRoutes from './routes/company.routes';
import inventoryRoutes from './routes/inventory.routes';
import contractRoutes from './routes/contract.routes';
import licenseRoutes from './routes/license.routes';
import stockRoutes from './routes/stock.routes';
import invoiceRoutes from './routes/invoice.routes';

const app = express();

// Security middleware
app.use(helmet() as any);

// Body parsing middleware
app.use(express.json({ limit: '10kb' }) as any);
app.use(express.urlencoded({ extended: true, limit: '10kb' }) as any);
app.use(cookieParser() as any);

// CORS and compression
app.use(cors() as any);
app.use(compression() as any);

// Logging in development
if (config.nodeEnv === 'development') {
  app.use(morgan('dev') as any);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 