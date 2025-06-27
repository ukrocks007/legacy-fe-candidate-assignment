import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { SignatureService } from '../services/signatureService';
import { SignatureVerificationRequest, ApiError } from '../types';

const signatureService = new SignatureService();

export class SignatureController {
  /**
   * POST /verify-signature
   * Verifies an Ethereum message signature
   */
  public async verifySignature(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const apiError: ApiError = {
          error: 'Validation failed',
          details: errors
            .array()
            .map(err => err.msg)
            .join(', '),
        };
        res.status(400).json(apiError);
        return;
      }

      const request: SignatureVerificationRequest = req.body;
      const result = await signatureService.verifySignature(request);

      if (result.isValid) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Controller error:', error);
      next(error);
    }
  }

  /**
   * GET /health
   * Health check endpoint
   */
  public async healthCheck(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'web3-message-verifier-backend',
    });
  }
}
