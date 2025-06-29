import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { User, Trash2, Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MFASetup from '../components/MFASetup';

const Profile: React.FC = () => {
  const { user, primaryWallet } = useDynamicContext();
  const { isAuthenticated, user: backendUser } = useAuth();

  return (
    <div className='min-h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='space-y-6'>
          {/* Profile Header */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='p-6'>
              <div className='flex items-center space-x-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                  <User className='w-8 h-8 text-white' />
                </div>
                <div>
                  <span className='text-xl font-bold text-gray-900 dark:text-white'>
                    Profile Settings
                  </span>
                  <p className='text-gray-600 dark:text-gray-400'>
                    Manage your account settings and security preferences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Authentication Status
              </h2>
            </div>
            <div className='p-6'>
              <div className='flex items-center space-x-3'>
                {isAuthenticated ? (
                  <>
                    <Shield className='w-6 h-6 text-green-500' />
                    <div>
                      <h3 className='font-medium text-green-700 dark:text-green-400'>
                        Backend Authentication Active
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        You are authenticated with the backend and can access
                        all features.
                      </p>
                      {backendUser && (
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                          Backend User ID:{' '}
                          <span className='font-mono'>{backendUser.id}</span>
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <ShieldAlert className='w-6 h-6 text-yellow-500' />
                    <div>
                      <h3 className='font-medium text-yellow-700 dark:text-yellow-400'>
                        Wallet Connected Only
                      </h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        You need to authenticate with the backend to access all
                        features.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Account Information
              </h2>
            </div>
            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Wallet Address
                  </label>
                  <div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg align-middle h-[48px]'>
                    <span className='font-mono text-sm text-gray-900 dark:text-white my-auto items-center align-middle truncate'>
                      {primaryWallet?.address}
                    </span>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Wallet Type
                  </label>
                  <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {primaryWallet?.connector?.name || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Wallet Chain
                  </label>
                  <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {primaryWallet?.chain || 'Ethereum'}
                    </span>
                  </div>
                </div>

                {user?.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Email (Dynamic.xyz)
                    </label>
                    <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                      <span className='text-sm text-gray-900 dark:text-white'>
                        {user.email}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MFA Setup Section */}
          <MFASetup />

          {/* Account Actions */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
            <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                Account Actions
              </h2>
            </div>
            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <button
                  onClick={() => {
                    localStorage.removeItem('signedMessages');
                    alert('Message history cleared successfully');
                  }}
                  className='p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left'
                >
                  <div className='flex items-center space-x-3'>
                    <Trash2 className='w-5 h-5 text-red-500' />
                    <div>
                      <h3 className='font-medium'>Clear Message History</h3>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Remove all signed messages from local storage
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
