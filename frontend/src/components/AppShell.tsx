export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-h-screen w-full bg-gray-50 dark:bg-gray-900 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {children}
        </div>
    );
}