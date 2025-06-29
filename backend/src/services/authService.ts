import jwt, { SignOptions } from 'jsonwebtoken';
import { ethers } from 'ethers';
import { JWTPayload, User } from '../types';
import { config } from '../config';
import { userService } from './userService';

/**
 * JWT Authentication Service
 * Handles token generation, validation, and wallet signature verification
 */
class AuthService {
  /**
   * Generate JWT token for a user
   */
  generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      walletAddress: user.walletAddress,
    };

    const options: SignOptions = {
      expiresIn: config.jwtExpiresIn,
    };

    return jwt.sign(payload, config.jwtSecret, options);
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate authentication message for wallet signing
   */
  generateAuthMessage(walletAddress: string, nonce: string): string {
    return `Welcome to Web3 Message Signer!

This request will not trigger a blockchain transaction or cost any gas fees.

Wallet address: ${walletAddress}
Nonce: ${nonce}

Sign this message to authenticate with our application.`;
  }

  /**
   * Verify wallet signature and authenticate user
   */
  async authenticateWithSignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<{
    success: boolean;
    token?: string;
    user?: User;
    error?: string;
  }> {
    try {
      // Find user by wallet address
      const user = userService.findByWalletAddress(walletAddress);
      if (!user) {
        return {
          success: false,
          error: 'User not found. Please request a nonce first.',
        };
      }

      // Generate expected message
      const expectedMessage = this.generateAuthMessage(
        walletAddress,
        user.nonce
      );

      // Verify the message matches what we expect
      if (message !== expectedMessage) {
        return {
          success: false,
          error: 'Invalid message format.',
        };
      }

      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Verify the recovered address matches the wallet address
      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return {
          success: false,
          error: 'Signature verification failed.',
        };
      }

      // Update user's last login time
      userService.updateLastLogin(user.id);

      // Generate new nonce for next authentication
      const updatedUser = userService.createOrUpdateUser(walletAddress);

      // Generate JWT token
      const token = this.generateToken(updatedUser);

      return {
        success: true,
        token,
        user: {
          id: updatedUser.id,
          walletAddress: updatedUser.walletAddress,
          nonce: updatedUser.nonce,
          createdAt: updatedUser.createdAt,
          lastLoginAt: updatedUser.lastLoginAt,
        },
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed due to server error.',
      };
    }
  }

  /**
   * Get or create authentication nonce for wallet
   */
  getAuthNonce(walletAddress: string): { nonce: string; message: string } {
    const user = userService.createOrUpdateUser(walletAddress);
    const message = this.generateAuthMessage(walletAddress, user.nonce);

    return {
      nonce: user.nonce,
      message,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
