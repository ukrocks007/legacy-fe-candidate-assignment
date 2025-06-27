import { useState, useCallback } from 'react';

interface MFAMethod {
  id: string;
  type: 'email' | 'sms' | 'authenticator';
  value: string;
  verified: boolean;
}

interface MFAChallenge {
  challengeId: string;
  method: MFAMethod;
  expiresAt: number;
}

export const useMFAVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<MFAChallenge | null>(
    null
  );
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getMfaMethods = useCallback((): MFAMethod[] => {
    const savedMethods = localStorage.getItem('mfaMethods');
    if (savedMethods) {
      const methods = JSON.parse(savedMethods);
      return methods.filter((method: MFAMethod) => method.verified);
    }
    return [];
  }, []);

  const initiateVerification = useCallback(async (): Promise<boolean> => {
    const methods = getMfaMethods();

    if (methods.length === 0) {
      // No MFA methods configured, allow operation
      return true;
    }

    // Use the first available method for simplicity
    const method = methods[0];

    const challenge: MFAChallenge = {
      challengeId: Date.now().toString(),
      method,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    setCurrentChallenge(challenge);
    setError(null);

    // In a real implementation, this would trigger sending the verification code
    console.log(`MFA challenge initiated for ${method.type}: ${method.value}`);

    return false; // Requires verification
  }, [getMfaMethods]);

  const verifyCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!currentChallenge) {
        setError('No active verification challenge');
        return false;
      }

      if (Date.now() > currentChallenge.expiresAt) {
        setError('Verification code expired');
        setCurrentChallenge(null);
        return false;
      }

      setIsVerifying(true);
      setError(null);

      try {
        // Simulate verification API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real implementation, this would verify with the backend
        if (code === '123456') {
          // Mock verification
          setCurrentChallenge(null);
          setVerificationCode('');
          return true;
        } else {
          setError('Invalid verification code. Try "123456" for demo.');
          return false;
        }
      } catch (err) {
        setError('Verification failed');
        return false;
      } finally {
        setIsVerifying(false);
      }
    },
    [currentChallenge]
  );

  const cancelVerification = useCallback(() => {
    setCurrentChallenge(null);
    setVerificationCode('');
    setError(null);
  }, []);

  const requiresMFA = getMfaMethods().length > 0;

  return {
    requiresMFA,
    isVerifying,
    currentChallenge,
    verificationCode,
    setVerificationCode,
    error,
    initiateVerification,
    verifyCode,
    cancelVerification,
  };
};
