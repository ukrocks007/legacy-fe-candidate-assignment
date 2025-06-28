import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { PenTool } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserDropdown from './UserDropdown';
import Tooltip from './Tooltip';
import { truncateAddress } from '../lib/wallet';
import { Link } from 'react-router-dom';

export default function Header() {
  const { primaryWallet } = useDynamicContext();

  if (!primaryWallet) {
    return (
      <header className='flex justify-end p-4'>
        <ThemeToggle />
      </header>
    );
  }

  return (
    <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-4 cursor-pointer'>
            <Link to='/'>
              <h2 className='inline-flex gap-2 font-semibold text-gray-900 dark:text-white items-center align-middle'>
                <PenTool className='w-7 h-7 text-blue-500' />
                <span className='my-auto'>Web3 Message Signer</span>
              </h2>
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='text-sm text-gray-600 dark:text-gray-400'>
              Connected as:
              <Tooltip content={primaryWallet!.address} position='bottom'>
                <span className='font-mono ml-1 text-gray-900 dark:text-white cursor-help'>
                  {truncateAddress(primaryWallet!.address)}
                </span>
              </Tooltip>
            </div>
            <UserDropdown />
            {/* <DynamicWidget /> */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
