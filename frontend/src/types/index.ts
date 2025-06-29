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

// Backend Authentication Types
export interface User {
  id: string;
  walletAddress: string;
}

export interface AuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface NonceResponse {
  success: boolean;
  nonce: string;
  message: string;
  walletAddress: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
