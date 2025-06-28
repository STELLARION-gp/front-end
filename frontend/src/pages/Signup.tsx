import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import type { UserRole } from '../AuthContext';
import Button from '../components/Button';
import '../styles/components/_auth.scss';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('learner');
  const [error, setError] = useState('');
  const { isLoading, withLoading } = useLoading();

  const { signup } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: 'learner', label: 'Learner', description: 'I want to learn and explore' },
    { value: 'mentor', label: 'Mentor', description: 'I want to teach and guide others' },
    { value: 'guide', label: 'Guide', description: 'I want to provide guidance and support' },
    { value: 'influencer', label: 'Influencer', description: 'I want to inspire and influence others' },
    { value: 'enthusiast', label: 'Enthusiast', description: 'I am passionate about astronomy' },
    { value: 'moderator', label: 'Moderator', description: 'I want to help moderate the community' },
    { value: 'admin', label: 'Admin', description: 'Administrative access' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !displayName) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    await withLoading(async () => {
      try {
        setError('');
        await signup(email, password, displayName, role);
        navigate('/dashboard/overview');
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to create account');
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
          <h2>Create Account</h2>
          <p>Join our astronomy community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">Full Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="role-select"
            >
              {roles.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label} - {roleOption.description}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            fullWidth
            size="medium"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
