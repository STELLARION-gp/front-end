import { useState, useEffect, useCallback } from 'react';
import type {
  UserProfile,
  UserSettings,
  ProfileUpdateRequest,
  SettingsUpdateRequest,
  RoleUpgradeRequest,
  RoleUpgradeRequestPayload,
  ProfileError,
  UseProfileReturn,
  UseSettingsReturn,
  UseRoleUpgradeReturn
} from '../types/profile';

// Mock API service - replace with actual API calls
const profileAPI = {
  getProfile: async (): Promise<UserProfile> => {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<UserProfile> => {
    // TODO: Replace with actual API call
    console.log('Updating profile:', data);
    throw new Error('API not implemented');
  },

  uploadAvatar: async (file: File): Promise<{ profile_picture_url: string }> => {
    // TODO: Replace with actual API call
    console.log('Uploading avatar:', file.name);
    throw new Error('API not implemented');
  },

  getSettings: async (): Promise<UserSettings> => {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  updateSettings: async (data: SettingsUpdateRequest): Promise<UserSettings> => {
    // TODO: Replace with actual API call
    console.log('Updating settings:', data);
    throw new Error('API not implemented');
  },

  getRoleUpgradeRequests: async (): Promise<RoleUpgradeRequest[]> => {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  submitRoleUpgradeRequest: async (data: RoleUpgradeRequestPayload): Promise<RoleUpgradeRequest> => {
    // TODO: Replace with actual API call
    console.log('Submitting role upgrade request:', data);
    throw new Error('API not implemented');
  }
};

/**
 * Hook for managing user profile data
 */
export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profileData = await profileAPI.getProfile();
      setProfile(profileData);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to load profile'
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await profileAPI.updateProfile(data);
      setProfile(updatedProfile);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to update profile'
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const result = await profileAPI.uploadAvatar(file);
      if (profile) {
        setProfile({
          ...profile,
          profileData: {
            ...profile.profileData,
            profile_picture: result.profile_picture_url
          }
        });
      }
    } catch (err) {
      const error: ProfileError = {
        type: 'upload_error',
        message: err instanceof Error ? err.message : 'Failed to upload avatar'
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    refreshProfile
  };
};

/**
 * Hook for managing user settings
 */
export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const settingsData = await profileAPI.getSettings();
      setSettings(settingsData);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to load settings'
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (data: SettingsUpdateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const updatedSettings = await profileAPI.updateSettings(data);
      setSettings(updatedSettings);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to update settings'
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings
  };
};

/**
 * Hook for managing role upgrade requests
 */
export const useRoleUpgrade = (): UseRoleUpgradeReturn => {
  const [requests, setRequests] = useState<RoleUpgradeRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProfileError | null>(null);

  const refreshRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const requestsData = await profileAPI.getRoleUpgradeRequests();
      setRequests(requestsData);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to load role upgrade requests'
      };
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitRequest = useCallback(async (data: RoleUpgradeRequestPayload) => {
    setLoading(true);
    setError(null);

    try {
      const newRequest = await profileAPI.submitRoleUpgradeRequest(data);
      setRequests(prev => [newRequest, ...prev]);
    } catch (err) {
      const error: ProfileError = {
        type: 'internal_error',
        message: err instanceof Error ? err.message : 'Failed to submit role upgrade request'
      };
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  return {
    requests,
    loading,
    error,
    submitRequest,
    refreshRequests
  };
};

/**
 * Hook for form validation
 */
export const useFormValidation = <T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: Record<keyof T, (value: unknown) => { isValid: boolean; error?: string }>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((name: keyof T, value: unknown) => {
    const rule = validationRules[name];
    if (rule) {
      const result = rule(value);
      setErrors(prev => ({
        ...prev,
        [name]: result.isValid ? undefined : result.error
      }));
      return result.isValid;
    }
    return true;
  }, [validationRules]);

  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const setTouchedField = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const fieldName = key as keyof T;
      const rule = validationRules[fieldName];
      if (rule) {
        const result = rule(values[fieldName]);
        if (!result.isValid) {
          newErrors[fieldName] = result.error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(values).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Partial<Record<keyof T, boolean>>));

    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const isFormValid = Object.keys(errors).every(key => !errors[key as keyof T]);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouchedField,
    validateField,
    validateAll,
    reset,
    isFormValid
  };
};

/**
 * Hook for handling file uploads with progress
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async (file: File, onSuccess?: (url: string) => void) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await profileAPI.uploadAvatar(file);

      clearInterval(progressInterval);
      setProgress(100);

      if (onSuccess) {
        onSuccess(result.profile_picture_url);
      }

      return result.profile_picture_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  return {
    upload,
    uploading,
    progress,
    error
  };
};

/**
 * Hook for managing profile completion
 */
export const useProfileCompletion = (profile: UserProfile | null) => {
  const [completion, setCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!profile) {
      setCompletion(0);
      setMissingFields([]);
      return;
    }

    const requiredFields = [
      { key: 'bio', name: 'Bio', value: profile.profileData?.bio },
      { key: 'location', name: 'Location', value: profile.profileData?.location },
      { key: 'astronomy_experience', name: 'Astronomy Experience', value: profile.profileData?.astronomy_experience },
      { key: 'favorite_fields', name: 'Favorite Fields', value: profile.profileData?.favorite_astronomy_fields?.length },
      { key: 'observation_experience', name: 'Observation Experience', value: profile.profileData?.observation_experience },
      { key: 'profile_picture', name: 'Profile Picture', value: profile.profileData?.profile_picture }
    ];

    const completedFields = requiredFields.filter(field => {
      if (Array.isArray(field.value)) {
        return field.value.length > 0;
      }
      return field.value !== undefined && field.value !== null && field.value !== '';
    });

    const missing = requiredFields
      .filter(field => !completedFields.includes(field))
      .map(field => field.name);

    const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

    setCompletion(completionPercentage);
    setMissingFields(missing);
  }, [profile]);

  return {
    completion,
    missingFields
  };
};
