import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { errorHandler } from './middleware/error.middleware';
import companyRoutes from './routes/company.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/company', companyRoutes);

// Error handling
app.use(errorHandler);

export default app; 