import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * API service for backend communication
 * Automatically handles Firebase authentication tokens
 */
class ApiService {
  private async getAuthToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      // Always try to refresh the token if requested
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    console.log(`📡 API Request: ${endpoint}`);
    let token = await this.getAuthToken();
    console.log(`🔑 Auth token: ${token ? 'Present' : 'Missing'}`);
    // Always create a fresh headers object for each request
    const buildHeaders = (tokenValue: string | null) => ({
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
      ...(tokenValue ? { 'Authorization': `Bearer ${tokenValue}` } : {})
    });
    let headers = buildHeaders(token);
    try {
      console.log(`🚀 Making request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      console.log(`📨 Response status: ${response.status}`);
      if (response.status === 401 && retry) {
        // Token might be expired, try to refresh and retry once
        console.warn('🔄 Token expired or invalid, refreshing and retrying...');
        token = await this.getAuthToken(true);
        if (token) {
          headers = buildHeaders(token);
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(`API Error ${retryResponse.status}: ${errorText}`);
          }
          const retryData = await retryResponse.json();
          return retryData;
        }
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred in API request');
      }
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
    // Get current Firebase user for the backend
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    // Transform to match backend's expected format
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

    return this.makeRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async getUserProfile() {
    return this.makeRequest('/user/profile');
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

  // Chatbot API
  async sendChatMessage(message: string, context: string = 'space_exploration_assistant', conversationId?: string) {
    console.log('🤖 ApiService: Sending chat message:', message.substring(0, 50) + '...');
    console.log('🤖 ApiService: Context:', context);
    
    const result = await this.makeRequest('/chatbot', {
      method: 'POST',
      body: JSON.stringify({
        message,
        context,
        conversationId
      }),
    });
    
    console.log('🤖 ApiService: Chat response received:', result);
    return result;
  }

  // Chatbot health check
  async getChatbotHealth() {
    return this.makeRequest('/chatbot/health');
  }
}

export const apiService = new ApiService();
