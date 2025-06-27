import { ethers } from 'ethers';
import {
  SignatureVerificationRequest,
  SignatureVerificationResponse,
} from '../types';

export class SignatureService {
  /**
   * Verifies an Ethereum signature and returns verification details
   */
  public async verifySignature(
    request: SignatureVerificationRequest
  ): Promise<SignatureVerificationResponse> {
    try {
      const { message, signature } = request;

      // Validate inputs
      if (!message || !signature) {
        return {
          isValid: false,
          signer: null,
          originalMessage: message,
          error: 'Message and signature are required',
        };
      }

      // Recover the signer address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      return {
        isValid: true,
        signer: recoveredAddress,
        originalMessage: message,
      };
    } catch (error) {
      // Only log in non-test environments
      if (process.env.NODE_ENV !== 'test') {
        console.error('Signature verification error:', error);
      }

      return {
        isValid: false,
        signer: null,
        originalMessage: request.message,
        error: 'Invalid signature format or verification failed',
      };
    }
  }

  /**
   * Validates Ethereum address format
   */
  public isValidAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  /**
   * Normalizes an Ethereum address to checksum format
   */
  public normalizeAddress(address: string): string {
    try {
      return ethers.getAddress(address);
    } catch {
      throw new Error('Invalid Ethereum address');
    }
  }
}
