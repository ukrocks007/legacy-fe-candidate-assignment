import React from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface HealthStatusProps {
  isHealthy: boolean | null;
  isChecking: boolean;
  healthMessage: string | null;
  healthMessageType: 'success' | 'warning' | 'error' | 'info' | null;
  onRetryClick?: () => void;
}

const HealthStatus: React.FC<HealthStatusProps> = ({
  isHealthy,
  isChecking,
  healthMessage,
  healthMessageType,
  onRetryClick,
}) => {
  if (!healthMessage) return null;

  const getIcon = () => {
    switch (healthMessageType) {
      case 'success':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'warning':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      case 'error':
        return <AlertCircle className='w-4 h-4 text-red-500' />;
      case 'info':
        return <Clock className='w-4 h-4 text-blue-500 animate-spin' />;
      default:
        return null;
    }
  };

  const getBackgroundClass = () => {
    switch (healthMessageType) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
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

  return (
    <div className={`border rounded-lg p-3 ${getBackgroundClass()}`}>
      <div className='flex items-start space-x-2'>
        <div className='flex-shrink-0 mt-0.5'>{getIcon()}</div>
        <div className='flex-1'>
          <p className={`text-sm ${getTextClass()}`}>{healthMessage}</p>
          {!isHealthy && !isChecking && onRetryClick && (
            <button
              onClick={onRetryClick}
              className='mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline'
            >
              Retry health check
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthStatus;
