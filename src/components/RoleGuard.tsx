import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth';
import { hasPermission, hasMinimumRole, ROLE_PERMISSIONS } from '../types/auth';

interface RoleGuardProps {
    allowedRoles?: UserRole[];
    minimumRole?: UserRole;
    requiredPermission?: keyof Omit<typeof ROLE_PERMISSIONS.admin, 'level'>;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    allowedRoles,
    minimumRole,
    requiredPermission,
    children,
    fallback
}) => {
    const { userProfile } = useAuth();

    if (!userProfile || !userProfile.isActive) {
        return fallback || null;
    }

    let hasAccess = false;

    if (allowedRoles) {
        hasAccess = allowedRoles.includes(userProfile.role);
    } else if (minimumRole) {
        hasAccess = hasMinimumRole(userProfile.role, minimumRole);
    } else if (requiredPermission) {
        hasAccess = hasPermission(userProfile.role, requiredPermission);
    } else {
        // If no specific role requirements, just check if user is authenticated and active
        hasAccess = true;
    }

    if (!hasAccess) {
        return fallback || (
            <div className="role-guard-denied p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">
                    You don't have permission to access this content.
                    {allowedRoles && ` Required roles: ${allowedRoles.join(', ')}`}
                    {minimumRole && ` Minimum role required: ${minimumRole}`}
                    {requiredPermission && ` Permission required: ${requiredPermission}`}
                </p>
            </div>
        );
    }

    return <>{children}</>;
};

interface ConditionalRenderProps {
    condition: boolean;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
    condition,
    children,
    fallback
}) => {
    return condition ? <>{children}</> : <>{fallback}</>;
};

// Convenience components for common role checks
export const AdminOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
        {children}
    </RoleGuard>
);

export const ManagerOrAdmin: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
    <RoleGuard minimumRole="moderator" fallback={fallback}>
        {children}
    </RoleGuard>
);

export const AuthenticatedOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ children, fallback }) => (
    <RoleGuard fallback={fallback}>
        {children}
    </RoleGuard>
);

export default RoleGuard;
