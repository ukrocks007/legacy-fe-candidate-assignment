import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useAuth } from '../contexts/AuthContext';
import ParticlesBackground from '../components/ParticlesBackground';
import AuthenticationBanner from '../components/AuthenticationBanner';
import BackendAvailabilityBanner from '../components/BackendAvailabilityBanner';

const LandingPage: React.FC = () => {
  const { user, primaryWallet } = useDynamicContext();
  const { isAuthenticated } = useAuth();

  // Start health check when component mounts (non-blocking)
  useBackendHealth(true);

  // Redirect to dashboard if user is fully authenticated
  if (user && primaryWallet && isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <>
      {/* Animated Particle Background */}
      <ParticlesBackground />

      <div className='min-h-full flex items-center justify-center relative z-10'>
        <div className='max-w-md w-full'>
          {/* Backend Availability Banner */}
          <BackendAvailabilityBanner />

          {/* Hero Section */}
          <div className='text-center mb-8'>
            <div className='mb-6'>
              {/* Simple animated icon */}
              <div className='inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-4 animate-gentle-bounce'>
                <LockKeyhole className='w-12 h-12 text-white' />
              </div>
            </div>

            <h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-4'>
              Web3 Message Signer
            </h1>

            <p className='text-lg text-gray-600 dark:text-gray-400 mb-2'>
              Sign and verify messages on-chain
            </p>

            <p className='text-sm text-gray-500 dark:text-gray-500 mb-8'>
              Secure, decentralized message signing with backend authentication
            </p>

            {/* Feature highlights */}
            <div className='grid grid-cols-1 gap-3 mb-8 text-sm'>
              <div className='flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <span>Email-based wallet login</span>
              </div>
              <div className='flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <span>Backend authentication</span>
              </div>
              <div className='flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <span>Cryptographic message signing</span>
              </div>
              <div className='flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                <span>On-chain verification</span>
              </div>
            </div>
          </div>

          {/* Login Section - only show if not connected */}
          {!user || !primaryWallet ? (
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 dark:opacity-70 opacity-100'>
              <h2 className='text-xl font-semibold text-gray-800 dark:text-white mb-6 text-center'>
                Get Started
              </h2>

              <div className='flex justify-center'>
                <DynamicWidget
                  innerButtonComponent={<span>Connect Wallet</span>}
                />
              </div>

              <div className='mt-6 text-center'>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  By connecting, you agree to our terms of service
                </p>
              </div>
            </div>
          ) : (
            <AuthenticationBanner />
          )}

          {/* Additional Info */}
          <div className='mt-8 text-center'>
            <p className='text-xs text-gray-400 dark:text-gray-500'>
              Powered by Dynamic.xyz • Secure • Decentralized
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
