import React, { useState, useEffect, useRef } from 'react';
import {
  useDynamicContext,
  useMfa,
  useIsLoggedIn,
  useSyncMfaFlow,
} from '@dynamic-labs/sdk-react-core';
import type { MFADevice } from '@dynamic-labs/sdk-api-core';
import { Shield, AlertTriangle } from 'lucide-react';
import QRCodeUtil from 'qrcode';

type MfaRegisterData = {
  uri: string;
  secret: string;
};

type CurrentView = 'devices' | 'qr-code' | 'otp' | 'backup-codes';

const MFASetup: React.FC = () => {
  const [userDevices, setUserDevices] = useState<MFADevice[]>([]);
  const [mfaRegisterData, setMfaRegisterData] = useState<MfaRegisterData>();
  const [currentView, setCurrentView] = useState<CurrentView>('devices');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isLogged = useIsLoggedIn();
  const {
    addDevice,
    authenticateDevice,
    getUserDevices,
    getRecoveryCodes,
    completeAcknowledgement,
    deleteUserDevice,
  } = useMfa();

  const { user, primaryWallet, userWithMissingInfo } = useDynamicContext();

  const refreshUserDevices = async () => {
    try {
      const devices = await getUserDevices();
      setUserDevices(devices);
    } catch (err) {
      setError('Failed to load MFA devices');
    }
  };

  useEffect(() => {
    if (isLogged) {
      refreshUserDevices();
    }
  }, [isLogged]);

  useSyncMfaFlow({
    handler: async () => {
      if (userWithMissingInfo?.scope?.includes('requiresAdditionalAuth')) {
        const devices = await getUserDevices();
        if (devices.length === 0) {
          setError('');
          const { uri, secret } = await addDevice();
          setMfaRegisterData({ secret, uri });
          setCurrentView('qr-code');
        } else {
          setError('');
          setMfaRegisterData(undefined);
          setCurrentView('otp');
        }
      } else {
        const codes = await getRecoveryCodes();
        setBackupCodes(codes);
        setCurrentView('backup-codes');
      }
    },
  });

  const onAddDevice = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { uri, secret } = await addDevice();
      setMfaRegisterData({ secret, uri });
      setCurrentView('qr-code');
    } catch (err) {
      setError('Failed to add device');
    } finally {
      setIsLoading(false);
    }
  };

  const onQRCodeContinue = async () => {
    setError('');
    setMfaRegisterData(undefined);
    setCurrentView('otp');
  };

  const onOtpSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      await authenticateDevice({ code });
      const codes = await getRecoveryCodes();
      setBackupCodes(codes);
      setCurrentView('backup-codes');
      await refreshUserDevices();
      setOtpCode('');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDevice = async (deviceId: string, code: string) => {
    setIsLoading(true);
    setError('');
    try {
      const authToken = await authenticateDevice({ code, deviceId });
      if (!authToken) {
        throw new Error('Authentication failed');
      }
      await deleteUserDevice(deviceId, authToken);
      await refreshUserDevices();
    } catch (err: any) {
      setError(err.message || 'Failed to delete device');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRecoveryCodes = async () => {
    setIsLoading(true);
    try {
      const codes = await getRecoveryCodes(true);
      setBackupCodes(codes);
      setCurrentView('backup-codes');
    } catch (err) {
      setError('Failed to generate recovery codes');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !primaryWallet) {
    return null;
  }

  const verifiedDevices = userDevices.filter(device => device.verified);

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h3 className='text-xl font-bold text-gray-800 dark:text-white'>
            Multi-Factor Authentication
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
            Add an extra layer of security to your account using an
            authenticator app
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <span
            className={`text-sm px-2 py-1 rounded-full ${
              verifiedDevices.length > 0
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {verifiedDevices.length > 0 ? 'Enabled' : 'Not Enabled'}
          </span>
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded'>
          {error}
        </div>
      )}

      {/* Current View Content */}
      {currentView === 'devices' && (
        <DevicesView
          userDevices={userDevices}
          onAddDevice={onAddDevice}
          onDeleteDevice={deleteDevice}
          onGenerateRecoveryCodes={generateRecoveryCodes}
          isLoading={isLoading}
        />
      )}

      {currentView === 'qr-code' && mfaRegisterData && (
        <QRCodeView data={mfaRegisterData} onContinue={onQRCodeContinue} />
      )}

      {currentView === 'otp' && (
        <OTPView
          onSubmit={onOtpSubmit}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          isLoading={isLoading}
        />
      )}

      {currentView === 'backup-codes' && (
        <BackupCodesView
          codes={backupCodes}
          onAccept={() => {
            completeAcknowledgement();
            setCurrentView('devices');
          }}
        />
      )}

      {/* MFA Status Info */}
      <div className='mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <h4 className='font-semibold text-gray-800 dark:text-white mb-2'>
          Security Status
        </h4>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>
              Wallet Connected:
            </span>
            <span className='text-green-600 dark:text-green-400'>✓ Yes</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>
              MFA Enabled:
            </span>
            <span
              className={
                verifiedDevices.length > 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }
            >
              {verifiedDevices.length > 0 ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>
              Active Devices:
            </span>
            <span className='text-gray-800 dark:text-white'>
              {verifiedDevices.length} device
              {verifiedDevices.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supporting Components
const DevicesView: React.FC<{
  userDevices: MFADevice[];
  onAddDevice: () => void;
  onDeleteDevice: (deviceId: string, code: string) => void;
  onGenerateRecoveryCodes: () => void;
  isLoading: boolean;
}> = ({
  userDevices,
  onAddDevice,
  onDeleteDevice,
  onGenerateRecoveryCodes,
  isLoading,
}) => {
  const [deleteCode, setDeleteCode] = useState('');
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  return (
    <div className='space-y-4'>
      {userDevices.length > 0 ? (
        <div>
          <h4 className='font-semibold text-gray-800 dark:text-white mb-3'>
            Your MFA Devices
          </h4>
          <div className='space-y-2'>
            {userDevices.map(device => (
              <div
                key={device.id}
                className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
              >
                <div className='flex items-center space-x-3'>
                  <Shield className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  <div>
                    <p className='font-medium text-gray-800 dark:text-white'>
                      Authenticator App
                    </p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      ID:{' '}
                      {device.id
                        ? device.id.substring(0, 8) + '...'
                        : 'Unknown'}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      device.verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}
                  >
                    {device.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <button
                  onClick={() => device.id && setDeviceToDelete(device.id)}
                  className='text-red-500 hover:text-red-700 transition-colors'
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <div className='text-gray-400 dark:text-gray-500 mb-2'>
            <Shield className='w-9 h-9 mx-auto text-gray-400 dark:text-gray-500' />
          </div>
          <p className='text-gray-500 dark:text-gray-400'>
            No MFA devices configured
          </p>
          <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
            Add your first authenticator device to get started
          </p>
        </div>
      )}

      <div className='flex space-x-3'>
        <button
          onClick={onAddDevice}
          disabled={isLoading}
          className='flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
        >
          {isLoading ? 'Adding...' : 'Add New Device'}
        </button>

        {userDevices.length > 0 && (
          <button
            onClick={onGenerateRecoveryCodes}
            disabled={isLoading}
            className='px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors'
          >
            Recovery Codes
          </button>
        )}
      </div>

      {/* Delete Device Modal */}
      {deviceToDelete && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              Delete MFA Device
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4'>
              Enter your current MFA code to delete this device:
            </p>
            <input
              type='text'
              value={deleteCode}
              onChange={e => setDeleteCode(e.target.value)}
              placeholder='Enter 6-digit code'
              maxLength={6}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white mb-4'
            />
            <div className='flex space-x-3'>
              <button
                onClick={() => {
                  onDeleteDevice(deviceToDelete, deleteCode);
                  setDeviceToDelete(null);
                  setDeleteCode('');
                }}
                disabled={!deleteCode.trim() || isLoading}
                className='flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setDeviceToDelete(null);
                  setDeleteCode('');
                }}
                className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QRCodeView: React.FC<{
  data: MfaRegisterData;
  onContinue: () => void;
}> = ({ data, onContinue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCodeUtil.toCanvas(canvasRef.current, data.uri, (error: any) => {
      if (error) console.error(error);
    });
  }, [data.uri]);

  return (
    <div className='text-center space-y-4'>
      <h4 className='text-lg font-semibold text-gray-800 dark:text-white'>
        Scan QR Code
      </h4>
      <p className='text-gray-600 dark:text-gray-400'>
        Scan this QR code with your authenticator app (Google Authenticator,
        Authy, etc.)
      </p>

      <div className='flex justify-center'>
        <div className='p-4 bg-white rounded-lg'>
          <canvas ref={canvasRef} className='max-w-full' />
        </div>
      </div>

      <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-1'>
          Manual entry key:
        </p>
        <p className='font-mono text-sm text-gray-800 dark:text-white break-all'>
          {data.secret}
        </p>
      </div>

      <button
        onClick={onContinue}
        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
      >
        I've Added This Device
      </button>
    </div>
  );
};

const OTPView: React.FC<{
  onSubmit: (code: string) => void;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isLoading: boolean;
}> = ({ onSubmit, otpCode, setOtpCode, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otpCode);
  };

  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
          Enter Verification Code
        </h4>
        <p className='text-gray-600 dark:text-gray-400'>
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          value={otpCode}
          onChange={e => setOtpCode(e.target.value)}
          placeholder='123456'
          maxLength={6}
          className='w-full px-3 py-2 text-center text-lg font-mono border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
        />
        <button
          type='submit'
          disabled={!otpCode.trim() || isLoading}
          className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
    </div>
  );
};

const BackupCodesView: React.FC<{
  codes: string[];
  onAccept: () => void;
}> = ({ codes, onAccept }) => {
  return (
    <div className='space-y-4'>
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
          Backup Recovery Codes
        </h4>
        <p className='text-gray-600 dark:text-gray-400'>
          Save these codes in a safe place. You can use them to access your
          account if you lose your authenticator device.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
        {codes.map((code, index) => (
          <div
            key={index}
            className='font-mono text-sm p-2 bg-white dark:bg-gray-800 rounded border text-center'
          >
            {code}
          </div>
        ))}
      </div>

      <div className='p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg'>
        <p className='text-sm text-yellow-800 dark:text-yellow-200'>
          <AlertTriangle className='w-4 h-4 inline mr-1' />
          <strong>Important:</strong> These codes can only be used once each.
          Store them securely and don't share them.
        </p>
      </div>

      <button
        onClick={onAccept}
        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors'
      >
        I've Saved These Codes
      </button>
    </div>
  );
};

export default MFASetup;
