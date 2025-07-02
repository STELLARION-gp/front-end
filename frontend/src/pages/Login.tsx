import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { getDashboardRoute } from '../utils/dashboardUtils';
import Button from '../components/Button';
import '../styles/components/_auth.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isLoading, withLoading } = useLoading();

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        await withLoading(async () => {
            try {
                setError('');
                console.log('🔐 About to call login function with:', email);
                const userProfile = await login(email, password);
                console.log('✅ Login function returned:', userProfile);

                if (userProfile && userProfile.role) {
                    const dashboardRoute = getDashboardRoute(userProfile);
                    console.log('🚀 Redirecting to:', dashboardRoute, 'for role:', userProfile.role);
                    navigate(dashboardRoute);
                } else {
                    console.log('⚠️ No userProfile or role, redirecting to default dashboard');
                    navigate('/dashboard');
                }

            } catch (error: unknown) {
                if (error instanceof Error) {
                    // Provide more specific error messages
                    if (error.message.includes('user-not-found')) {
                        setError('No account found with this email. Creating test user...');
                    } else if (error.message.includes('wrong-password')) {
                        setError('Incorrect password. Please try again.');
                    } else if (error.message.includes('invalid-email')) {
                        setError('Invalid email address format.');
                    } else if (error.message.includes('too-many-requests')) {
                        setError('Too many failed attempts. Please try again later.');
                    } else {
                        setError(error.message);
                    }
                } else {
                    setError('Failed to log in. Please check your credentials.');
                }
                throw error; // Re-throw to handle in withLoading
            }
        }).catch(() => {
            // Error already handled above
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        loading={isLoading}
                        variant="primary"
                        fullWidth
                        size="medium"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="test-accounts">
                    <p className="test-title">Test Accounts (Development):</p>
                    <div className="test-grid">
                        {[
                            { email: 'admin@gmail.com', role: 'Admin', password: 'admin123' },
                            { email: 'moderator@gmail.com', role: 'Moderator', password: 'moderator' },
                            { email: 'mentor@gmail.com', role: 'Mentor', password: 'mentor' },
                            { email: 'influencer@gmail.com', role: 'Influencer', password: 'influencer' },
                            { email: 'guide@gmail.com', role: 'Guide', password: 'guide123' },
                            { email: 'enthusiast@gmail.com', role: 'Enthusiast', password: 'enthusiast' },
                            { email: 'learner@gmail.com', role: 'Learner', password: 'learner' }
                        ].map((account) => (
                            <button
                                key={account.email}
                                type="button"
                                onClick={() => {
                                    setEmail(account.email);
                                    setPassword(account.password);
                                }}
                                className="test-button"
                            >
                                {account.role}
                            </button>
                        ))}
                    </div>
                    <p className="test-note">
                        Click any role to auto-fill credentials, then click "Sign In"
                    </p>
                </div>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="auth-link">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
