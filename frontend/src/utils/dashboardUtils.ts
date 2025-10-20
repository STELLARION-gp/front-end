import type { UserProfile } from '../types/auth';

export const getDashboardRoute = (userProfile: UserProfile | null): string => {
    console.log('🔍 getDashboardRoute called with:', userProfile);

    if (!userProfile || !userProfile.role) {
        console.log('⚠️ No userProfile or role, redirecting to default dashboard');
        return '/dashboard/overview';
    }

    // Route users to role-specific dashboards
    switch (userProfile.role) {
        case 'admin':
            console.log('🚀 Admin user, redirecting to: /dashboard/admin-overview');
            return '/dashboard/admin-overview';
        case 'mentor':
            console.log('🚀 Mentor user, redirecting to: /dashboard/mentordashboard');
            return '/dashboard/mentordashboard';
        default:
            console.log('🚀 Default dashboard for role:', userProfile.role);
            return '/dashboard/overview';
    }
};

export const getRoleName = (role: string): string => {
    const roleNames: Record<string, string> = {
        admin: 'Administrator',
        moderator: 'Moderator',
        mentor: 'Mentor',
        influencer: 'Influencer',
        guide: 'Guide',
        enthusiast: 'Enthusiast',
        learner: 'Learner'
    };

    return roleNames[role] || 'User';
};
