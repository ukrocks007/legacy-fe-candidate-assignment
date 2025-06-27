export interface DynamicUser {
  id: string;
  email: string;
  verifiedCredentials: any[];
  wallets: any[];
}

export interface SignedMessage {
  message: string;
  signature: string;
  address: string;
  timestamp: Date;
}

export interface VerificationResult {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}
