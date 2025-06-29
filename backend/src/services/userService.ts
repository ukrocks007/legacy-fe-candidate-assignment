import { randomUUID } from 'crypto';
import { User } from '../types';

/**
 * Simple in-memory user store for demonstration purposes.
 * In production, this would be replaced with a proper database.
 */
class UserService {
  private users: Map<string, User> = new Map();
  private usersByWallet: Map<string, User> = new Map();

  /**
   * Generate a random nonce for wallet authentication
   */
  generateNonce(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Create a new user or update existing user's nonce
   */
  createOrUpdateUser(walletAddress: string): User {
    const existingUser = this.usersByWallet.get(walletAddress.toLowerCase());

    if (existingUser) {
      // Update nonce for existing user
      existingUser.nonce = this.generateNonce();
      this.users.set(existingUser.id, existingUser);
      this.usersByWallet.set(walletAddress.toLowerCase(), existingUser);
      return existingUser;
    }

    // Create new user
    const user: User = {
      id: randomUUID(),
      walletAddress: walletAddress.toLowerCase(),
      nonce: this.generateNonce(),
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    this.usersByWallet.set(walletAddress.toLowerCase(), user);
    return user;
  }

  /**
   * Find user by wallet address
   */
  findByWalletAddress(walletAddress: string): User | undefined {
    return this.usersByWallet.get(walletAddress.toLowerCase());
  }

  /**
   * Find user by ID
   */
  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  /**
   * Update user's last login time
   */
  updateLastLogin(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      this.users.set(userId, user);
      this.usersByWallet.set(user.walletAddress, user);
    }
  }

  /**
   * Get all users (for debugging/testing purposes)
   */
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Clear all users (for testing purposes)
   */
  clearAll(): void {
    this.users.clear();
    this.usersByWallet.clear();
  }
}

// Export singleton instance
export const userService = new UserService();
