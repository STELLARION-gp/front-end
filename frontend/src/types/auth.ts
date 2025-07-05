// User roles based on your backend implementation
export type UserRole = 'admin' | 'moderator' | 'mentor' | 'influencer' | 'guide' | 'enthusiast' | 'learner';

// Backend user interface (from your database schema)
export interface BackendUser {
  id: number;
  firebase_uid: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

// Frontend user profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
  profileData?: {
    avatar?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface UserListResponse {
  users: BackendUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication context type
export interface AuthContextType {
  user: import('firebase/auth').User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, firstName?: string, lastName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<UserProfile | null>;
  updateUserProfile: (data: Partial<UserProfile['profileData']>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  // Debug and sync helpers
  getSyncStatus?: () => { pending: number; operations: Array<{ id: string; type: string; retryCount: number; timestamp: number }> };
  triggerSync?: () => Promise<void>;
}

// Permission levels based on your backend roles
export const ROLE_PERMISSIONS = {
  admin: {
    level: 7,
    canManageUsers: true,
    canManageRoles: true,
    canViewAllUsers: true,
    canModerateContent: true,
    canMentor: true,
    canGuide: true,
    canInfluence: true,
    canParticipate: true,
    canLearn: true,
  },
  moderator: {
    level: 6,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: true,
    canModerateContent: true,
    canMentor: true,
    canGuide: true,
    canInfluence: true,
    canParticipate: true,
    canLearn: true,
  },
  mentor: {
    level: 5,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: false,
    canModerateContent: false,
    canMentor: true,
    canGuide: true,
    canInfluence: true,
    canParticipate: true,
    canLearn: true,
  },
  influencer: {
    level: 4,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: false,
    canModerateContent: false,
    canMentor: false,
    canGuide: true,
    canInfluence: true,
    canParticipate: true,
    canLearn: true,
  },
  guide: {
    level: 3,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: false,
    canModerateContent: false,
    canMentor: false,
    canGuide: true,
    canInfluence: false,
    canParticipate: true,
    canLearn: true,
  },
  enthusiast: {
    level: 2,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: false,
    canModerateContent: false,
    canMentor: false,
    canGuide: false,
    canInfluence: false,
    canParticipate: true,
    canLearn: true,
  },
  learner: {
    level: 1,
    canManageUsers: false,
    canManageRoles: false,
    canViewAllUsers: false,
    canModerateContent: false,
    canMentor: false,
    canGuide: false,
    canInfluence: false,
    canParticipate: false,
    canLearn: true,
  },
} as const;

// Helper function to check permissions
export function hasPermission(userRole: UserRole, requiredPermission: keyof Omit<typeof ROLE_PERMISSIONS.admin, 'level'>): boolean {
  const permission = ROLE_PERMISSIONS[userRole][requiredPermission];
  return typeof permission === 'boolean' ? permission : false;
}

// Helper function to check if user has minimum role level
export function hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
  return ROLE_PERMISSIONS[userRole].level >= ROLE_PERMISSIONS[minimumRole].level;
}
