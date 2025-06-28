import React from 'react';

interface MFAVerificationModalProps {
  isOpen: boolean;
  method: {
    type: 'email' | 'sms' | 'authenticator';
    value: string;
  };
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onVerify: (code: string) => Promise<boolean>;
  onCancel: () => void;
  isVerifying: boolean;
  error: string | null;
}

const MFAVerificationModal: React.FC<MFAVerificationModalProps> = ({
  isOpen,
  method,
  verificationCode,
  setVerificationCode,
  onVerify,
  onCancel,
  isVerifying,
  error,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onVerify(verificationCode);
    if (!success) {
      // Error handling is managed by the hook
    }
  };

  const getMfaIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '📧';
      case 'sms':
        return '📱';
      case 'authenticator':
        return '🔐';
      default:
        return '🔒';
    }
  };

  const getMethodDescription = (type: string) => {
    switch (type) {
      case 'email':
        return 'We sent a verification code to your email';
      case 'sms':
        return 'We sent a verification code to your phone';
      case 'authenticator':
        return 'Enter the code from your authenticator app';
      default:
        return 'Enter your verification code';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='text-center mb-6'>
          <div className='text-4xl mb-3'>{getMfaIcon(method.type)}</div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
            Multi-Factor Authentication
          </h3>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            {getMethodDescription(method.type)}
          </p>
          <p className='text-gray-800 dark:text-white font-medium mt-2'>
            {method.value}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Verification Code
            </label>
            <input
              type='text'
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              placeholder='Enter 6-digit code'
              maxLength={6}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest'
              autoFocus
              disabled={isVerifying}
            />
          </div>

          {error && (
            <div className='p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded text-sm'>
              {error}
            </div>
          )}

          <div className='bg-blue-50 dark:bg-blue-900 p-3 rounded-lg'>
            <p className='text-blue-800 dark:text-blue-200 text-sm'>
              For demo purposes, use code: <strong>123456</strong>
            </p>
          </div>

          <div className='flex space-x-3'>
            <button
              type='submit'
              disabled={isVerifying || !verificationCode.trim()}
              className='flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type='button'
              onClick={onCancel}
              disabled={isVerifying}
              className='px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors'
            >
              Cancel
            </button>
          </div>
        </form>

        <div className='mt-4 text-center'>
          <button
            onClick={() => {
              // In a real implementation, this would resend the code
              console.log('Resending verification code...');
            }}
            disabled={isVerifying}
            className='text-blue-500 hover:text-blue-600 text-sm underline disabled:text-gray-400'
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default MFAVerificationModal;
