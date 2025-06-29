import React from 'react';
import { Scroll, FileText } from 'lucide-react';
import MessageHistoryItem from './MessageHistoryItem';

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
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
            <Scroll className='w-5 h-5' />
            Message Signing History
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
              <FileText className='w-9 h-9 mx-auto' />
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
              <MessageHistoryItem key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageHistory;
