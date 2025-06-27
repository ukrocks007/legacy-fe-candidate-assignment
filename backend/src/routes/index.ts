import { Router } from 'express';
import { SignatureController } from '../controllers/signatureController';
import { verifySignatureValidation } from '../validators/signatureValidator';

const router = Router();
const signatureController = new SignatureController();

// Health check
router.get('/health', signatureController.healthCheck.bind(signatureController));

// Signature verification
router.post(
  '/verify-signature',
  verifySignatureValidation,
  signatureController.verifySignature.bind(signatureController)
);

export default router;
