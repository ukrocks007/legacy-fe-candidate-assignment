import React, { useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuth } from '../contexts/AuthContext';

const WalletConnection: React.FC = () => {
  const { setShowAuthFlow, primaryWallet, user, handleLogOut } =
    useDynamicContext();
  const {
    isAuthenticated,
    authenticateWithWallet,
    logout,
    isLoading,
    error,
    clearError,
  } = useAuth();

  // Automatically trigger authentication when wallet is connected but not authenticated
  useEffect(() => {
    if (user && primaryWallet && !isAuthenticated && !isLoading) {
      // Add a small delay to ensure the wallet connection is fully established
      const timer = setTimeout(() => {
        authenticateWithWallet();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user, primaryWallet, isAuthenticated, isLoading, authenticateWithWallet]);

  const handleConnect = () => {
    clearError();
    setShowAuthFlow(true);
  };

  const handleAuthenticate = async () => {
    clearError();
    await authenticateWithWallet();
  };

  const handleDisconnect = async () => {
    await logout();
    handleLogOut();
  };

  // If user is connected and authenticated
  if (user && primaryWallet && isAuthenticated) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
              Wallet Connected & Authenticated ✓
            </h2>
            <div className='space-y-2'>
              <div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Email:{' '}
                </span>
                <span className='text-gray-800 dark:text-white'>
                  {user.email}
                </span>
              </div>
              <div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Address:{' '}
                </span>
                <span className='font-mono text-sm text-gray-800 dark:text-white break-all'>
                  {primaryWallet.address}
                </span>
              </div>
              <div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Chain:{' '}
                </span>
                <span className='text-gray-800 dark:text-white'>
                  {primaryWallet.chain}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
            disabled={isLoading}
          >
            {isLoading ? 'Disconnecting...' : 'Disconnect'}
          </button>
        </div>
      </div>
    );
  }

  // If user is connected but not authenticated
  if (user && primaryWallet && !isAuthenticated) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
              Wallet Connected -{' '}
              {isLoading ? 'Authenticating...' : 'Authentication Required'}
            </h2>
            <div className='space-y-2 mb-4'>
              <div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  Address:{' '}
                </span>
                <span className='font-mono text-sm text-gray-800 dark:text-white break-all'>
                  {primaryWallet.address}
                </span>
              </div>
            </div>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              {isLoading
                ? 'Please sign the message in your wallet to complete authentication...'
                : 'Please sign a message to authenticate with our backend and access all features.'}
            </p>
            {error && (
              <div className='mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm'>
                {error}
                <button
                  onClick={() => clearError()}
                  className='ml-2 text-red-600 dark:text-red-300 underline text-xs'
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className='flex space-x-3'>
            <button
              onClick={handleAuthenticate}
              disabled={isLoading}
              className='flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              {isLoading ? 'Authenticating...' : 'Sign Message to Authenticate'}
            </button>
            <button
              onClick={handleLogOut}
              disabled={isLoading}
              className='px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white rounded-lg transition-colors'
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no wallet is connected
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
        Connect Your Wallet
      </h2>
      <p className='text-gray-600 dark:text-gray-400 mb-6'>
        Connect your wallet using Dynamic.xyz to start signing messages
      </p>
      {error && (
        <div className='mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm'>
          {error}
        </div>
      )}
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className='bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    </div>
  );
};

export default WalletConnection;
