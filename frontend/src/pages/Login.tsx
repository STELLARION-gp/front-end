import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import { getDashboardRoute } from '../utils/dashboardUtils';
import { getFirebaseErrorMessage, getValidationErrorMessage } from '../utils/errorMessages';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Message from '../components/Message';
import LoadingOverlay from '../components/LoadingOverlay';
import AuthScene3D from '../components/AuthScene3D';
import loginImage from '../assets/login.jpg';
import logoDark from '../assets/logo-dark.png';
import '../styles/components/_auth.scss';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loadingType, setLoadingType] = useState<'login' | 'google' | null>(null);
    const { isLoading, withLoading } = useLoading();

    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const clearError = useCallback(() => setError(''), []);

    const handleGoogleSignIn = useCallback(async () => {
        setLoadingType('google');
        await withLoading(async () => {
            try {
                setError('');
                console.log('🔐 Starting Google sign-in...');
                const userProfile = await signInWithGoogle();
                console.log('✅ Google sign-in successful:', userProfile);

                if (userProfile && userProfile.role) {
                    const dashboardRoute = getDashboardRoute(userProfile);
                    console.log('🚀 Redirecting to:', dashboardRoute, 'for role:', userProfile.role);
                    navigate(dashboardRoute);
                } else {
                    console.log('⚠️ No userProfile or role, redirecting to default dashboard');
                    navigate('/dashboard/overview');
                }

            } catch (error: unknown) {
                console.error('❌ Google sign-in error:', error);
                const errorMessage = getFirebaseErrorMessage(error);
                setError(errorMessage);
                throw error; // Re-throw to handle in withLoading
            } finally {
                setLoadingType(null);
            }
        }).catch(() => {
            // Error already handled above
            setLoadingType(null);
        });
    }, [withLoading, signInWithGoogle, navigate]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        const emailError = getValidationErrorMessage('email', email);
        const passwordError = getValidationErrorMessage('password', password);

        if (emailError) {
            setError(emailError);
            return;
        }

        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoadingType('login');
        await withLoading(async () => {
            try {
                setError('');
                console.log('🔐 Starting login with:', email);
                const userProfile = await login(email, password);
                console.log('✅ Login successful:', userProfile);

                if (userProfile && userProfile.role) {
                    const dashboardRoute = getDashboardRoute(userProfile);
                    console.log('🚀 Redirecting to:', dashboardRoute, 'for role:', userProfile.role);
                    navigate(dashboardRoute);
                } else {
                    console.log('⚠️ No userProfile or role, redirecting to default dashboard');
                    navigate('/dashboard/overview');
                }

            } catch (error: unknown) {
                console.error('❌ Login error:', error);
                const errorMessage = getFirebaseErrorMessage(error);
                setError(errorMessage);
                throw error; // Re-throw to handle in withLoading
            } finally {
                setLoadingType(null);
            }
        }).catch(() => {
            // Error already handled above
            setLoadingType(null);
        });
    }, [email, password, withLoading, login, navigate]);

    return (
        <div className="modern-auth-container">
            <AuthScene3D />
            <div className="glass-card">
                <LoadingOverlay
                    isVisible={isLoading}
                    type={loadingType || 'login'}
                />
                <div className="split-card login-layout">
                    <div className="card-image-side">
                        <img src={loginImage} alt="Astronomy enthusiasts" className="auth-image" />
                        <div className="galaxy-effect"></div>
                        <div className="overlay"></div>

                        {/* Logo with link to home */}
                        <div className="auth-card-logo left-logo">
                            <Link
                                to="/"
                                title="Return to homepage"
                                onClick={() => {
                                    console.log('Logo clicked!');
                                    // Let the navigation proceed normally
                                }}
                            >
                                <img src={logoDark} alt="STELLARION" className="logo-image" />
                            </Link>
                        </div>

                        {/* Account link section */}
                        <div className="image-side-content">
                            <div className="account-cta">
                                <h3>New to STELLARION?</h3>
                                <p>Don't have an account?</p>
                                <Link to="/signup">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        className="image-side-btn"
                                    >
                                        Create Account
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card-form-side">
                        <div className="auth-header">
                            <h2 className="auth-title">Welcome Back</h2>
                            <p className="auth-subtitle">Sign in to your account</p>
                        </div>

                        {error && (
                            <Message
                                message={error}
                                type="error"
                                onClose={clearError}
                            />
                        )}

                        <form onSubmit={handleSubmit} className="modern-auth-form">
                            <InputField
                                id="email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />

                            <InputField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />

                            <div className="forgot-password">
                                <Link to="/forgot-password" className="auth-link">
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                loading={isLoading}
                                variant="primary"
                                fullWidth
                                size="small"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <div className="auth-separator">
                                <span>OR</span>
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                size="small"
                                className="google-auth-button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                <span className="google-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
                                        <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
                                        <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
                                        <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
                                        <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
                                    </svg>
                                </span>
                                Continue with Google
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
