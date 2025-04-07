import express from 'express';
import cors from 'cors';
import path from 'path';
import backupRoutes from './routes/backupRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the views directory
app.use(express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api/backup', backupRoutes);

// Serve backup interface
app.get('/backup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'backup.html'));
});

export default app; 