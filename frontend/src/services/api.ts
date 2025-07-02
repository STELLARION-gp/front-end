import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5432/api';

/**
 * API service for backend communication
 * Automatically handles Firebase authentication tokens
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

  // User Management
  async registerUser(userData: {
    email: string;
    displayName: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) {
    return this.makeRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.makeRequest('/users/profile');
  }

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

  // Health check
  async healthCheck() {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
  }
}

export const apiService = new ApiService();
