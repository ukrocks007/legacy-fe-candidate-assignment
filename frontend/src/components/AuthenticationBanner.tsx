import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Wallet, Lock } from 'lucide-react';

const AuthenticationBanner: React.FC = () => {
  const { primaryWallet, user } = useDynamicContext();
  const {
    isAuthenticated,
    authenticateWithWallet,
    error,
    clearError,
  } = useAuth();
  // Don't show banner if fully authenticated
  if (primaryWallet && user && isAuthenticated) {
    return null;
  }
  const [isLoading, setIsLoading] = React.useState(false);
  // Show wallet connection prompt if no wallet
  if (!primaryWallet || !user) {
    return (
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
        <div className='flex items-center space-x-3'>
          <Wallet className='w-6 h-6 text-blue-500' />
          <div className='flex-1'>
            <h3 className='font-medium text-blue-900 dark:text-blue-100'>
              Connect Your Wallet
            </h3>
            <p className='text-sm text-blue-700 dark:text-blue-300'>
              Connect your Web3 wallet to start signing and verifying messages.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show backend authentication prompt if wallet connected but not authenticated
  return (
    <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6'>
      <div className='space-y-3'>
        <div className='flex items-center space-x-3'>
          <Lock className='w-6 h-6 text-yellow-500' />
          <div className='flex-1'>
            <h3 className='font-medium text-yellow-900 dark:text-yellow-100'>
              Complete Authentication
            </h3>
            <p className='text-sm text-yellow-700 dark:text-yellow-300'>
              Your wallet is connected, but you need to authenticate with our
              backend to access all features.
            </p>
          </div>
        </div>

        {error && (
          <div className='p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm'>
            {error}
          </div>
        )}

        <div className='flex items-center space-x-3'>
          <button
            onClick={() => {
              clearError();
              setIsLoading(true);
              authenticateWithWallet().finally(() => setIsLoading(false));
            }}
            disabled={isLoading}
            className='flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
          >
            {isLoading ? (
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3'></div>
            ) : (
              <Shield className='w-8 h-8' />
            )}
            <span>
              {isLoading ? 'Authenticating...' : 'Sign Message to Authenticate'}
            </span>
          </button>

          <span className='text-xs text-yellow-600 dark:text-yellow-400'>
            This will open a signature request in your wallet
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationBanner;
