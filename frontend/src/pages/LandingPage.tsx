import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { Navigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const { user } = useDynamicContext();

  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* Simple animated icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-4 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Web3 Message Signer
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Sign and verify messages on-chain
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Secure, decentralized message signing with Dynamic embedded wallets
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-3 mb-8 text-sm">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Email-based wallet login</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Cryptographic message signing</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>On-chain verification</span>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Get Started
          </h2>
          
          <div className="flex justify-center">
            <DynamicWidget />
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By connecting, you agree to our terms of service
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Powered by Dynamic.xyz • Secure • Decentralized
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
