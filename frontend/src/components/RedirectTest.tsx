import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardRoute } from '../utils/dashboardUtils';
import type { UserProfile } from '../types/auth';

const RedirectTest: React.FC = () => {
    const navigate = useNavigate();

    const testRedirect = (role: string) => {
        const mockProfile: UserProfile = {
            uid: 'test-123',
            email: `${role}@gmail.com`,
            displayName: `${role} User`,
            role: role as any,
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
        };

        const route = getDashboardRoute(mockProfile);
        console.log(`Testing redirect for ${role}:`, route);
        navigate(route);
    };

    const roles = ['admin', 'moderator', 'mentor', 'influencer', 'guide', 'enthusiast', 'learner'];

    return (
        <div className="redirect-test" style={{ padding: '20px', color: 'white' }}>
            <h2>🧪 Redirect Test</h2>
            <p>Click a role to test redirection:</p>
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '20px' }}>
                {roles.map(role => (
                    <button
                        key={role}
                        onClick={() => testRedirect(role)}
                        style={{
                            padding: '10px 15px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {role}
                    </button>
                ))}
            </div>

            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default RedirectTest;
