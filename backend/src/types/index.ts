export interface SignatureVerificationRequest {
  message: string;
  signature: string;
}

export interface SignatureVerificationResponse {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
  error?: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}
