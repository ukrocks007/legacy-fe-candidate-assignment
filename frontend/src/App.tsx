import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DYNAMIC_ENVIRONMENT_ID } from './config';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ErrorPage from './pages/ErrorPage';
import './App.css';
import AppShell from './components/AppShell';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <DynamicContextProvider
        settings={{
          environmentId: DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
          appName: 'Web3 Message Signer',
          appLogoUrl: 'https://dynamic.xyz/favicon.ico',
        }}
      >
        <Router>
          <AppShell>
            <Routes>
              <Route path='/' element={<LandingPage />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='*' element={<ErrorPage />} />
            </Routes>
          </AppShell>
        </Router>
      </DynamicContextProvider>
    </ThemeProvider>
  );
}

export default App;
