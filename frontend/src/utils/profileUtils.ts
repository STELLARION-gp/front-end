// Utility functions for the Profile system

import type { UserRole, ProfileData, RoleSpecificData } from '../types/profile';
import { ROLE_HIERARCHY, VALIDATION_RULES } from '../types/profile';

/**
 * Get the next role in the hierarchy
 */
export const getNextRole = (currentRole: UserRole): UserRole | null => {
  const currentLevel = ROLE_HIERARCHY[currentRole];
  const roleEntries = Object.entries(ROLE_HIERARCHY) as [UserRole, number][];
  const nextRoleEntry = roleEntries.find(([, level]) => level === currentLevel + 1);
  return nextRoleEntry ? nextRoleEntry[0] : null;
};

/**
 * Check if a role upgrade is possible
 */
export const canUpgradeRole = (currentRole: UserRole): boolean => {
  return getNextRole(currentRole) !== null;
};

/**
 * Get role color for UI styling
 */
export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    'learner': 'bg-gray-500',
    'enthusiast': 'bg-blue-500',
    'guide': 'bg-green-500',
    'mentor': 'bg-purple-500',
    'influencer': 'bg-yellow-500',
    'moderator': 'bg-orange-500',
    'admin': 'bg-red-500'
  };
  return colors[role];
};

/**
 * Validate display name format
 */
export const validateDisplayName = (displayName: string): { isValid: boolean; error?: string } => {
  if (!displayName) {
    return { isValid: false, error: 'Display name is required' };
  }

  if (displayName.length < VALIDATION_RULES.displayName.minLength) {
    return { isValid: false, error: `Display name must be at least ${VALIDATION_RULES.displayName.minLength} characters` };
  }

  if (displayName.length > VALIDATION_RULES.displayName.maxLength) {
    return { isValid: false, error: `Display name must be no more than ${VALIDATION_RULES.displayName.maxLength} characters` };
  }

  if (!VALIDATION_RULES.displayName.pattern.test(displayName)) {
    return { isValid: false, error: 'Display name can only contain letters, numbers, hyphens, and underscores' };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < VALIDATION_RULES.password.minLength) {
    return { isValid: false, error: `Password must be at least ${VALIDATION_RULES.password.minLength} characters` };
  }

  if (!VALIDATION_RULES.password.pattern.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    };
  }

  // Calculate password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  const isLongEnough = password.length >= 12;

  const criteriaCount = [hasUpper, hasLower, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

  if (criteriaCount >= 4) {
    strength = 'strong';
  } else if (criteriaCount >= 3) {
    strength = 'medium';
  }

  return { isValid: true, strength };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!emailPattern.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validate website URL
 */
export const validateWebsite = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // Optional field
  }

  if (!VALIDATION_RULES.website.pattern.test(url)) {
    return { isValid: false, error: 'Please enter a valid URL (must start with http:// or https://)' };
  }

  return { isValid: true };
};

/**
 * Validate GitHub username
 */
export const validateGitHub = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: true }; // Optional field
  }

  if (!VALIDATION_RULES.github.pattern.test(username)) {
    return { isValid: false, error: 'Please enter a valid GitHub username' };
  }

  return { isValid: true };
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if file type is allowed for avatar upload
 */
export const isValidAvatarFile = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Please upload a JPEG, PNG, or WebP image' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${formatFileSize(maxSize)}` };
  }

  return { isValid: true };
};

/**
 * Generate profile completion percentage
 */
export const calculateProfileCompletion = (profileData: ProfileData, roleSpecificData: RoleSpecificData): number => {
  const basicFields = [
    profileData.bio,
    profileData.location,
    profileData.astronomy_experience,
    profileData.favorite_astronomy_fields?.length,
    profileData.observation_experience
  ];

  const roleSpecificFields = Object.values(roleSpecificData || {});

  const allFields = [...basicFields, ...roleSpecificFields];
  const completedFields = allFields.filter(field =>
    field !== undefined &&
    field !== null &&
    field !== '' &&
    (Array.isArray(field) ? field.length > 0 : true)
  ).length;

  return Math.round((completedFields / allFields.length) * 100);
};

/**
 * Get role-specific field requirements
 */
export const getRoleSpecificFields = (role: UserRole): string[] => {
  const fieldMap: Record<UserRole, string[]> = {
    'learner': ['learning_goals', 'current_projects'],
    'enthusiast': ['learning_goals', 'current_projects', 'achievements'],
    'guide': ['mentoring_areas', 'years_of_experience'],
    'mentor': ['mentoring_areas', 'years_of_experience', 'certifications'],
    'influencer': ['social_media_followers', 'content_platforms'],
    'moderator': ['years_of_experience', 'mentoring_areas'],
    'admin': ['years_of_experience']
  };

  return fieldMap[role] || [];
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  return formatDate(dateObj);
};

/**
 * Debounce function for search/input handlers
 */
export const debounce = <T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate avatar URL from user initials if no avatar is set
 */
export const generateAvatarUrl = (firstName?: string, lastName?: string, displayName?: string): string => {
  const initials = getInitials(firstName, lastName, displayName);
  const backgroundColor = getColorFromString(initials);

  // Using a service like UI Avatars or similar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor}&color=fff&size=200`;
};

/**
 * Get user initials for avatar generation
 */
export const getInitials = (firstName?: string, lastName?: string, displayName?: string): string => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (displayName) {
    const parts = displayName.split(/[\s_-]+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return displayName.charAt(0).toUpperCase();
  }

  return 'U'; // Default fallback
};

/**
 * Generate consistent color from string (for avatar backgrounds)
 */
export const getColorFromString = (str: string): string => {
  const colors = [
    '1f2937', '374151', '4b5563', '6b7280', '9ca3af',
    '1e40af', '2563eb', '3b82f6', '60a5fa', '93c5fd',
    '059669', '10b981', '34d399', '6ee7b7', '9decf9',
    'd97706', 'ea580c', 'f97316', 'fb923c', 'fed7aa',
    'dc2626', 'ef4444', 'f87171', 'fca5a5', 'fecaca',
    '7c3aed', '8b5cf6', 'a78bfa', 'c4b5fd', 'ddd6fe'
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Generate safe filename for uploads
 */
export const generateSafeFilename = (originalName: string, userId: string): string => {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `avatar_${userId}_${timestamp}_${random}.${extension}`;
};

/**
 * Check if user has permission to perform action
 */
export const hasPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Get achievement badge based on criteria
 */
export const getAchievementBadge = (profileData: ProfileData): string[] => {
  const badges: string[] = [];

  if (profileData.telescope_owned) {
    badges.push('Telescope Owner');
  }

  if (profileData.observation_experience && profileData.observation_experience >= 5) {
    badges.push('Veteran Observer');
  }

  if (profileData.certifications && profileData.certifications.length > 0) {
    badges.push('Certified');
  }

  if (profileData.achievements && profileData.achievements.length >= 10) {
    badges.push('High Achiever');
  }

  if (profileData.contributions && profileData.contributions.length >= 5) {
    badges.push('Community Contributor');
  }

  return badges;
};
