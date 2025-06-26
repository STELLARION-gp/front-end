import React from 'react';
import { useAuth, type UserRole } from '../AuthContext';

interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requiredPermission?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    allowedRoles,
    children,
    fallback,
    requiredPermission
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

// Hook for role-based logic
export const useRoleAccess = () => {
    const { userProfile } = useAuth();

    const hasRole = (role: UserRole): boolean => {
        return userProfile?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return userProfile ? roles.includes(userProfile.role) : false;
    };

    const isMinimumRole = (minimumRole: UserRole): boolean => {
        if (!userProfile) return false;

        const roleHierarchy: Record<UserRole, number> = {
            learner: 1,
            enthusiast: 2,
            influencer: 3,
            guide: 4,
            mentor: 5,
            moderator: 6,
            admin: 7
        };

        const userLevel = roleHierarchy[userProfile.role] || 0;
        const minimumLevel = roleHierarchy[minimumRole] || 0;

        return userLevel >= minimumLevel;
    };

    return {
        userProfile,
        hasRole,
        hasAnyRole,
        isMinimumRole,
        isAdmin: hasRole('admin'),
        isModerator: hasAnyRole(['moderator', 'admin']),
        isMentor: hasAnyRole(['mentor', 'moderator', 'admin']),
        canModerate: hasAnyRole(['moderator', 'admin']),
        canTeach: hasAnyRole(['mentor', 'moderator', 'admin']),
    };
};
