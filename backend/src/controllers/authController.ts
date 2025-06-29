import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { authService } from '../services/authService';
import { AuthRequest, AuthResponse } from '../types';

export class AuthController {
  /**
   * Get authentication nonce for a wallet address
   * POST /auth/nonce
   */
  async getNonce(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors
            .array()
            .map(err => err.msg)
            .join(', '),
        });
        return;
      }

      const { walletAddress } = req.body;

      if (!walletAddress) {
        res.status(400).json({
          error: 'Wallet address required',
          details: 'Please provide a wallet address',
        });
        return;
      }

      const { nonce, message } = authService.getAuthNonce(walletAddress);

      res.json({
        success: true,
        nonce,
        message,
        walletAddress: walletAddress.toLowerCase(),
      });
    } catch (error) {
      console.error('Get nonce error:', error);
      res.status(500).json({
        error: 'Server error',
        details: 'Failed to generate authentication nonce',
      });
    }
  }

  /**
   * Authenticate user with wallet signature
   * POST /auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          error: 'Validation failed',
          details: errors
            .array()
            .map(err => err.msg)
            .join(', '),
        });
        return;
      }

      const { walletAddress, signature, message }: AuthRequest = req.body;

      if (!walletAddress || !signature || !message) {
        res.status(400).json({
          error: 'Missing required fields',
          details: 'Please provide walletAddress, signature, and message',
        });
        return;
      }

      const result = await authService.authenticateWithSignature(
        walletAddress,
        signature,
        message
      );

      if (!result.success) {
        res.status(401).json({
          success: false,
          error: result.error || 'Authentication failed',
        } as AuthResponse);
        return;
      }

      res.json({
        success: true,
        token: result.token,
        user: {
          id: result.user!.id,
          walletAddress: result.user!.walletAddress,
        },
      } as AuthResponse);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Server error during authentication',
      } as AuthResponse);
    }
  }

  /**
   * Get current user profile (requires authentication)
   * GET /auth/me
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({
          error: 'Authentication required',
          details: 'Please authenticate to access this resource',
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Server error',
        details: 'Failed to get user profile',
      });
    }
  }

  /**
   * Logout user (invalidate token on client side)
   * POST /auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Since we're using stateless JWT, logout is handled on the client side
      // by removing the token from storage
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Server error',
        details: 'Failed to logout',
      });
    }
  }
}
