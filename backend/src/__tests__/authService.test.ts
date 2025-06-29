import { authService } from '../services/authService';
import { userService } from '../services/userService';

describe('AuthService', () => {
  beforeEach(() => {
    userService.clearAll();
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const user = userService.createOrUpdateUser(walletAddress);

      const token = authService.generateToken(user);

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const user = userService.createOrUpdateUser(walletAddress);
      const token = authService.generateToken(user);

      const payload = authService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload?.userId).toBe(user.id);
      expect(payload?.walletAddress).toBe(user.walletAddress);
    });

    it('should return null for invalid token', () => {
      const payload = authService.verifyToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for malformed token', () => {
      const payload = authService.verifyToken('not.a.jwt');
      expect(payload).toBeNull();
    });
  });

  describe('generateAuthMessage', () => {
    it('should generate a properly formatted auth message', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const nonce = 'test-nonce-123';

      const message = authService.generateAuthMessage(walletAddress, nonce);

      expect(message).toContain('Welcome to Web3 Message Signer!');
      expect(message).toContain(walletAddress);
      expect(message).toContain(nonce);
      expect(message).toContain('Wallet address:');
      expect(message).toContain('Nonce:');
    });
  });

  describe('getAuthNonce', () => {
    it('should generate nonce and message for new wallet', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const result = authService.getAuthNonce(walletAddress);

      expect(result).toHaveProperty('nonce');
      expect(result).toHaveProperty('message');
      expect(typeof result.nonce).toBe('string');
      expect(typeof result.message).toBe('string');
      expect(result.message).toContain(walletAddress);
      expect(result.message).toContain(result.nonce);
    });

    it('should generate new nonce for existing wallet', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const result1 = authService.getAuthNonce(walletAddress);
      const result2 = authService.getAuthNonce(walletAddress);

      expect(result1.nonce).not.toBe(result2.nonce);
    });
  });

  describe('authenticateWithSignature', () => {
    it('should fail when user does not exist', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';
      const signature = '0x' + '1'.repeat(130);
      const message = 'test message';

      const result = await authService.authenticateWithSignature(
        walletAddress,
        signature,
        message
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('User not found');
    });

    it('should fail with invalid message format', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // Create user and get nonce
      const { nonce } = authService.getAuthNonce(walletAddress);

      const signature = '0x' + '1'.repeat(130);
      const invalidMessage = 'This is not the expected message format';

      const result = await authService.authenticateWithSignature(
        walletAddress,
        signature,
        invalidMessage
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid message format');
    });

    // Note: Testing actual signature verification would require a real wallet
    // or mock implementation of the eth-sig-util library. For now, we test
    // the error cases and structure.
  });

  describe('token lifecycle', () => {
    it('should handle complete token generation and verification cycle', () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // Create user
      const user = userService.createOrUpdateUser(walletAddress);

      // Generate token
      const token = authService.generateToken(user);
      expect(token).toBeDefined();

      // Verify token
      const payload = authService.verifyToken(token);
      expect(payload).toBeDefined();
      expect(payload?.userId).toBe(user.id);
      expect(payload?.walletAddress).toBe(user.walletAddress);

      // Verify user can be found with payload info
      const foundUser = userService.findById(payload!.userId);
      expect(foundUser).toBeDefined();
      expect(foundUser?.walletAddress).toBe(walletAddress.toLowerCase());
    });
  });
});
