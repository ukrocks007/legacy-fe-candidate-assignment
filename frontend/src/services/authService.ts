import { API_BASE_URL, API_ENDPOINTS } from '../config';
import type { AuthRequest, AuthResponse, NonceResponse, User } from '../types';

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  /**
   * Get authentication nonce for wallet address
   */
  async getNonce(walletAddress: string): Promise<NonceResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_NONCE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to get nonce');
    }

    return response.json();
  }

  /**
   * Authenticate with wallet signature
   */
  async login(authRequest: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(authRequest),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.details || result.error || 'Authentication failed'
      );
    }

    if (result.success && result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_ME}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to get profile');
    }

    return response.json();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint if token exists
      if (this.token) {
        await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
      // Continue with local logout even if backend call fails
    } finally {
      this.clearToken();
    }
  }

  /**
   * Store authentication token
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is invalid, clear it
    if (response.status === 401) {
      this.clearToken();
      throw new Error('Authentication token expired');
    }

    return response;
  }
}

export const authService = AuthService.getInstance();
