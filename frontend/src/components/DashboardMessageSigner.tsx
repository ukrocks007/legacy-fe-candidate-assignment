import React, { useState } from 'react';
import { useMessageSigner } from '../hooks/useMessageSigner';
import type { VerificationResult } from '../types';
import {
  InfoIcon,
  Signature,
  CheckCircle,
  XCircle,
  User,
  Clock,
  FileText,
} from 'lucide-react';

interface DashboardMessageSignerProps {
  onMessageSigned: (message: string, signature: string) => void;
  onSignatureVerified: (result: VerificationResult) => void;
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
  signedMessages,
}) => {
  const [message, setMessage] = useState('');
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);

  const { signMessage, verifySignature, isLoading, error } = useMessageSigner();

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
      onMessageSigned(signedMessage.message, signedMessage.signature);

      // Auto-verify the signature immediately after signing
      const result = await verifySignature(
        signedMessage.message,
        signedMessage.signature
      );
      if (result) {
        setVerificationResult(result);
        // Find the latest message ID (it would be the first in the array after the callback updates)
        setTimeout(() => {
          onSignatureVerified(result);
        }, 10);
      }
    }
  };

  // Get the most recent signed message for the verification card
  const latestMessage = signedMessages[0];

  return (
    <div className='space-y-6'>
      {/* Combined Sign and Verify Message Card */}
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <h2 className='inline-flex gap-2 items-center text-lg font-semibold text-gray-900 dark:text-white'>
              <Signature className='w-6 h-6 text-indigo-600 dark:text-indigo-400 my-auto' />{' '}
              Sign & Verify Message
            </h2>
          </div>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
            Enter a message, sign it cryptographically, and verify its
            authenticity in one step
          </p>
        </div>

        <div className='p-6'>
          <form onSubmit={handleSignMessage} className='space-y-6'>
            <div>
              <label
                htmlFor='message'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
              >
                Enter your custom message
              </label>
              <textarea
                id='message'
                value={message}
                onChange={e => setMessage(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 bg-gray-100 dark:text-white text-gray-950 resize-none'
                rows={3}
                placeholder='Type your message here...'
                disabled={isLoading}
              />
            </div>

            <div className='flex justify-center'>
              <button
                type='submit'
                disabled={isLoading || !message.trim()}
                className='w-full sm:w-auto min-w-[200px] bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <span className='animate-spin inline-block h-4 w-4 border-2 border-t-transparent border-indigo-600 rounded-full'></span>
                ) : (
                  'Sign & Verify Message'
                )}
              </button>
            </div>
          </form>

          {/* Latest Message Preview */}
          {latestMessage && (
            <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md'>
              <h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>
                Latest Signed Message
              </h3>
              <div className='space-y-2 text-xs'>
                <div>
                  <span className='font-medium text-gray-600 dark:text-gray-400'>
                    Message:
                  </span>
                  <p className='text-gray-800 dark:text-gray-200 mt-1 break-words'>
                    "{latestMessage.message}"
                  </p>
                </div>
                <div>
                  <span className='font-medium text-gray-600 dark:text-gray-400'>
                    Signature:
                  </span>
                  <p className='font-mono text-gray-800 dark:text-gray-200 mt-1 break-all'>
                    {latestMessage.signature}
                  </p>
                </div>
                <div>
                  <span className='font-medium text-gray-600 dark:text-gray-400'>
                    Time:
                  </span>
                  <p className='text-gray-800 dark:text-gray-200 mt-1'>
                    {new Date(latestMessage.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className='mt-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md text-sm flex items-center gap-2'>
              <XCircle className='w-4 h-4 flex-shrink-0' />
              {error}
            </div>
          )}

          {/* Verification Result */}
          {verificationResult && (
            <div
              className={`mt-4 p-3 rounded-md text-sm ${
                verificationResult.isValid
                  ? 'bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              }`}
            >
              <div className='font-medium mb-2 flex items-center gap-2'>
                {verificationResult.isValid ? (
                  <>
                    <CheckCircle className='w-4 h-4' />
                    Signature is valid!
                  </>
                ) : (
                  <>
                    <XCircle className='w-4 h-4' />
                    Invalid signature
                  </>
                )}
              </div>
              <div className='text-xs space-y-1'>
                <div className='flex items-center gap-1'>
                  <User className='w-3 h-3' />
                  Signed by:{' '}
                  <span className='font-mono'>{verificationResult.signer}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Clock className='w-3 h-3' />
                  Verified: {new Date().toLocaleString()}
                </div>
                <div className='flex items-center gap-1 truncate'>
                  <FileText className='w-3 h-3 flex-shrink-0' />
                  Original: "{verificationResult.originalMessage}"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Show message when no signed messages */}
      {signedMessages.length === 0 && (
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
          <div className='text-center'>
            <div className='text-blue-600 dark:text-blue-400 mb-2'>
              <InfoIcon className='inline-block w-9 h-9' />
            </div>
            <h3 className='text-lg font-medium text-blue-900 dark:text-blue-100 mb-2'>
              Welcome to Web3 Message Signer
            </h3>
            <p className='text-blue-700 dark:text-blue-300 text-sm'>
              Enter a message above and click "Sign & Verify Message" to sign it
              cryptographically and verify its authenticity automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMessageSigner;
