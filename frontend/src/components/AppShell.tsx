import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='max-h-screen w-full'>
      <Header />
      <div className='min-h-[calc(100vh-65px)]'>{children}</div>
    </div>
  );
}
