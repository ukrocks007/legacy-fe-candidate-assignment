import React, { useState, useEffect } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface MFAMethod {
    id: string;
    type: 'email' | 'sms' | 'authenticator';
    value: string;
    verified: boolean;
}

const MFASetup: React.FC = () => {
    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [mfaMethods, setMfaMethods] = useState<MFAMethod[]>([]);
    const [newMethodType, setNewMethodType] = useState<'email' | 'sms' | 'authenticator'>('email');
    const [newMethodValue, setNewMethodValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [pendingVerification, setPendingVerification] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, primaryWallet } = useDynamicContext();

    useEffect(() => {
        // Load existing MFA methods from localStorage
        const savedMethods = localStorage.getItem('mfaMethods');
        if (savedMethods) {
            setMfaMethods(JSON.parse(savedMethods));
        }
    }, []);

    const saveMfaMethods = (methods: MFAMethod[]) => {
        setMfaMethods(methods);
        localStorage.setItem('mfaMethods', JSON.stringify(methods));
    };

    const addMfaMethod = async () => {
        if (!newMethodValue.trim()) {
            setError('Please enter a valid value for the MFA method');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simulate API call to setup MFA method
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newMethod: MFAMethod = {
                id: Date.now().toString(),
                type: newMethodType,
                value: newMethodValue,
                verified: false,
            };

            const updatedMethods = [...mfaMethods, newMethod];
            saveMfaMethods(updatedMethods);

            // Set pending verification
            setPendingVerification(newMethod.id);
            setNewMethodValue('');

            // In a real implementation, this would trigger sending verification code
            console.log(`Verification code sent to ${newMethodValue} via ${newMethodType}`);
        } catch (err) {
            setError('Failed to add MFA method');
        } finally {
            setIsLoading(false);
        }
    };

    const verifyMfaMethod = async () => {
        if (!verificationCode.trim() || !pendingVerification) {
            setError('Please enter the verification code');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Simulate verification process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real implementation, this would verify with the backend
            if (verificationCode === '123456') { // Mock verification
                const updatedMethods = mfaMethods.map(method =>
                    method.id === pendingVerification
                        ? { ...method, verified: true }
                        : method
                );
                saveMfaMethods(updatedMethods);
                setPendingVerification(null);
                setVerificationCode('');
            } else {
                setError('Invalid verification code. Try "123456" for demo.');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const removeMfaMethod = (methodId: string) => {
        const updatedMethods = mfaMethods.filter(method => method.id !== methodId);
        saveMfaMethods(updatedMethods);
        if (pendingVerification === methodId) {
            setPendingVerification(null);
            setVerificationCode('');
        }
    };

    const getMfaIcon = (type: string) => {
        switch (type) {
            case 'email':
                return '📧';
            case 'sms':
                return '📱';
            case 'authenticator':
                return '🔐';
            default:
                return '🔒';
        }
    };

    if (!user || !primaryWallet) {
        return null;
    }

    const verifiedMethods = mfaMethods.filter(method => method.verified);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Multi-Factor Authentication
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Add an extra layer of security to your account
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${verifiedMethods.length > 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                        {verifiedMethods.length > 0 ? 'Enabled' : 'Not Enabled'}
                    </span>
                    <button
                        onClick={() => setIsSetupOpen(!isSetupOpen)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        {isSetupOpen ? 'Close' : 'Setup MFA'}
                    </button>
                </div>
            </div>

            {/* Current MFA Methods */}
            {mfaMethods.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                        Current MFA Methods
                    </h4>
                    <div className="space-y-2">
                        {mfaMethods.map((method) => (
                            <div
                                key={method.id}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-xl">{getMfaIcon(method.type)}</span>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white capitalize">
                                            {method.type}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {method.value}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${method.verified
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                        }`}>
                                        {method.verified ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeMfaMethod(method.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MFA Setup Form */}
            {isSetupOpen && (
                <div className="space-y-4">
                    {!pendingVerification ? (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    MFA Method Type
                                </label>
                                <select
                                    value={newMethodType}
                                    onChange={(e) => setNewMethodType(e.target.value as 'email' | 'sms' | 'authenticator')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                    <option value="authenticator">Authenticator App</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {newMethodType === 'email' ? 'Email Address' :
                                        newMethodType === 'sms' ? 'Phone Number' :
                                            'Authenticator Setup'}
                                </label>
                                <input
                                    type={newMethodType === 'email' ? 'email' : 'text'}
                                    value={newMethodValue}
                                    onChange={(e) => setNewMethodValue(e.target.value)}
                                    placeholder={
                                        newMethodType === 'email' ? 'your.email@example.com' :
                                            newMethodType === 'sms' ? '+1234567890' :
                                                'Scan QR code with your authenticator app'
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <button
                                onClick={addMfaMethod}
                                disabled={isLoading || !newMethodValue.trim()}
                                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Adding...' : 'Add MFA Method'}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                                <p className="text-blue-800 dark:text-blue-200 mb-2">
                                    Verification code sent! Please check your {
                                        mfaMethods.find(m => m.id === pendingVerification)?.type
                                    }.
                                </p>
                                <p className="text-sm text-blue-600 dark:text-blue-300">
                                    For demo purposes, use code: <strong>123456</strong>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={verifyMfaMethod}
                                    disabled={isLoading || !verificationCode.trim()}
                                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify Code'}
                                </button>
                                <button
                                    onClick={() => {
                                        setPendingVerification(null);
                                        setVerificationCode('');
                                        setError(null);
                                    }}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded">
                            {error}
                        </div>
                    )}
                </div>
            )}

            {/* MFA Status Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                    Security Status
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Wallet Connected:</span>
                        <span className="text-green-600 dark:text-green-400">✓ Yes</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">MFA Enabled:</span>
                        <span className={verifiedMethods.length > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {verifiedMethods.length > 0 ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Active Methods:</span>
                        <span className="text-gray-800 dark:text-white">
                            {verifiedMethods.length} method{verifiedMethods.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MFASetup;
