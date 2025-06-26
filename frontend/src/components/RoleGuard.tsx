import React from 'react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../AuthContext';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requiredPermission?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    allowedRoles,
    children,
    fallback
}) => {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return fallback || null;
    }

    const hasAccess = allowedRoles.includes(userProfile.role);

    if (!hasAccess) {
        return fallback || (
            <div className="role-guard-denied">
                <p>You need {allowedRoles.join(' or ')} role to access this content.</p>
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

export default RoleGuard;
