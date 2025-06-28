import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="max-h-screen w-full bg-gray-50 dark:bg-gray-900">
            <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
            {children}
        </div>
    );
}