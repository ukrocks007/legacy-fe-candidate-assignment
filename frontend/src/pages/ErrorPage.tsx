import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'>
      <div className='text-center'>
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4'>
            404
          </h1>
          <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2'>
            Page Not Found
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-8'>
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className='space-y-4'>
          <Link
            to='/'
            className='inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
          >
            Go to Landing Page
          </Link>

          <div className='text-sm text-gray-500 dark:text-gray-400'>
            <p>Lost? Try going back to the homepage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
