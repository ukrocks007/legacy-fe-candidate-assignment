import React from 'react';

interface QuickStatsProps {
  signedMessages: {
    isValid?: boolean;
  }[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ signedMessages }) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6'>
      <h3 className='text-sm font-medium text-gray-900 dark:text-white mb-4'>
        Quick Stats
      </h3>
      <div className='grid grid-cols-2 gap-4'>
        <div className='text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg'>
          <div className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
            {signedMessages.length}
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Messages Signed
          </div>
        </div>
        <div className='text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
          <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
            {signedMessages.filter(msg => msg.isValid === true).length}
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            Verified Valid
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
