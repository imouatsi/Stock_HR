import express, { Application, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import './utils/validateEnv';
import User from './models/user.model';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import invoiceRoutes from './routes/invoice.routes';
import contractRoutes from './routes/contract.routes';
import proformaRoutes from './routes/proforma.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware with error handling
const setupMiddleware = () => {
  try {
    app.use(helmet());
    app.use(cors());
    app.use(compression() as unknown as RequestHandler);
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  } catch (error) {
    console.error('Middleware setup failed:', error);
    process.exit(1);
  }
};

setupMiddleware();

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/proformas', proformaRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize superadmin if not exists
const initializeSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (!existingSuperAdmin) {
      const superAdmin = await User.create({
        email: 'admin@stockhr.com',
        password: 'admin123',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superadmin',
        active: true,
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true,
          twoFactorEnabled: false
        }
      });
      console.log('Superadmin created successfully:', superAdmin.email);
      console.log('Email: admin@stockhr.com');
      console.log('Password: admin123');
    } else {
      console.log('Superadmin already exists:', existingSuperAdmin.email);
    }
  } catch (error) {
    console.error('Failed to initialize superadmin:', error);
  }
};

// Connect to MongoDB with better error handling
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-hr';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Initialize superadmin after successful DB connection
    await initializeSuperAdmin();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

connectDB();

export default app;