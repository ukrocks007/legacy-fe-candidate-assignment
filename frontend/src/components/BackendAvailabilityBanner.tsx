import React from 'react';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { Server, AlertCircle, Clock } from 'lucide-react';

const BackendAvailabilityBanner: React.FC = () => {
  const { isHealthy, isChecking, healthMessage, healthMessageType, checkHealth } = useBackendHealth();

  // Don't show banner if backend is healthy
  if (isHealthy === true) {
    return null;
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
        <div className='flex items-center space-x-3'>
          <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <div className='flex-1'>
            <h3 className='font-medium text-blue-900 dark:text-blue-100'>
              Checking Backend Status
            </h3>
            <p className='text-sm text-blue-700 dark:text-blue-300'>
              Please wait while we check if the backend is available...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show appropriate banner based on health status
  const getStatusColor = () => {
    switch (healthMessageType) {
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-500',
          title: 'text-yellow-900 dark:text-yellow-100',
          text: 'text-yellow-700 dark:text-yellow-300',
          button: 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300',
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          icon: 'text-red-500',
          title: 'text-red-900 dark:text-red-100',
          text: 'text-red-700 dark:text-red-300',
          button: 'bg-red-500 hover:bg-red-600 disabled:bg-red-300',
        };
      default:
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-orange-200 dark:border-orange-800',
          icon: 'text-orange-500',
          title: 'text-orange-900 dark:text-orange-100',
          text: 'text-orange-700 dark:text-orange-300',
          button: 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300',
        };
    }
  };

  const colors = getStatusColor();
  const IconComponent = healthMessageType === 'warning' ? Clock : healthMessageType === 'error' ? AlertCircle : Server;

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-6`}>
      <div className='space-y-3'>
        <div className='flex items-center space-x-3'>
          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
          <div className='flex-1'>
            <h3 className={`font-medium ${colors.title}`}>
              Backend Unavailable
            </h3>
            <p className={`text-sm ${colors.text}`}>
              {healthMessage || 'The backend service is currently not responding.'}
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <button
            onClick={() => checkHealth()}
            disabled={isChecking}
            className={`flex items-center space-x-2 ${colors.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed`}
          >
            {isChecking ? (
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
            ) : (
              <Server className='w-4 h-4' />
            )}
            <span>
              {isChecking ? 'Checking...' : 'Retry Connection'}
            </span>
          </button>

          {healthMessageType === 'warning' && (
            <span className='text-xs text-yellow-600 dark:text-yellow-400'>
              If using Render, this may take 50+ seconds to initialize
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackendAvailabilityBanner;
