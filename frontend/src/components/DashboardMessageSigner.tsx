import React, { useState } from 'react';
import { useMessageSigner } from '../hooks/useMessageSigner';
import { useMFAVerification } from '../hooks/useMFAVerification';
import MFAVerificationModal from './MFAVerificationModal';
import type { VerificationResult } from '../types';

interface DashboardMessageSignerProps {
  onMessageSigned: (message: string, signature: string) => void;
  onSignatureVerified: (messageId: string, isValid: boolean) => void;
  signedMessages: Array<{
    id: string;
    message: string;
    signature: string;
    timestamp: number;
    walletAddress: string;
    isValid?: boolean;
  }>;
}

const DashboardMessageSigner: React.FC<DashboardMessageSignerProps> = ({
  onMessageSigned,
  onSignatureVerified,
  signedMessages
}) => {
  const [message, setMessage] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  
  const {
    signMessage,
    verifySignature,
    isLoading,
    error,
  } = useMessageSigner();

  const {
    requiresMFA,
    isVerifying,
    currentChallenge,
    verificationCode,
    setVerificationCode,
    error: mfaError,
    initiateVerification,
    verifyCode,
    cancelVerification,
  } = useMFAVerification();

  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Check if MFA is required
    if (requiresMFA) {
      const canProceed = await initiateVerification();
      if (!canProceed) {
        setPendingMessage(message);
        return;
      }
    }

    // Proceed with signing
    await performSigning(message);
  };

  const handleMFAVerification = async (code: string): Promise<boolean> => {
    const success = await verifyCode(code);
    if (success && pendingMessage) {
      await performSigning(pendingMessage);
      setPendingMessage(null);
    }
    return success;
  };

  const handleMFACancel = () => {
    cancelVerification();
    setPendingMessage(null);
  };

  const performSigning = async (messageToSign: string) => {
    const signedMessage = await signMessage(messageToSign);
    if (signedMessage) {
      setMessage('');
      onMessageSigned(signedMessage.message, signedMessage.signature);
    }
  };

  const handleVerifyLatestMessage = async () => {
    if (!latestMessage) return;
    
    const result = await verifySignature(latestMessage.message, latestMessage.signature);
    if (result) {
      setVerificationResult(result);
      onSignatureVerified(latestMessage.id, result.isValid);
    }
  };

  // Get the most recent signed message for the verification card
  const latestMessage = signedMessages[0];

  return (
    <div className="space-y-6">
      {/* MFA Verification Modal */}
      {currentChallenge && (
        <MFAVerificationModal
          isOpen={!!currentChallenge}
          method={currentChallenge.method}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          onVerify={handleMFAVerification}
          onCancel={handleMFACancel}
          isVerifying={isVerifying}
          error={mfaError}
        />
      )}

      {/* Sign a Message Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ✍️ Sign a Message
            </h2>
            {requiresMFA && (
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-green-600 dark:text-green-400">🔒</span>
                <span className="text-gray-600 dark:text-gray-400">MFA Protected</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSignMessage} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your custom message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
                placeholder="Type your message here..."
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing...' : 'Sign Message'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md text-sm">
              ❌ {error}
            </div>
          )}

          {pendingMessage && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 rounded-md text-sm">
              ⏳ Message signing is pending MFA verification...
            </div>
          )}
        </div>
      </div>

      {/* Submit to Backend Card */}
      {latestMessage && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              🔍 Submit to Backend
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                  {latestMessage.message}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Signature
                </label>
                <div className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-mono break-all">
                  {latestMessage.signature}
                </div>
              </div>

              <button
                onClick={handleVerifyLatestMessage}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Verify Signature
              </button>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`p-3 rounded-md text-sm ${
                  verificationResult.isValid
                    ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                    : 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                }`}>
                  <div className="font-medium mb-1">
                    {verificationResult.isValid ? '✅ Signature is valid!' : '❌ Invalid signature'}
                  </div>
                  <div className="text-xs space-y-1">
                    <div>👤 Signed by: <span className="font-mono">{verificationResult.signer}</span></div>
                    <div>🕘 Verified: {new Date().toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Show message when no signed messages */}
      {signedMessages.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              🔍 Submit to Backend
            </h2>
          </div>
          <div className="p-6">
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                🛑 Please sign a message first
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMessageSigner;
