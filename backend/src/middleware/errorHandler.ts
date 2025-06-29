import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled error:', error);

  const apiError: ApiError = {
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  };

  res.status(500).json(apiError);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const apiError: ApiError = {
    error: 'Route not found',
    details: `Cannot ${req.method} ${req.originalUrl}`,
  };

  res.status(404).json(apiError);
};
