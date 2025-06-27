import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const WalletConnection: React.FC = () => {
  const { setShowAuthFlow, primaryWallet, user, handleLogOut } =
    useDynamicContext();

  if (user && primaryWallet) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
              Wallet Connected ✓
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
            onClick={handleLogOut}
            className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center'>
      <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
        Connect Your Wallet
      </h2>
      <p className='text-gray-600 dark:text-gray-400 mb-6'>
        Connect your wallet using Dynamic.xyz to start signing messages
      </p>
      <button
        onClick={() => setShowAuthFlow(true)}
        className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default WalletConnection;
