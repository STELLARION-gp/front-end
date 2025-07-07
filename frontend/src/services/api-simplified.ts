import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Simplified API service that works with your current backend
 * Only uses endpoints that actually exist
 */
class ApiService {
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
    ): Promise<T> {
        console.log(`📡 API Request: ${endpoint}`);

        const token = await this.getAuthToken();
        console.log(`🔑 Auth token: ${token ? 'Present' : 'Missing'}`);

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            console.log(`🚀 Making request to: ${API_BASE_URL}${endpoint}`);
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            console.log(`📨 Response status: ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ API Error ${response.status}: ${errorText}`);
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log(`✅ API Response:`, data);
            return data;
        } catch (error) {
            console.error(`❌ Request failed:`, error);
            throw error;
        }
    }

    // Backend health check
    async isBackendAvailable(): Promise<boolean> {
        try {
            console.log('🔍 Checking backend health at:', `${API_BASE_URL.replace('/api', '')}/health`);
            const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                console.log('✅ Backend is available');
                return true;
            } else {
                console.log('❌ Backend responded with error:', response.status);
                return false;
            }
        } catch (error) {
            console.log('🔴 Backend not available:', error);
            return false;
        }
    }

    // Simplified registration - only call existing endpoint
    async registerUser(userData: {
        email: string;
        displayName: string;
        firstName?: string;
        lastName?: string;
        role?: string;
    }) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No authenticated user found');
        }

        const backendData = {
            firebaseUser: {
                uid: currentUser.uid,
                email: currentUser.email,
                name: userData.displayName
            },
            role: userData.role || 'learner',
            first_name: userData.firstName,
            last_name: userData.lastName
        };

        console.log('📡 Sending registration data to backend:', backendData);

        try {
            const result = await this.makeRequest('/users/register', {
                method: 'POST',
                body: JSON.stringify(backendData),
            });

            console.log('✅ Registration successful - user should be in database');
            return result;
        } catch (error) {
            console.error('❌ Registration failed:', error);
            throw error;
        }
    }

    // Simplified session validation - just check if backend is available
    async validateUserSession(_firebaseUser: { uid: string; email: string | null; displayName: string | null }) {
        console.log('🔐 Simplified session validation - checking backend availability...');

        const isAvailable = await this.isBackendAvailable();
        if (isAvailable) {
            console.log('✅ Backend is available - session considered valid');
            return { valid: true };
        } else {
            throw new Error('Backend not available');
        }
    }

    // Simplified profile fetch - return null (not implemented in backend yet)
    async getUserProfile() {
        console.log('⚠️ getUserProfile not implemented in backend - returning null');
        return null;
    }

    // Keep existing methods for compatibility
    async updateUserRole(userId: string, role: string) {
        return this.makeRequest(`/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role }),
        });
    }

    async getAllUsers(page = 1, limit = 10, filters?: { role?: string; isActive?: boolean }) {
        const queryParams = new URLSearchParams();
        queryParams.set('page', page.toString());
        queryParams.set('limit', limit.toString());

        if (filters?.role) queryParams.set('role', filters.role);
        if (filters?.isActive !== undefined) queryParams.set('isActive', filters.isActive.toString());

        return this.makeRequest(`/users?${queryParams}`);
    }

    async activateUser(userId: string) {
        return this.makeRequest(`/users/${userId}/activate`, {
            method: 'PUT',
        });
    }

    async deactivateUser(userId: string) {
        return this.makeRequest(`/users/${userId}/deactivate`, {
            method: 'PUT',
        });
    }

    async healthCheck() {
        return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
    }
}

export const apiService = new ApiService();
