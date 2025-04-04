import mongoose from 'mongoose';
import { config } from './index';

let retryCount = 0;
const MAX_RETRIES = 5;

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.database.uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
    retryCount = 0; // Reset retry count on successful connection
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection... Attempt ${retryCount} of ${MAX_RETRIES}`);
      setTimeout(connectDatabase, 5000); // Wait 5 seconds before retrying
    } else {
      console.error('Max retry attempts reached. Exiting process.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
  connectDatabase();
});