import { type UserRole } from '../AuthContext';

// Define permission types
export type Permission = 'read' | 'write' | 'delete' | 'admin' | 'moderate' | 'mentor' | 'guide' | 'influence' | 'all';

// Define permission levels for different roles
export const ROLE_PERMISSIONS = {
    admin: {
        level: 7,
        permissions: ['read', 'write', 'delete', 'admin', 'moderate', 'mentor', 'all'] as Permission[]
    },
    moderator: {
        level: 6,
        permissions: ['read', 'write', 'moderate', 'mentor'] as Permission[]
    },
    mentor: {
        level: 5,
        permissions: ['read', 'write', 'mentor'] as Permission[]
    },
    guide: {
        level: 4,
        permissions: ['read', 'write', 'guide'] as Permission[]
    },
    influencer: {
        level: 3,
        permissions: ['read', 'write', 'influence'] as Permission[]
    },
    enthusiast: {
        level: 2,
        permissions: ['read', 'write'] as Permission[]
    },
    learner: {
        level: 1,
        permissions: ['read'] as Permission[]
    }
};

// Define what roles can access which pages/features
export const PAGE_ACCESS_CONTROL = {
    '/dashboard/overview': ['learner', 'enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/profile': ['learner', 'enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/settings': ['learner', 'enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/blogs': ['enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/mentor': ['mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/events': ['guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/chat': ['learner', 'enthusiast', 'influencer', 'guide', 'mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/sessions': ['mentor', 'moderator', 'admin'] as UserRole[],
    '/dashboard/media': ['guide'] as UserRole[],
    '/dashboard/admin': ['admin'] as UserRole[],
    '/dashboard/moderation': ['moderator', 'admin'] as UserRole[]
};

// Sidebar menu items with role-based visibility
export const ROLE_BASED_MENU_ITEMS = {
    learner: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    enthusiast: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    influencer: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    guide: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Events', icon: 'CalendarDaysIcon', href: '/dashboard/events' },
        { label: 'Media Gallery', icon: 'PhotoIcon', href: '/dashboard/media' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    mentor: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Mentor', icon: 'AcademicCapIcon', href: '/dashboard/mentor' },
        { label: 'Events', icon: 'CalendarDaysIcon', href: '/dashboard/events' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Sessions', icon: 'UsersIcon', href: '/dashboard/sessions' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    moderator: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Mentor', icon: 'AcademicCapIcon', href: '/dashboard/mentor' },
        { label: 'Events', icon: 'CalendarDaysIcon', href: '/dashboard/events' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Sessions', icon: 'UsersIcon', href: '/dashboard/sessions' },
        { label: 'Moderation', icon: 'ShieldCheckIcon', href: '/dashboard/moderation' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
    admin: [
        { label: 'Overview', icon: 'HomeIcon', href: '/dashboard/overview' },
        { label: 'Profile', icon: 'UserCircleIcon', href: '/dashboard/profile' },
        { label: 'Blogs', icon: 'BookOpenIcon', href: '/dashboard/blogs' },
        { label: 'Mentor', icon: 'AcademicCapIcon', href: '/dashboard/mentor' },
        { label: 'Events', icon: 'CalendarDaysIcon', href: '/dashboard/events' },
        { label: 'Chat', icon: 'ChatBubbleLeftRightIcon', href: '/dashboard/chat' },
        { label: 'Sessions', icon: 'UsersIcon', href: '/dashboard/sessions' },
        { label: 'Moderation', icon: 'ShieldCheckIcon', href: '/dashboard/moderation' },
        { label: 'Admin', icon: 'KeyIcon', href: '/dashboard/admin' },
        { label: 'Settings', icon: 'Cog6ToothIcon', href: '/dashboard/settings' },
    ],
} as const;

// Check if user has access to a specific page
export const hasPageAccess = (userRole: UserRole, path: string): boolean => {
    const allowedRoles = PAGE_ACCESS_CONTROL[path as keyof typeof PAGE_ACCESS_CONTROL];
    return allowedRoles?.includes(userRole) || false;
};

// Check if user has a specific permission
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
    const rolePermissions = ROLE_PERMISSIONS[userRole];
    return rolePermissions?.permissions.includes(permission) || false;
};

// Check if user role has sufficient level
export const hasMinimumRole = (userRole: UserRole, minimumRole: UserRole): boolean => {
    const userLevel = ROLE_PERMISSIONS[userRole]?.level || 0;
    const minimumLevel = ROLE_PERMISSIONS[minimumRole]?.level || 0;
    return userLevel >= minimumLevel;
};

// Get menu items for a specific role
export const getMenuItemsForRole = (userRole: UserRole) => {
    return ROLE_BASED_MENU_ITEMS[userRole] || ROLE_BASED_MENU_ITEMS.learner;
};
