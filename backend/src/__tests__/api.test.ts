import request from 'supertest';
import { createApp } from '../app';
import { Application } from 'express';

describe('Signature API', () => {
  let app: Application;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /verify-signature', () => {
    it('should return 400 for missing message', async () => {
      const response = await request(app).post('/verify-signature').send({
        signature:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for missing signature', async () => {
      const response = await request(app).post('/verify-signature').send({
        message: 'Hello World',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should return 400 for invalid signature format', async () => {
      const response = await request(app).post('/verify-signature').send({
        message: 'Hello World',
        signature: 'invalid-signature',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should handle valid signature verification attempt', async () => {
      // This is a mock signature - in real tests you'd generate valid signatures
      const response = await request(app).post('/verify-signature').send({
        message: 'Hello World',
        signature:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      });

      expect(response.status).toBe(400); // Will be 400 because signature is invalid
      expect(response.body.isValid).toBe(false);
      expect(response.body.originalMessage).toBe('Hello World');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('web3-message-verifier-backend');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });
});
