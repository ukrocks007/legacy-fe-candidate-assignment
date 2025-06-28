import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { Navigate } from 'react-router-dom';
import DashboardMessageSigner from '../components/DashboardMessageSigner';
import MFASetup from '../components/MFASetup';

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

  // Redirect to landing if user is not logged in
  if (!user || !primaryWallet) {
    return <Navigate to="/" replace />;
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
  }, []);

  // Save signed messages to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('signedMessages', JSON.stringify(signedMessages));
  }, [signedMessages]);

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

  const handleSignatureVerified = (messageId: string, isValid: boolean) => {
    setSignedMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isValid } : msg
      )
    );
  };

  const clearHistory = () => {
    setSignedMessages([]);
    localStorage.removeItem('signedMessages');
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Web3 Message Signer
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Connected as: 
                <span className="font-mono ml-1 text-gray-900 dark:text-white">
                  {truncateAddress(primaryWallet.address)}
                </span>
              </div>
              <DynamicWidget />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Main Actions */}
          <div className="space-y-6">
            {/* MFA Setup */}
            <MFASetup />
            
            {/* Message Signer */}
            <DashboardMessageSigner 
              onMessageSigned={handleMessageSigned}
              onSignatureVerified={handleSignatureVerified}
              signedMessages={signedMessages}
            />
          </div>

          {/* Right Column - Message History */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    📜 Message Signing History
                  </h2>
                  {signedMessages.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors self-start sm:self-auto"
                    >
                      Clear History
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {signedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 mb-2">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      No messages signed yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Sign your first message to see it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                    {signedMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                          <div className="font-medium text-gray-900 dark:text-white text-sm break-words">
                            {truncateText(msg.message)}
                          </div>
                          {msg.isValid !== undefined && (
                            <div className={`text-xs px-2 py-1 rounded-full whitespace-nowrap self-start ${
                              msg.isValid 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {msg.isValid ? '✅ Valid' : '❌ Invalid'}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span>Signature:</span>
                            <span className="font-mono break-all">{truncateText(msg.signature, 20)}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span>Wallet:</span>
                            <span className="font-mono">{truncateAddress(msg.walletAddress)}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span>Time:</span>
                            <span>{formatTimestamp(msg.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {signedMessages.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Messages Signed
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {signedMessages.filter(msg => msg.isValid === true).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Verified Valid
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
