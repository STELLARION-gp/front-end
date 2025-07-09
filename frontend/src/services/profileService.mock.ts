import { auth } from '../firebase';

// Mock data for testing
interface RoleUpgradeRequest {
    id: number;
    requested_role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const MOCK_PROFILE_DATA = {
    id: 123,
    firebase_uid: 'mock-user-123',
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    display_name: 'JohnDoe',
    role: 'learner',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_login: '2024-07-09T12:00:00Z',
    profile_data: {
        profile_picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Passionate astronomy enthusiast learning about the cosmos and sharing knowledge with the community.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com',
        github: 'johndoe',
        linkedin: 'john-doe',
        astronomy_experience: 'intermediate',
        favorite_astronomy_fields: ['Astrophysics', 'Planetary Science'],
        telescope_owned: true,
        telescope_type: 'Celestron NexStar 8SE',
        observation_experience: 3,
        certifications: ['Amateur Radio License'],
        achievements: ['First astrophoto', '100 nights of observation'],
        contributions: ['Wrote beginner\'s guide', 'Mentored 5 new members'],
        joined_communities: ['Local Astronomy Club', 'Online Forums']
    },
    role_specific_data: {
        learning_goals: ['Master astrophotography', 'Build own telescope'],
        current_projects: ['M31 imaging series', 'Solar observation log']
    }
};

const MOCK_SETTINGS_DATA = {
    language: 'en',
    email_notifications: true,
    push_notifications: true,
    profile_visibility: 'public',
    allow_direct_messages: true,
    show_online_status: true,
    theme: 'dark',
    timezone: 'America/New_York'
};

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
 * TEMPORARY Mock Profile Service for Testing
 * This is a mock implementation that simulates the backend API
 * Use this while the backend is being implemented
 */
class MockProfileService {
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
        console.log(`📡 Mock Profile API Request: ${endpoint}`);

        // Simulate backend delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const token = await this.getAuthToken();

        if (!token) {
            console.error('❌ No authentication token available');
            return {
                success: false,
                error: 'authentication_required',
                message: 'User must be logged in to access this resource'
            };
        }

        console.log(`🔑 Using mock data for ${endpoint}`);

        // Mock responses based on endpoint
        if (endpoint === '/user/profile') {
            if (options.method === 'PUT') {
                console.log('✅ Mock: Profile updated successfully');
                return {
                    success: true,
                    message: 'Profile updated successfully',
                    data: MOCK_PROFILE_DATA as T
                };
            } else {
                console.log('✅ Mock: Profile data returned');
                return {
                    success: true,
                    data: MOCK_PROFILE_DATA as T
                };
            }
        }

        if (endpoint === '/user/settings') {
            if (options.method === 'PUT') {
                console.log('✅ Mock: Settings updated successfully');
                return {
                    success: true,
                    message: 'Settings updated successfully',
                    data: MOCK_SETTINGS_DATA as T
                };
            } else {
                console.log('✅ Mock: Settings data returned');
                return {
                    success: true,
                    data: MOCK_SETTINGS_DATA as T
                };
            }
        }

        if (endpoint === '/user/profile/avatar') {
            console.log('✅ Mock: Avatar uploaded successfully');
            return {
                success: true,
                message: 'Profile picture updated successfully',
                data: {
                    profile_picture_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                } as T
            };
        }

        if (endpoint === '/user/password') {
            console.log('✅ Mock: Password changed successfully');
            return {
                success: true,
                message: 'Password changed successfully'
            };
        }

        if (endpoint === '/user/role-upgrade') {
            console.log('✅ Mock: Role upgrade request submitted');
            return {
                success: true,
                message: 'Role upgrade request submitted successfully',
                data: {
                    request_id: 456,
                    status: 'pending',
                    submitted_at: new Date().toISOString()
                } as T
            };
        }

        if (endpoint === '/user/role-upgrade/status') {
            console.log('✅ Mock: Role upgrade status returned');
            return {
                success: true,
                data: {
                    current_requests: [],
                    request_history: []
                } as T
            };
        }

        if (endpoint === '/user/account') {
            console.log('✅ Mock: Account deleted successfully');
            return {
                success: true,
                message: 'Account deleted successfully'
            };
        }

        if (endpoint === '/user/data-export') {
            console.log('✅ Mock: Data export prepared');
            return {
                success: true,
                data: {
                    download_url: 'https://example.com/exports/user123_data.zip',
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                } as T
            };
        }

        // Default mock response
        console.log(`⚠️ Mock: Unhandled endpoint ${endpoint}`);
        return {
            success: false,
            error: 'not_implemented',
            message: 'This endpoint is not implemented yet in the mock service'
        };
    }

    // Public API methods
    async getUserProfile(): Promise<ApiResponse<ProfileData>> {
        return this.makeRequest<ProfileData>('/user/profile');
    }

    async updateUserProfile(profileData: Partial<ProfileData>): Promise<ApiResponse<ProfileData>> {
        return this.makeRequest<ProfileData>('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async uploadProfilePicture(file: File): Promise<ApiResponse<{ profile_picture_url: string }>> {
        // Simulate file upload
        console.log(`📁 Mock: Uploading file ${file.name} (${file.size} bytes)`);
        return this.makeRequest<{ profile_picture_url: string }>('/user/profile/avatar', {
            method: 'POST'
        });
    }

    async getUserSettings(): Promise<ApiResponse<SettingsData>> {
        return this.makeRequest<SettingsData>('/user/settings');
    }

    async updateUserSettings(settings: Partial<SettingsData>): Promise<ApiResponse<SettingsData>> {
        return this.makeRequest<SettingsData>('/user/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    async changePassword(passwordData: PasswordChangeData): Promise<ApiResponse<void>> {
        return this.makeRequest<void>('/user/password', {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });
    }

    async requestRoleUpgrade(request: RoleUpgradeRequest): Promise<ApiResponse<{ request_id: number; status: string; submitted_at: string }>> {
        return this.makeRequest<{ request_id: number; status: string; submitted_at: string }>('/user/role-upgrade', {
            method: 'POST',
            body: JSON.stringify(request)
        });
    }

    async getRoleUpgradeStatus(): Promise<ApiResponse<{ current_requests: RoleUpgradeRequest[]; request_history: RoleUpgradeRequest[] }>> {
        return this.makeRequest<{ current_requests: RoleUpgradeRequest[]; request_history: RoleUpgradeRequest[] }>('/user/role-upgrade/status');
    }

    async deleteAccount(data: AccountDeletionData): Promise<ApiResponse<void>> {
        return this.makeRequest<void>('/user/account', {
            method: 'DELETE',
            body: JSON.stringify(data)
        });
    }

    async exportUserData(): Promise<ApiResponse<{ download_url: string; expires_at: string }>> {
        return this.makeRequest<{ download_url: string; expires_at: string }>('/user/data-export');
    }
}

// Export both the original types and the mock service
export type { ProfileData, SettingsData };
export const mockProfileService = new MockProfileService();

console.log('🧪 Mock Profile Service loaded - Use this for testing while backend is being implemented');
