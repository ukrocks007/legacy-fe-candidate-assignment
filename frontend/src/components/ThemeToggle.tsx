import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <span
      onClick={toggleTheme}
      className='cursor-pointer bg-transparent p-2 rounded-full dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'
    >
      {isDarkMode ? (
        <Sun className='text-yellow-500' />
      ) : (
        <Moon className='text-blue-500' />
      )}
    </span>
  );
}
