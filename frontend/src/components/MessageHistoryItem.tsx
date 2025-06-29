import React from 'react';
import {
  CheckCircle,
  XCircle,
  FileSignature,
  Wallet,
  Clock,
} from 'lucide-react';
import { formatTimestamp } from '../lib/wallet';

interface MessageHistoryItemProps {
  message: {
    id: string;
    message: string;
    signature: string;
    timestamp: number;
    walletAddress: string;
    isValid?: boolean;
  };
}

const MessageHistoryItem: React.FC<MessageHistoryItemProps> = ({
  message: msg,
}) => {
  return (
    <div className='border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2'>
        <div className='font-medium text-gray-900 dark:text-white text-sm break-words truncate'>
          {msg.message}
        </div>
        {msg.isValid !== undefined && (
          <div
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap self-start flex items-center gap-1 ${
              msg.isValid
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {msg.isValid ? (
              <>
                <CheckCircle className='w-3 h-3' />
                Valid
              </>
            ) : (
              <>
                <XCircle className='w-3 h-3' />
                Invalid
              </>
            )}
          </div>
        )}
      </div>

      <div className='text-xs text-gray-500 dark:text-gray-400 space-y-1'>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
          <span className='flex items-center gap-1'>
            <FileSignature className='w-3 h-3' />
            Signature:
          </span>
          <span className='font-mono break-all truncate hover:text-wrap'>
            {msg.signature}
          </span>
        </div>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
          <span className='flex items-center gap-1'>
            <Wallet className='w-3 h-3' />
            Wallet:
          </span>
          <span className='font-mono truncate'>{msg.walletAddress}</span>
        </div>
        <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
          <span className='flex items-center gap-1'>
            <Clock className='w-3 h-3' />
            Time:
          </span>
          <span>{formatTimestamp(msg.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageHistoryItem;
