/// <reference path="../global.d.ts" />
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import backupRoutes from './routes/backupRoutes';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/backup', backupRoutes);

// Serve backup interface
app.get('/backup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'backup.html'));
});

export default app; 