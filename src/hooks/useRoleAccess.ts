import { useAuth } from "./useAuth";
import type { UserRole } from "../AuthContext";

// Hook for role-based logic
export const useRoleAccess = () => {
    const { userProfile } = useAuth();

    const hasRole = (role: UserRole): boolean => {
        return userProfile?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]): boolean => {
        return userProfile ? roles.includes(userProfile.role) : false;
    };

    const hasMinimumRole = (minRole: UserRole): boolean => {
        if (!userProfile) return false;

        const roleHierarchy: Record<UserRole, number> = {
            'learner': 1,
            'enthusiast': 2,
            'influencer': 3,
            'guide': 4,
            'mentor': 5,
            'moderator': 6,
            'admin': 7
        };

        return (roleHierarchy[userProfile.role] || 0) >= (roleHierarchy[minRole] || 0);
    };

    return {
        hasRole,
        hasAnyRole,
        hasMinimumRole,
        userRole: userProfile?.role
    };
};
