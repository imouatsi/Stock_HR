import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';
import app from './app';
import express from 'express';
import { backupService } from './services/backupService';

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // This allows loading Bootstrap from CDN
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser() as any);

// Compression
app.use(compression() as any);

// Logging in development
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}

// Error handling
app.use(errorHandler);

// Database connection
mongoose
    .connect(config.mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Initialize backup service
        try {
            await backupService.initialize();
            console.log('Backup service initialized');
        } catch (error) {
            console.error('Failed to initialize backup service:', error);
        }
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Start server
const port = config.port || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 