import { Request } from 'express';

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
  jwtSecret: string;
  jwtExpiresIn: number;
}

// Authentication related types
export interface User {
  id: string;
  walletAddress: string;
  nonce: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    walletAddress: string;
  };
  error?: string;
}

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request to include user property and ensure headers are available
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    walletAddress: string;
  };
  headers: Request['headers'];
}
