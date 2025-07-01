import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { apiService } from '../services/api';

const AuthDebugger: React.FC = () => {
    const [log, setLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const addLog = (message: string) => {
        console.log(message);
        setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const clearLog = () => setLog([]);

    const testBackendConnection = async () => {
        setLoading(true);
        try {
            addLog('🔍 Testing backend connection...');
            const health = await apiService.healthCheck();
            addLog(`✅ Backend is alive: ${JSON.stringify(health)}`);
        } catch (error) {
            addLog(`❌ Backend connection failed: ${error}`);
        }
        setLoading(false);
    };

    const testFirebaseOnly = async () => {
        setLoading(true);
        try {
            addLog('🔥 Testing Firebase only...');

            // Try to create user
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, 'test@example.com', 'password123');
                addLog(`✅ Firebase user created: ${userCredential.user.email}`);

                // Try to sign in
                await signInWithEmailAndPassword(auth, 'test@example.com', 'password123');
                addLog(`✅ Firebase sign in successful`);

            } catch (error: unknown) {
                const firebaseError = error as { code?: string; message?: string };
                if (firebaseError.code === 'auth/email-already-in-use') {
                    addLog(`⚠️ User exists, trying sign in...`);
                    await signInWithEmailAndPassword(auth, 'test@example.com', 'password123');
                    addLog(`✅ Firebase sign in successful`);
                } else {
                    throw error;
                }
            }
        } catch (error) {
            addLog(`❌ Firebase test failed: ${error}`);
        }
        setLoading(false);
    };

    const testFullFlow = async () => {
        setLoading(true);
        try {
            addLog('🚀 Testing full authentication flow...');

            // Step 1: Test backend
            await testBackendConnection();

            // Step 2: Test Firebase
            addLog('🔥 Creating Firebase user...');
            const email = 'admin@gmail.com';
            const password = 'admin';

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                addLog(`✅ Firebase user created: ${userCredential.user.email}`);
            } catch (error: unknown) {
                const firebaseError = error as { code?: string; message?: string };
                if (firebaseError.code === 'auth/email-already-in-use') {
                    addLog(`⚠️ User exists, signing in...`);
                    await signInWithEmailAndPassword(auth, email, password);
                    addLog(`✅ Firebase sign in successful`);
                } else {
                    throw error;
                }
            }

            // Step 3: Test backend registration
            addLog('📡 Testing backend registration...');
            await apiService.registerUser({
                email,
                displayName: 'Admin User',
                role: 'admin'
            });
            addLog(`✅ Backend registration successful`);

            // Step 4: Test profile fetch
            addLog('📡 Testing profile fetch...');
            const profile = await apiService.getUserProfile();
            addLog(`✅ Profile fetched: ${JSON.stringify(profile)}`);

        } catch (error) {
            addLog(`❌ Full flow failed: ${error}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">🔧 Authentication Debugger</h2>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={testBackendConnection}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    Test Backend
                </button>

                <button
                    onClick={testFirebaseOnly}
                    disabled={loading}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
                >
                    Test Firebase Only
                </button>

                <button
                    onClick={testFullFlow}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Test Full Flow
                </button>

                <button
                    onClick={clearLog}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                    Clear Log
                </button>
            </div>

            <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
                {log.length === 0 ? (
                    <div className="text-gray-500">Click a test button to see results...</div>
                ) : (
                    log.map((entry, index) => (
                        <div key={index} className="mb-1">{entry}</div>
                    ))
                )}
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-bold text-yellow-800">Debug Instructions:</h3>
                <ul className="list-disc pl-5 text-yellow-700 text-sm mt-2">
                    <li><strong>Test Backend:</strong> Checks if your backend at localhost:5432 is running</li>
                    <li><strong>Test Firebase Only:</strong> Tests Firebase auth without backend calls</li>
                    <li><strong>Test Full Flow:</strong> Tests the complete authentication process</li>
                    <li>Check the browser console for additional details</li>
                    <li>Make sure your backend is running on port 5432</li>
                </ul>
            </div>
        </div>
    );
};

export default AuthDebugger;
