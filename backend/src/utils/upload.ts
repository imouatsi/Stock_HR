import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/logos'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'));
  }
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads/logos');
if (!require('fs').existsSync(uploadsDir)) {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
}

// Export configured multer instance
export const upload = multer({
  storage,
  fileFilter: fileFilter as unknown as multer.Options['fileFilter'],
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}); 