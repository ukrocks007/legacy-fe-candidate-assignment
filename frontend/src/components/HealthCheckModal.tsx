import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';

interface HealthCheckModalProps {
  isOpen: boolean;
  isHealthy: boolean | null;
  isChecking: boolean;
  healthMessage: string | null;
  healthMessageType: 'success' | 'warning' | 'error' | 'info' | null;
  onClose: () => void;
  onRetryClick?: () => void;
}

const HealthCheckModal: React.FC<HealthCheckModalProps> = ({
  isOpen,
  isHealthy,
  isChecking,
  healthMessage,
  healthMessageType,
  onClose,
  onRetryClick,
}) => {
  if (!isOpen || !healthMessage) return null;

  const getIcon = () => {
    switch (healthMessageType) {
      case 'success':
        return <CheckCircle className='w-8 h-8 text-green-500' />;
      case 'warning':
        return <AlertTriangle className='w-8 h-8 text-yellow-500' />;
      case 'error':
        return <AlertCircle className='w-8 h-8 text-red-500' />;
      case 'info':
        return <Clock className='w-8 h-8 text-blue-500 animate-spin' />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (healthMessageType) {
      case 'success':
        return 'Backend Connected';
      case 'warning':
        return 'Backend Starting Up';
      case 'error':
        return 'Backend Unavailable';
      case 'info':
        return 'Checking Backend...';
      default:
        return 'Backend Status';
    }
  };

  const getBackgroundClass = () => {
    switch (healthMessageType) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTextClass = () => {
    switch (healthMessageType) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  const shouldShowCloseButton = !isChecking && healthMessageType !== 'info';
  const isSuccessState = healthMessageType === 'success';

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {getTitle()}
          </h3>
          {shouldShowCloseButton && (
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
            >
              <X className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={`p-6 ${getBackgroundClass()}`}>
          <div className='flex items-start space-x-4'>
            <div className='flex-shrink-0'>{getIcon()}</div>
            <div className='flex-1'>
              <p className={`text-sm leading-relaxed ${getTextClass()}`}>
                {healthMessage}
              </p>

              {!isHealthy && !isChecking && onRetryClick && (
                <button
                  onClick={onRetryClick}
                  className='mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors'
                >
                  Retry Connection
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        {shouldShowCloseButton && !isSuccessState && (
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg'>
            <div className='flex justify-end'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                Continue Anyway
              </button>
            </div>
          </div>
        )}

        {/* Success state footer with auto-close info */}
        {isSuccessState && (
          <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20 rounded-b-lg'>
            <p className='text-xs text-green-600 dark:text-green-400 text-center'>
              This dialog will close automatically...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckModal;
