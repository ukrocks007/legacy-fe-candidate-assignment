import { useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook for authentication-related utilities
 */
export const useAuthentication = () => {
  const { primaryWallet, user } = useDynamicContext();
  const {
    isAuthenticated,
    isLoading,
    error,
    authenticateWithWallet,
    logout,
    clearError,
    user: backendUser,
  } = useAuth();

  const handleCompleteAuth = useCallback(async () => {
    if (!primaryWallet || !user) {
      throw new Error('Wallet must be connected first');
    }

    if (!isAuthenticated) {
      await authenticateWithWallet();
    }
  }, [primaryWallet, user, isAuthenticated, authenticateWithWallet]);

  const handleCompleteLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    // State
    isWalletConnected: !!(primaryWallet && user),
    isBackendAuthenticated: isAuthenticated,
    isFullyAuthenticated: !!(primaryWallet && user && isAuthenticated),
    isLoading,
    error,
    backendUser,
    walletAddress: primaryWallet?.address,

    // Actions
    authenticateWithBackend: authenticateWithWallet,
    completeAuthentication: handleCompleteAuth,
    logout: handleCompleteLogout,
    clearError,

    // Utils
    getAuthLevel: () => {
      if (!primaryWallet || !user) return 'none';
      if (!isAuthenticated) return 'wallet-only';
      return 'full';
    },
  };
};
