import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import DashboardMessageSigner from '../components/DashboardMessageSigner';
import MessageHistory from '../components/MessageHistory';
import QuickStats from '../components/QuickStats';
import HealthCheckModal from '../components/HealthCheckModal';
import { useBackendHealth } from '../hooks/useBackendHealth';
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
  const { primaryWallet } = useDynamicContext();
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Health check hook - check immediately when dashboard loads
  const {
    isHealthy,
    isChecking,
    healthMessage,
    healthMessageType,
    checkHealth,
  } = useBackendHealth(true);

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

  // Show modal when health check fails or is checking
  useEffect(() => {
    if (isChecking || (isHealthy === false && healthMessage)) {
      setShowHealthModal(true);
    } else if (isHealthy === true && showHealthModal) {
      // Show success state briefly before closing modal
      const timer = setTimeout(() => {
        setShowHealthModal(false);
      }, 2000); // Show success for 2 seconds

      // Cleanup timeout on unmount or dependency change
      return () => clearTimeout(timer);
    }
  }, [isHealthy, isChecking, healthMessage, showHealthModal]);

  const handleMessageSigned = (message: string, signature: string) => {
    if (!primaryWallet) return;

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

  const handleCloseHealthModal = () => {
    setShowHealthModal(false);
  };

  const handleRetryHealth = () => {
    checkHealth();
  };

  const clearHistory = () => {
    setSignedMessages([]);
    localStorage.removeItem('signedMessages');
  };
  return (
    <div className='min-h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8'>
          <div className='space-y-6'>
            <DashboardMessageSigner
              onMessageSigned={handleMessageSigned}
              onSignatureVerified={handleSignatureVerified}
              signedMessages={signedMessages}
            />
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

      {/* Health Check Modal */}
      <HealthCheckModal
        isOpen={showHealthModal}
        isHealthy={isHealthy}
        isChecking={isChecking}
        healthMessage={healthMessage}
        healthMessageType={healthMessageType}
        onClose={handleCloseHealthModal}
        onRetryClick={handleRetryHealth}
      />
    </div>
  );
};

export default Dashboard;
