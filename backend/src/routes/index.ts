import { Router } from 'express';
import { SignatureController } from '../controllers/signatureController';
import { AuthController } from '../controllers/authController';
import { verifySignatureValidation } from '../validators/signatureValidator';
import {
  getNonceValidation,
  loginValidation,
} from '../validators/authValidator';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();
const signatureController = new SignatureController();
const authController = new AuthController();

// Health check
router.get(
  '/health',
  signatureController.healthCheck.bind(signatureController)
);

// Authentication routes
router.post(
  '/auth/nonce',
  getNonceValidation,
  authController.getNonce.bind(authController)
);

router.post(
  '/auth/login',
  loginValidation,
  authController.login.bind(authController)
);

router.get(
  '/auth/me',
  authenticateToken,
  authController.getProfile.bind(authController)
);

router.post('/auth/logout', authController.logout.bind(authController));

// Signature verification (optionally authenticated)
router.post(
  '/verify-signature',
  optionalAuth,
  verifySignatureValidation,
  signatureController.verifySignature.bind(signatureController)
);

export default router;
