import React from 'react';
import { formatTimestamp } from '../lib/wallet';

interface MessageHistoryProps {
  signedMessages: {
    id: string;
    message: string;
    signature: string;
    timestamp: number;
    walletAddress: string;
    isValid?: boolean;
  }[];
  clearHistory: () => void;
}

const MessageHistory: React.FC<MessageHistoryProps> = ({
  signedMessages,
  clearHistory,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
      <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
            📜 Message Signing History
          </h2>
          {signedMessages.length > 0 && (
            <button
              onClick={clearHistory}
              className='text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors self-start sm:self-auto'
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      <div className='p-6'>
        {signedMessages.length === 0 ? (
          <div className='text-center py-8'>
            <div className='text-gray-400 dark:text-gray-500 mb-2'>
              <span className='inline-block w-9 h-9'>📄</span>
            </div>
            <p className='text-gray-500 dark:text-gray-400'>
              No messages signed yet
            </p>
            <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
              Sign your first message to see it here
            </p>
          </div>
        ) : (
          <div className='space-y-4 max-h-96 overflow-y-auto custom-scrollbar px-2'>
            {signedMessages.map(msg => (
              <div
                key={msg.id}
                className='border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2'>
                  <div className='font-medium text-gray-900 dark:text-white text-sm break-words truncate'>
                    {msg.message}
                  </div>
                  {msg.isValid !== undefined && (
                    <div
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap self-start ${
                        msg.isValid
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {msg.isValid ? '✅ Valid' : '❌ Invalid'}
                    </div>
                  )}
                </div>

                <div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
                  <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                    <span>Signature:</span>
                    <span className='font-mono break-all truncate hover:text-wrap'>
                      {msg.signature}
                    </span>
                  </div>
                  <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                    <span>Wallet:</span>
                    <span className='font-mono truncate'>
                      {msg.walletAddress}
                    </span>
                  </div>
                  <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
                    <span>Time:</span>
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHistory;
