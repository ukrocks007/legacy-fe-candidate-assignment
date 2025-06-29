import { useState, useCallback } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import type { SignedMessage, VerificationResult } from '../types';
import { API_BASE_URL, API_ENDPOINTS } from '../config';
import { authService } from '../services/authService';

export const useMessageSigner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedMessages, setSignedMessages] = useState<SignedMessage[]>(() => {
    const stored = localStorage.getItem('signedMessages');
    return stored ? JSON.parse(stored) : [];
  });

  const { primaryWallet } = useDynamicContext();

  const signMessage = useCallback(
    async (message: string): Promise<SignedMessage | null> => {
      if (!primaryWallet) {
        setError('No wallet connected');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Sign the message using Dynamic's wallet connector
        const signature = await primaryWallet.signMessage(message);

        if (!signature) {
          throw new Error('Failed to sign message');
        }

        const address = primaryWallet.address;
        if (!address) {
          throw new Error('Failed to get address');
        }

        const signedMessage: SignedMessage = {
          message,
          signature,
          address,
          timestamp: Date.now(),
        };

        const updatedMessages = [...signedMessages, signedMessage];
        setSignedMessages(updatedMessages);
        localStorage.setItem('signedMessages', JSON.stringify(updatedMessages));

        return signedMessage;
      } catch (err: any) {
        setError(err.message || 'Failed to sign message');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [primaryWallet, signedMessages]
  );

  const verifySignature = useCallback(
    async (
      message: string,
      signature: string
    ): Promise<VerificationResult | null> => {
      setIsLoading(true);
      setError(null);

      try {
        let response: Response;

        // Use authenticated request if user is authenticated
        if (authService.isAuthenticated()) {
          response = await authService.authenticatedRequest(
            `${API_BASE_URL}${API_ENDPOINTS.VERIFY_SIGNATURE}`,
            {
              method: 'POST',
              body: JSON.stringify({ message, signature }),
            }
          );
        } else {
          // Fallback to regular request for unauthenticated users
          response = await fetch(
            `${API_BASE_URL}${API_ENDPOINTS.VERIFY_SIGNATURE}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message, signature }),
            }
          );
        }

        if (!response.ok) {
          throw new Error('Failed to verify signature');
        }

        const result: VerificationResult = await response.json();
        return result;
      } catch (err: any) {
        setError(err.message || 'Failed to verify signature');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setSignedMessages([]);
    localStorage.removeItem('signedMessages');
  }, []);

  return {
    signMessage,
    verifySignature,
    clearHistory,
    signedMessages,
    isLoading,
    error,
  };
};
