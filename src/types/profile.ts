// Profile-related TypeScript interfaces and types for STELLARION platform

export type UserRole = 'admin' | 'moderator' | 'mentor' | 'influencer' | 'guide' | 'enthusiast' | 'learner';

export type AstronomyExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type ProfileVisibility = 'public' | 'private' | 'community-only';

export type RoleUpgradeStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Base user interface from backend
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

// Extended profile data stored as JSONB in database
export interface ProfileData {
  // Basic profile info
  profile_picture?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;

  // Astronomy-specific fields
  astronomy_experience?: AstronomyExperienceLevel;
  favorite_astronomy_fields?: string[];
  telescope_owned?: boolean;
  telescope_type?: string;
  observation_experience?: number; // years
  certifications?: string[];

  // Community engagement
  achievements?: string[];
  contributions?: string[];
  joined_communities?: string[];
}

// Role-specific data that varies by user role
export interface RoleSpecificData {
  // For Mentors/Guides
  mentoring_areas?: string[];
  years_of_experience?: number;

  // For Influencers
  social_media_followers?: number;
  content_platforms?: string[];

  // For Enthusiasts/Learners
  learning_goals?: string[];
  current_projects?: string[];

  // Additional fields can be added based on role requirements
}

// Complete user profile interface for frontend
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
  profileData?: ProfileData;
  roleSpecificData?: RoleSpecificData;
}

// User settings interface
export interface UserSettings {
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  profile_visibility: ProfileVisibility;
  allow_direct_messages: boolean;
  show_online_status: boolean;
  theme?: 'light' | 'dark';
  timezone?: string;
}

// Role upgrade request interface
export interface RoleUpgradeRequest {
  id: number;
  user_id: number;
  current_role: UserRole;
  requested_role: UserRole;
  reason?: string;
  supporting_evidence?: string[];
  status: RoleUpgradeStatus;
  reviewer_id?: number;
  reviewer_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  profile_data?: Partial<ProfileData>;
  role_specific_data?: Partial<RoleSpecificData>;
}

export interface SettingsUpdateRequest {
  language?: string;
  email_notifications?: boolean;
  push_notifications?: boolean;
  profile_visibility?: ProfileVisibility;
  allow_direct_messages?: boolean;
  show_online_status?: boolean;
  theme?: 'light' | 'dark';
  timezone?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface AccountDeletionRequest {
  confirmation: string; // Should be "DELETE"
  password: string;
}

export interface RoleUpgradeRequestPayload {
  requested_role: UserRole;
  reason?: string;
  supporting_evidence?: string[];
}

export interface DataExportResponse {
  download_url: string;
  expires_at: string;
}

// Form state interfaces for the UI
export interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
}

export interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Constants for validation and UI
export const ASTRONOMY_FIELDS = [
  'Astrophysics',
  'Cosmology',
  'Planetary Science',
  'Stellar Astronomy',
  'Galactic Astronomy',
  'Exoplanets',
  'Solar System',
  'Deep Sky Objects',
  'Astrophotography',
  'Radio Astronomy',
  'X-ray Astronomy',
  'Gravitational Waves'
] as const;

export const CONTENT_PLATFORMS = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Twitter',
  'Blog',
  'Podcast',
  'LinkedIn',
  'Medium',
  'Reddit'
] as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'pt', name: 'Português' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' }
] as const;

// Role hierarchy for upgrade logic
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'learner': 0,
  'enthusiast': 1,
  'guide': 2,
  'mentor': 3,
  'influencer': 4,
  'moderator': 5,
  'admin': 6
} as const;

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  'learner': 'New to astronomy, eager to learn and explore',
  'enthusiast': 'Has basic knowledge and actively participates in the community',
  'guide': 'Experienced member who helps newcomers navigate the community',
  'mentor': 'Expert who provides guidance and educational content',
  'influencer': 'Community leader who creates content and drives engagement',
  'moderator': 'Trusted member who helps maintain community standards',
  'admin': 'Platform administrator with full access and responsibilities'
} as const;

// File upload constraints
export const AVATAR_UPLOAD_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxDimensions: { width: 1000, height: 1000 }
} as const;

// Validation schemas (can be used with libraries like Yup or Zod)
export interface ValidationRules {
  firstName: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  lastName: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  displayName: {
    required: boolean;
    minLength: number;
    maxLength: number;
    pattern: RegExp;
  };
  bio: {
    maxLength: number;
  };
  website: {
    pattern: RegExp;
  };
  github: {
    pattern: RegExp;
  };
  linkedin: {
    pattern: RegExp;
  };
  password: {
    minLength: number;
    pattern: RegExp; // Should include uppercase, lowercase, number, special char
  };
}

export const VALIDATION_RULES: ValidationRules = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50
  },
  displayName: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  bio: {
    maxLength: 500
  },
  website: {
    pattern: /^https?:\/\/.+/
  },
  github: {
    pattern: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/
  },
  linkedin: {
    pattern: /^[a-zA-Z0-9-]+$/
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
  }
} as const;

// Error types for better error handling
export type ProfileErrorType =
  | 'validation_error'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'upload_error'
  | 'rate_limit_exceeded'
  | 'internal_error';

export interface ProfileError {
  type: ProfileErrorType;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ProfileFormData = ProfileUpdateRequest & {
  avatar?: File;
};

// Hook return types for better TypeScript support
export interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: ProfileError | null;
  updateProfile: (data: ProfileUpdateRequest) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UseSettingsReturn {
  settings: UserSettings | null;
  loading: boolean;
  error: ProfileError | null;
  updateSettings: (data: SettingsUpdateRequest) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

export interface UseRoleUpgradeReturn {
  requests: RoleUpgradeRequest[];
  loading: boolean;
  error: ProfileError | null;
  submitRequest: (data: RoleUpgradeRequestPayload) => Promise<void>;
  refreshRequests: () => Promise<void>;
}
