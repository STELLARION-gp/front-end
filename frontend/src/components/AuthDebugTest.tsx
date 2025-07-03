import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getDashboardRoute } from '../utils/dashboardUtils';

const AuthDebugTest: React.FC = () => {
    const { login, userProfile } = useAuth();
    const [debugInfo, setDebugInfo] = useState<string[]>([]);

    const addDebugLog = (message: string) => {
        setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const testLogin = async () => {
        try {
            addDebugLog('🔐 Starting login test...');
            const result = await login('admin@gmail.com', 'admin123');
            addDebugLog(`📥 Login result: ${JSON.stringify(result)}`);
            addDebugLog(`👤 Current userProfile: ${JSON.stringify(userProfile)}`);

            const route = getDashboardRoute(result);
            addDebugLog(`🚀 Calculated route: ${route}`);

            // Wait a bit and check userProfile again
            setTimeout(() => {
                addDebugLog(`👤 UserProfile after timeout: ${JSON.stringify(userProfile)}`);
                const routeAfter = getDashboardRoute(userProfile);
                addDebugLog(`🚀 Route after timeout: ${routeAfter}`);
            }, 1000);

        } catch (error) {
            addDebugLog(`❌ Login error: ${error}`);
        }
    };

    const clearDebug = () => setDebugInfo([]);

    return (
        <div style={{ padding: '20px', background: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
            <h2>🔍 Authentication Debug Test</h2>

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={testLogin}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Test Admin Login
                </button>

                <button
                    onClick={clearDebug}
                    style={{
                        padding: '10px 20px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Debug
                </button>
            </div>

            <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px' }}>
                <h3>Debug Log:</h3>
                {debugInfo.length === 0 ? (
                    <p>No debug info yet. Click "Test Admin Login" to start.</p>
                ) : (
                    <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                        {debugInfo.map((info, index) => (
                            <div key={index} style={{ marginBottom: '5px' }}>
                                {info}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '20px', background: '#16213e', padding: '15px', borderRadius: '8px' }}>
                <h3>Current State:</h3>
                <p><strong>UserProfile:</strong> {JSON.stringify(userProfile, null, 2)}</p>
                <p><strong>Expected Route:</strong> {getDashboardRoute(userProfile)}</p>
            </div>
        </div>
    );
};

export default AuthDebugTest;
