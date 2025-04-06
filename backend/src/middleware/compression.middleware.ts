import compression from 'compression';
import { Request, Response, NextFunction } from 'express';

const compressionConfig = {
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
};

export const compressionMiddleware = compression(compressionConfig); 