export interface DynamicUser {
  id: string;
  email: string;
  verifiedCredentials: any[];
  wallets: any[];
}

export interface SignedMessage {
  id?: string;
  message: string;
  signature: string;
  address: string;
  timestamp: Date | number;
  walletAddress?: string;
  isValid?: boolean;
}

export interface VerificationResult {
  isValid: boolean;
  signer: string;
  originalMessage: string;
}
