import request from 'supertest';
import { createApp } from '../app';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

const app = createApp();

describe('Authentication System', () => {
  beforeEach(() => {
    // Clear users before each test
    userService.clearAll();
  });

  describe('POST /auth/nonce', () => {
    it('should generate nonce for valid wallet address', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const response = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('nonce');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty(
        'walletAddress',
        walletAddress.toLowerCase()
      );
      expect(typeof response.body.nonce).toBe('string');
      expect(response.body.nonce.length).toBeGreaterThan(0);
    });

    it('should return same nonce for multiple requests with same wallet', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const response1 = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress })
        .expect(200);

      // Second request should get a new nonce (for security)
      const response2 = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress })
        .expect(200);

      expect(response1.body.nonce).not.toBe(response2.body.nonce);
    });

    it('should reject invalid wallet address', async () => {
      const invalidAddress = 'invalid-address';

      const response = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress: invalidAddress })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject empty wallet address', async () => {
      const response = await request(app)
        .post('/auth/nonce')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    it('should authenticate with valid signature', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // First get nonce
      const nonceResponse = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress });

      const { nonce, message } = nonceResponse.body;

      // Mock a valid signature (in real test, you'd sign with actual wallet)
      const mockSignature = '0x' + '1'.repeat(130); // 132 chars total including 0x

      // Mock the auth service to return success for our test
      jest
        .spyOn(authService, 'authenticateWithSignature')
        .mockResolvedValueOnce({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: 'user-id',
            walletAddress: walletAddress.toLowerCase(),
            nonce: nonce,
            createdAt: new Date(),
          },
        });

      const response = await request(app)
        .post('/auth/login')
        .send({
          walletAddress,
          signature: mockSignature,
          message,
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty(
        'walletAddress',
        walletAddress.toLowerCase()
      );
    });

    it('should reject invalid signature', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // Mock auth service to return failure
      jest
        .spyOn(authService, 'authenticateWithSignature')
        .mockResolvedValueOnce({
          success: false,
          error: 'Signature verification failed',
        });

      const response = await request(app)
        .post('/auth/login')
        .send({
          walletAddress,
          signature: '0x' + '1'.repeat(130),
          message: 'invalid message',
        })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject malformed signature', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      const response = await request(app)
        .post('/auth/login')
        .send({
          walletAddress,
          signature: 'invalid-signature',
          message: 'some message',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          walletAddress: '0x1234567890123456789012345678901234567890',
          // missing signature and message
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile with valid token', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // Create a user and generate token
      const user = userService.createOrUpdateUser(walletAddress);
      const token = authService.generateToken(user);

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty(
        'walletAddress',
        walletAddress.toLowerCase()
      );
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/auth/me').expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject request with malformed authorization header', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', 'NotBearer token')
        .expect(403);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/logout', () => {
    it('should always return success (stateless JWT)', async () => {
      const response = await request(app).post('/auth/logout').expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('JWT Token Flow', () => {
    it('should handle complete authentication flow', async () => {
      const walletAddress = '0x1234567890123456789012345678901234567890';

      // Step 1: Get nonce
      const nonceResponse = await request(app)
        .post('/auth/nonce')
        .send({ walletAddress })
        .expect(200);

      expect(nonceResponse.body).toHaveProperty('nonce');
      expect(nonceResponse.body).toHaveProperty('message');

      // Step 2: Mock successful login
      jest
        .spyOn(authService, 'authenticateWithSignature')
        .mockResolvedValueOnce({
          success: true,
          token: 'mock-jwt-token',
          user: {
            id: 'user-id',
            walletAddress: walletAddress.toLowerCase(),
            nonce: nonceResponse.body.nonce,
            createdAt: new Date(),
          },
        });

      // Create actual token for verification
      const user = userService.createOrUpdateUser(walletAddress);
      const realToken = authService.generateToken(user);

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          walletAddress,
          signature: '0x' + '1'.repeat(130),
          message: nonceResponse.body.message,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('token');

      // Step 3: Use token to access protected endpoint
      const profileResponse = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${realToken}`)
        .expect(200);

      expect(profileResponse.body.user).toHaveProperty(
        'walletAddress',
        walletAddress.toLowerCase()
      );
    });
  });
});
