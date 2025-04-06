import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

const morganConfig = {
  stream,
  skip,
};

export const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  morganConfig
); 