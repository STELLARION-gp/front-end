import type { UserProfile } from '../types/auth';

export const getDashboardRoute = (userProfile: UserProfile | null): string => {
    console.log('🔍 getDashboardRoute called with:', userProfile);

    // All users go to the same dashboard, but with role-based sidebar and content
    console.log('🚀 Redirecting all users to: /dashboard');
    return '/dashboard';
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
