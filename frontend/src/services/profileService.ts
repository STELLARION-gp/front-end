import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

interface ProfileData {
    id?: number;
    firebase_uid?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    role?: string;
    is_active?: boolean;
    created_at?: string;
    last_login?: string;
    profile_data?: {
        profile_picture?: string;
        bio?: string;
        location?: string;
        website?: string;
        github?: string;
        linkedin?: string;
        astronomy_experience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        favorite_astronomy_fields?: string[];
        telescope_owned?: boolean;
        telescope_type?: string;
        observation_experience?: number;
        certifications?: string[];
        achievements?: string[];
        contributions?: string[];
        joined_communities?: string[];
    };
    role_specific_data?: {
        // For mentors/guides
        mentoring_areas?: string[];
        years_of_experience?: number;
        // For influencers
        social_media_followers?: number;
        content_platforms?: string[];
        // For learners/enthusiasts
        learning_goals?: string[];
        current_projects?: string[];
    };
}

interface SettingsData {
    language: string;
    email_notifications: boolean;
    push_notifications: boolean;
    profile_visibility: 'public' | 'private' | 'community-only';
    allow_direct_messages: boolean;
    show_online_status: boolean;
    theme?: string;
    timezone?: string;
}

interface PasswordChangeData {
    current_password: string;
    new_password: string;
}

interface RoleUpgradeRequest {
    requested_role: string;
    reason: string;
    supporting_evidence: string[];
}

interface AccountDeletionData {
    confirmation: string;
    password: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    details?: Record<string, unknown>;
}

/**
 * Profile API service for user profile management
 * Handles all profile-related API calls with proper error handling
 */
class ProfileService {
    private async getAuthToken(): Promise<string | null> {
        const user = auth.currentUser;
        if (!user) return null;

        try {
            return await user.getIdToken();
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        console.log(`📡 Profile API Request: ${endpoint}`);

        const token = await this.getAuthToken();

        if (!token) {
            throw new Error('Authentication required');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers as Record<string, string>),
        };

        try {
            console.log(`🚀 Making request to: ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            console.log(`📨 Response status: ${response.status}`);

            const data = await response.json();

            if (!response.ok) {
                console.error(`❌ API Error ${response.status}:`, data);
                return {
                    success: false,
                    error: data.error || 'api_error',
                    message: data.message || `HTTP ${response.status}`,
                    details: data.details
                };
            }

            console.log(`✅ Profile API Response:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Request failed:`, error);
            return {
                success: false,
                error: 'network_error',
                message: error instanceof Error ? error.message : 'Network error occurred'
            };
        }
    }

    private async makeFileUploadRequest<T>(
        endpoint: string,
        formData: FormData
    ): Promise<ApiResponse<T>> {
        console.log(`📡 Profile File Upload: ${endpoint}`);

        const token = await this.getAuthToken();

        if (!token) {
            throw new Error('Authentication required');
        }

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData, let browser set it with boundary
        };

        try {
            console.log(`🚀 Making file upload to: ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            console.log(`📨 Upload response status: ${response.status}`);

            const data = await response.json();

            if (!response.ok) {
                console.error(`❌ Upload Error ${response.status}:`, data);
                return {
                    success: false,
                    error: data.error || 'upload_error',
                    message: data.message || `Upload failed with status ${response.status}`,
                    details: data.details
                };
            }

            console.log(`✅ Upload success:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Upload failed:`, error);
            return {
                success: false,
                error: 'network_error',
                message: error instanceof Error ? error.message : 'Upload network error occurred'
            };
        }
    }

    // Profile Management
    async getUserProfile(): Promise<ApiResponse<ProfileData>> {
        return this.makeRequest<ProfileData>('/user/profile');
    }

    async updateUserProfile(profileData: Partial<ProfileData>): Promise<ApiResponse<ProfileData>> {
        return this.makeRequest<ProfileData>('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    async uploadProfilePicture(file: File): Promise<ApiResponse<{ profile_picture_url: string }>> {
        const formData = new FormData();
        formData.append('avatar', file);

        return this.makeFileUploadRequest<{ profile_picture_url: string }>('/user/profile/avatar', formData);
    }

    // Settings Management
    async getUserSettings(): Promise<ApiResponse<SettingsData>> {
        return this.makeRequest<SettingsData>('/user/settings');
    }

    async updateUserSettings(settings: Partial<SettingsData>): Promise<ApiResponse<SettingsData>> {
        return this.makeRequest<SettingsData>('/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings),
        });
    }

    // Security Operations
    async changePassword(passwordData: PasswordChangeData): Promise<ApiResponse<void>> {
        return this.makeRequest<void>('/user/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData),
        });
    }

    async deleteAccount(deletionData: AccountDeletionData): Promise<ApiResponse<void>> {
        return this.makeRequest<void>('/user/account', {
            method: 'DELETE',
            body: JSON.stringify(deletionData),
        });
    }

    async exportUserData(): Promise<ApiResponse<{ download_url: string; expires_at: string }>> {
        return this.makeRequest<{ download_url: string; expires_at: string }>('/user/data-export');
    }

    // Role Management
    async requestRoleUpgrade(upgradeData: RoleUpgradeRequest): Promise<ApiResponse<{
        request_id: number;
        status: string;
        submitted_at: string;
    }>> {
        return this.makeRequest<{
            request_id: number;
            status: string;
            submitted_at: string;
        }>('/user/role-upgrade', {
            method: 'POST',
            body: JSON.stringify(upgradeData),
        });
    }

    async getRoleUpgradeStatus(): Promise<ApiResponse<{
        current_requests: Array<{
            request_id: number;
            requested_role: string;
            status: string;
            submitted_at: string;
            reviewed_at?: string;
            reviewer_notes?: string;
        }>;
        request_history: Array<{
            request_id: number;
            requested_role: string;
            status: string;
            submitted_at: string;
            reviewed_at?: string;
            reviewer_notes?: string;
        }>;
    }>> {
        return this.makeRequest('/user/role-upgrade/status');
    }
}

export const profileService = new ProfileService();
export type { ProfileData, SettingsData, PasswordChangeData, RoleUpgradeRequest, AccountDeletionData, ApiResponse };
