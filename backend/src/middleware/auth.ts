import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Access token required',
        details: 'Please provide a valid authentication token',
      });
      return;
    }

    // Verify the token
    const payload = authService.verifyToken(token);
    if (!payload) {
      res.status(403).json({
        error: 'Invalid token',
        details: 'The provided token is invalid or expired',
      });
      return;
    }

    // Check if user still exists
    const user = userService.findById(payload.userId);
    if (!user) {
      res.status(403).json({
        error: 'User not found',
        details: 'The user associated with this token no longer exists',
      });
      return;
    }

    // Add user info to request object
    req.user = {
      id: user.id,
      walletAddress: user.walletAddress,
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Authentication error',
      details: 'An error occurred while authenticating the request',
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const payload = authService.verifyToken(token);
      if (payload) {
        const user = userService.findById(payload.userId);
        if (user) {
          req.user = {
            id: user.id,
            walletAddress: user.walletAddress,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Don't fail on errors, just continue without user info
    next();
  }
};
