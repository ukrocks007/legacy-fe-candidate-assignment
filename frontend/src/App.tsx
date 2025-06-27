import React from 'react';
import {
  DynamicContextProvider,
  DynamicWidget,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import WalletConnection from './components/WalletConnection';
import MessageSigner from './components/MessageSigner';
import { DYNAMIC_ENVIRONMENT_ID } from './config';
import './App.css';

const AppContent: React.FC = () => {
  const { user, primaryWallet } = useDynamicContext();

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
            Web3 Message Signer & Verifier
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-400'>
            Sign and verify messages using Dynamic.xyz embedded wallet
          </p>
        </div>

        {/* Dynamic Widget for additional actions */}
        <div className='mb-8 flex justify-center'>
          <DynamicWidget />
        </div>

        {/* Main Content */}
        <div className='space-y-8'>
          <WalletConnection />

          {user && primaryWallet && <MessageSigner />}
        </div>

        {/* Footer */}
        <footer className='mt-16 text-center text-gray-500 dark:text-gray-400'>
          <p>Built with Dynamic.xyz, React, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'Web3 Message Signer',
        appLogoUrl: 'https://dynamic.xyz/favicon.ico',
      }}
    >
      <AppContent />
    </DynamicContextProvider>
  );
}

export default App;
