import React, { useState, useRef, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useNavigate } from 'react-router-dom';
import { User2, LogOut } from 'lucide-react';

const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { primaryWallet, handleLogOut } = useDynamicContext();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsOpen(false);
    handleLogOut();
    navigate('/');
  };

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  if (!primaryWallet) {
    return null;
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='cursor-pointer w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'
      >
        <span className='text-white text-sm'>
          <User2 className='w-6 h-6' />
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
          <div className='py-1'>
            {/* Profile Option */}
            <div
              onClick={handleProfile}
              className='cursor-pointer bg-transparent dark:bg-gray-800 w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2'
            >
              <User2 className='w-4 h-4' />
              <span>Profile</span>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200 dark:border-gray-600 my-1'></div>

            {/* Sign Out Option */}
            <div
              onClick={handleSignOut}
              className='cursor-pointer w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2'
            >
              <LogOut className='w-4 h-4' />
              <span>Sign Out</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
