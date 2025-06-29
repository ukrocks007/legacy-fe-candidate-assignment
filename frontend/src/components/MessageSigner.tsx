import React, { useState } from 'react';
import { useMessageSigner } from '../hooks/useMessageSigner';
import type { SignedMessage, VerificationResult } from '../types';

interface MessageSignerProps {
  onMessageSigned?: (message: string, signature: string) => void;
  onSignatureVerified?: (messageId: string, isValid: boolean) => void;
  signedMessages?: SignedMessage[];
}

const MessageSigner: React.FC<MessageSignerProps> = ({
  onMessageSigned,
  onSignatureVerified,
  signedMessages: externalSignedMessages,
}) => {
  const [message, setMessage] = useState('');
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const {
    signMessage,
    verifySignature,
    clearHistory,
    signedMessages,
    isLoading,
    error,
  } = useMessageSigner();

  const handleSignMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Proceed with signing
    await performSigning(message);
  };

  const performSigning = async (messageToSign: string) => {
    const signedMessage = await signMessage(messageToSign);
    if (signedMessage) {
      setMessage('');

      // Call the dashboard callback if provided
      if (onMessageSigned) {
        onMessageSigned(signedMessage.message, signedMessage.signature);
      }

      // Auto-verify the signature
      const result = await verifySignature(
        signedMessage.message,
        signedMessage.signature
      );
      setVerificationResult(result);
    }
  };

  const handleVerifySignature = async (signedMsg: SignedMessage) => {
    const result = await verifySignature(
      signedMsg.message,
      signedMsg.signature
    );
    setVerificationResult(result);

    // Call the dashboard callback if provided
    if (onSignatureVerified && signedMsg.id && result) {
      onSignatureVerified(signedMsg.id, result.isValid);
    }
  };

  // Use external signed messages if provided, otherwise use internal ones
  const displaySignedMessages = externalSignedMessages || signedMessages;

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      {/* Message Signing Form */}
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 dark:text-white'>
            Sign a Message
          </h2>
        </div>

        <form onSubmit={handleSignMessage} className='space-y-4'>
          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
            >
              Enter your message:
            </label>
            <textarea
              id='message'
              value={message}
              onChange={e => setMessage(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
              rows={4}
              placeholder='Type your message here...'
              disabled={isLoading}
            />
          </div>

          <button
            type='submit'
            disabled={isLoading || !message.trim()}
            className='w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          >
            {isLoading ? 'Signing...' : 'Sign Message'}
          </button>
        </form>

        {error && (
          <div className='mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded'>
            {error}
          </div>
        )}
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-4'>
            Verification Result
          </h3>

          <div className='space-y-3'>
            <div
              className={`p-3 rounded-lg ${
                verificationResult.isValid
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
              }`}
            >
              <strong>Status:</strong>{' '}
              {verificationResult.isValid ? 'Valid ✓' : 'Invalid ✗'}
            </div>

            <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
              <strong className='text-gray-800 dark:text-white'>Signer:</strong>
              <p className='font-mono text-sm text-gray-600 dark:text-gray-300 break-all'>
                {verificationResult.signer}
              </p>
            </div>

            <div className='bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'>
              <strong className='text-gray-800 dark:text-white'>
                Original Message:
              </strong>
              <p className='text-gray-600 dark:text-gray-300 mt-1'>
                "{verificationResult.originalMessage}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signed Messages History */}
      {displaySignedMessages.length > 0 && (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xl font-bold text-gray-800 dark:text-white'>
              Message History ({displaySignedMessages.length})
            </h3>
            <button
              onClick={clearHistory}
              className='px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors'
            >
              Clear History
            </button>
          </div>

          <div className='space-y-4 max-h-96 overflow-y-auto'>
            {displaySignedMessages.map(
              (signedMsg: SignedMessage, index: number) => (
                <div
                  key={signedMsg.id || index}
                  className='border border-gray-200 dark:border-gray-600 rounded-lg p-4'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <span className='text-sm text-gray-500 dark:text-gray-400'>
                      {new Date(signedMsg.timestamp).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleVerifySignature(signedMsg)}
                      className='px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors'
                    >
                      Verify
                    </button>
                  </div>

                  <div className='space-y-2'>
                    <div>
                      <strong className='text-sm text-gray-700 dark:text-gray-300'>
                        Message:
                      </strong>
                      <p className='text-gray-600 dark:text-gray-400'>
                        "{signedMsg.message}"
                      </p>
                    </div>

                    <div>
                      <strong className='text-sm text-gray-700 dark:text-gray-300'>
                        Address:
                      </strong>
                      <p className='font-mono text-xs text-gray-600 dark:text-gray-400 break-all'>
                        {signedMsg.address || signedMsg.walletAddress}
                      </p>
                    </div>

                    <div>
                      <strong className='text-sm text-gray-700 dark:text-gray-300'>
                        Signature:
                      </strong>
                      <p className='font-mono text-xs text-gray-600 dark:text-gray-400 break-all'>
                        {signedMsg.signature}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSigner;
