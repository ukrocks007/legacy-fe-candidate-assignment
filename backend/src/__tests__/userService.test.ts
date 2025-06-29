import { userService } from '../services/userService';

describe('UserService', () => {
  beforeEach(() => {
    userService.clearAll();
  });

  describe('generateNonce', () => {
    it('should generate a random nonce', () => {
      const nonce1 = userService.generateNonce();
      const nonce2 = userService.generateNonce();

      expect(typeof nonce1).toBe('string');
      expect(typeof nonce2).toBe('string');
      expect(nonce1).not.toBe(nonce2);
      expect(nonce1.length).toBeGreaterThan(10);
    });
  });

  describe('createOrUpdateUser', () => {
    it('should create a new user', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const user = userService.createOrUpdateUser(walletAddress);

      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('walletAddress', walletAddress.toLowerCase());
      expect(user).toHaveProperty('nonce');
      expect(user).toHaveProperty('createdAt');
      expect(typeof user.id).toBe('string');
      expect(typeof user.nonce).toBe('string');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    it('should update existing user nonce', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const user1 = userService.createOrUpdateUser(walletAddress);
      const originalNonce = user1.nonce;
      const originalId = user1.id;

      const user2 = userService.createOrUpdateUser(walletAddress);

      expect(user2.id).toBe(originalId);
      expect(user2.nonce).not.toBe(originalNonce);
      expect(user2.walletAddress).toBe(walletAddress.toLowerCase());
    });

    it('should handle case-insensitive wallet addresses', () => {
      const lowerAddress = '0x1234567890123456789012345678901234567890';
      const upperAddress = '0X1234567890123456789012345678901234567890';

      const user1 = userService.createOrUpdateUser(lowerAddress);
      const user2 = userService.createOrUpdateUser(upperAddress);

      expect(user1.id).toBe(user2.id);
      expect(user1.walletAddress).toBe(user2.walletAddress);
    });
  });

  describe('findByWalletAddress', () => {
    it('should find existing user', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const createdUser = userService.createOrUpdateUser(walletAddress);

      const foundUser = userService.findByWalletAddress(walletAddress);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.walletAddress).toBe(walletAddress.toLowerCase());
    });

    it('should return undefined for non-existent user', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const foundUser = userService.findByWalletAddress(walletAddress);

      expect(foundUser).toBeUndefined();
    });

    it('should be case-insensitive', () => {
      const lowerAddress = '0x1234567890123456789012345678901234567890';
      const upperAddress = '0X1234567890123456789012345678901234567890';

      userService.createOrUpdateUser(lowerAddress);
      const foundUser = userService.findByWalletAddress(upperAddress);

      expect(foundUser).toBeDefined();
      expect(foundUser?.walletAddress).toBe(lowerAddress);
    });
  });

  describe('findById', () => {
    it('should find user by ID', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const createdUser = userService.createOrUpdateUser(walletAddress);

      const foundUser = userService.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
      expect(foundUser?.walletAddress).toBe(walletAddress.toLowerCase());
    });

    it('should return undefined for non-existent ID', () => {
      const foundUser = userService.findById('non-existent-id');
      expect(foundUser).toBeUndefined();
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login time', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const user = userService.createOrUpdateUser(walletAddress);

      expect(user.lastLoginAt).toBeUndefined();

      userService.updateLastLogin(user.id);

      const updatedUser = userService.findById(user.id);
      expect(updatedUser?.lastLoginAt).toBeInstanceOf(Date);
    });

    it('should not crash for non-existent user ID', () => {
      expect(() => {
        userService.updateLastLogin('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('getAllUsers', () => {
    it('should return empty array initially', () => {
      const users = userService.getAllUsers();
      expect(users).toEqual([]);
    });

    it('should return all created users', () => {
      const address1 = '0x1234567890123456789012345678901234567890';
      const address2 = '0x0987654321098765432109876543210987654321';

      userService.createOrUpdateUser(address1);
      userService.createOrUpdateUser(address2);

      const users = userService.getAllUsers();
      expect(users).toHaveLength(2);
    });
  });

  describe('clearAll', () => {
    it('should clear all users', () => {
      const address1 = '0x1234567890123456789012345678901234567890';
      const address2 = '0x0987654321098765432109876543210987654321';

      userService.createOrUpdateUser(address1);
      userService.createOrUpdateUser(address2);

      expect(userService.getAllUsers()).toHaveLength(2);

      userService.clearAll();

      expect(userService.getAllUsers()).toHaveLength(0);
      expect(userService.findByWalletAddress(address1)).toBeUndefined();
      expect(userService.findByWalletAddress(address2)).toBeUndefined();
    });
  });
});
