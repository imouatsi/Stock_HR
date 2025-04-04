import mongoose from 'mongoose';
import { AppError } from '../utils/appError';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stock-hr';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw new AppError('Database connection failed', 500);
  }
};

export { connectDB }; 