import { SignatureService } from '../services/signatureService';

describe('SignatureService', () => {
  let signatureService: SignatureService;

  beforeEach(() => {
    signatureService = new SignatureService();
  });

  describe('verifySignature', () => {
    it('should return invalid for empty message', async () => {
      const result = await signatureService.verifySignature({
        message: '',
        signature:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Message and signature are required');
    });

    it('should return invalid for empty signature', async () => {
      const result = await signatureService.verifySignature({
        message: 'Hello World',
        signature: '',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Message and signature are required');
    });

    it('should return invalid for malformed signature', async () => {
      const result = await signatureService.verifySignature({
        message: 'Hello World',
        signature: 'invalid-signature',
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid signature format');
    });

    it('should preserve original message in response', async () => {
      const testMessage = 'Test message';
      const result = await signatureService.verifySignature({
        message: testMessage,
        signature: 'invalid-signature',
      });

      expect(result.originalMessage).toBe(testMessage);
    });
  });

  describe('isValidAddress', () => {
    it('should return true for valid Ethereum address', () => {
      const validAddress = '0x742d35CC6Bc40532C31c52Eb345b27C2b37a7C10';
      expect(signatureService.isValidAddress(validAddress)).toBe(true);
    });

    it('should return false for invalid address', () => {
      const invalidAddress = 'invalid-address';
      expect(signatureService.isValidAddress(invalidAddress)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(signatureService.isValidAddress('')).toBe(false);
    });
  });

  describe('normalizeAddress', () => {
    it('should normalize valid address to checksum format', () => {
      const address = '0x742d35cc6bc40532c31c52eb345b27c2b37a7c10';
      const normalized = signatureService.normalizeAddress(address);
      expect(normalized).toBe('0x742d35CC6Bc40532C31c52Eb345b27C2b37a7C10');
    });

    it('should throw error for invalid address', () => {
      expect(() => {
        signatureService.normalizeAddress('invalid-address');
      }).toThrow('Invalid Ethereum address');
    });
  });
});
