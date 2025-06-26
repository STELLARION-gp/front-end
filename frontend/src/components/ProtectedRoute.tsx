import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    redirectTo = '/login'
}) => {
    const { user, userProfile, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while auth state is being determined
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user || !userProfile) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access if allowedRoles is specified
    if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
                <p>Your role: {userProfile.role}</p>
                <p>Required roles: {allowedRoles.join(', ')}</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
