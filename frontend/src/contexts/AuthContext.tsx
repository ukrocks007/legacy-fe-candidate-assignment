import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { authService } from '../services/authService';
import type { AuthState, User } from '../types';

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Context type
interface AuthContextType extends AuthState {
  authenticateWithWallet: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { primaryWallet } = useDynamicContext();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const profile = await authService.getProfile();
          if (profile.success && profile.user) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: profile.user, token },
            });
          } else {
            // Invalid token, clear it
            authService.clearToken();
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          authService.clearToken();
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    initializeAuth();
  }, []);

  // Auto-logout when wallet is disconnected
  useEffect(() => {
    if (!primaryWallet && state.isAuthenticated) {
      logout();
    }
  }, [primaryWallet, state.isAuthenticated]);

  const authenticateWithWallet = async () => {
    if (!primaryWallet) {
      dispatch({ type: 'SET_ERROR', payload: 'No wallet connected' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const walletAddress = primaryWallet.address.toLowerCase();

      // Step 1: Get nonce
      const nonceResponse = await authService.getNonce(walletAddress);

      // Step 2: Sign the message
      const signature = await primaryWallet.signMessage(nonceResponse.message);

      if (!signature) {
        throw new Error('Failed to sign message');
      }

      // Step 3: Authenticate with signature
      const authResponse = await authService.login({
        walletAddress,
        signature,
        message: nonceResponse.message,
      });

      if (authResponse.success && authResponse.user && authResponse.token) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: authResponse.user,
            token: authResponse.token,
          },
        });
      } else {
        throw new Error(authResponse.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Authentication failed',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: AuthContextType = {
    ...state,
    authenticateWithWallet,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
