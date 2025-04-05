import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errorHandler } from './middleware/error.middleware';
import { User } from './models/user.model';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import companyRoutes from './routes/company.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);

// Error handling
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

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-hr';
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize superadmin after successful DB connection
    initializeSuperAdmin();
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app;