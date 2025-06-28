import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Navigate } from 'react-router-dom';
import DashboardMessageSigner from '../components/DashboardMessageSigner';
import MFASetup from '../components/MFASetup';
import MessageHistory from '../components/MessageHistory';
import QuickStats from '../components/QuickStats';
import type { VerificationResult } from '../types';

interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  timestamp: number;
  walletAddress: string;
  isValid?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, primaryWallet } = useDynamicContext();
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Redirect to landing if user is not logged in
  if (!user || !primaryWallet) {
    return <Navigate to='/' replace />;
  }

  // Load signed messages from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('signedMessages');
    if (stored) {
      try {
        setSignedMessages(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading signed messages:', error);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Save signed messages to localStorage whenever the state changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('signedMessages', JSON.stringify(signedMessages));
    }
  }, [signedMessages, isInitialLoad]);

  const handleMessageSigned = (message: string, signature: string) => {
    const newSignedMessage: SignedMessage = {
      id: Date.now().toString(),
      message,
      signature,
      timestamp: Date.now(),
      walletAddress: primaryWallet.address,
    };
    setSignedMessages(prev => [newSignedMessage, ...prev]);
  };

  const handleSignatureVerified = ({
    originalMessage,
    isValid,
  }: VerificationResult) => {
    setSignedMessages(prev =>
      prev.map(msg =>
        msg.message === originalMessage && msg.isValid === undefined
          ? { ...msg, isValid }
          : msg
      )
    );
  };

  const clearHistory = () => {
    setSignedMessages([]);
    localStorage.removeItem('signedMessages');
  };

  return (
    <div className='min-h-full bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8'>
          <div className='space-y-6'>
            <DashboardMessageSigner
              onMessageSigned={handleMessageSigned}
              onSignatureVerified={handleSignatureVerified}
              signedMessages={signedMessages}
            />
            <MFASetup />
          </div>

          <div className='space-y-6'>
            <QuickStats signedMessages={signedMessages} />
            <MessageHistory
              signedMessages={signedMessages}
              clearHistory={clearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
