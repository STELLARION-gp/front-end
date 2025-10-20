import { getAuth } from 'firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Types based on backend API documentation
export interface GuideApplicationData {
  application_id: number;
  user_id: number;
  expertise_areas: string[];
  experience_years: number;
  bio: string;
  approve_application_status: 'pending' | 'accepted' | 'rejected';
  application_status: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firebase_uid: string;
  };
}

export interface InfluencerApplicationData {
  application_id: number;
  user_id: number;
  social_media_links: Record<string, string>;
  followers_count: number;
  approve_application_status: 'pending' | 'accepted' | 'rejected';
  application_status: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firebase_uid: string;
  };
}

export interface UnifiedApplication {
  application_id: number;
  user_id: number;
  type: 'guide' | 'influencer';
  approve_application_status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    firebase_uid: string;
  };
  // Guide-specific fields
  expertise_areas?: string[];
  experience_years?: number;
  bio?: string;
  // Influencer-specific fields
  social_media_links?: Record<string, string>;
  followers_count?: number;
}

export interface ModerationApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: UnifiedApplication[];
    stats: {
      guideCount: number;
      influencerCount: number;
      total: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ApplicationApproveResponse {
  success: boolean;
  message: string;
  data: GuideApplicationData | InfluencerApplicationData;
}

export interface ApplicationRejectResponse {
  success: boolean;
  message: string;
  data: GuideApplicationData | InfluencerApplicationData;
}

export interface ModerationFilters {
  status?: 'all' | 'pending' | 'accepted' | 'rejected';
  type?: 'all' | 'guide' | 'influencer';
  page?: number;
  limit?: number;
}

class ApplicationModerationService {
  private async getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`,
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  /**
   * Get all applications for moderation dashboard
   * Unified endpoint that fetches both guide and influencer applications
   */
  async getModerationApplications(
    filters: ModerationFilters = {}
  ): Promise<ModerationApplicationsResponse> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/api/guideApplication/admin/moderation${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<ModerationApplicationsResponse>(endpoint);
  }

  /**
   * Approve a guide application
   * Updates application status to 'accepted' and upgrades user role to 'guide'
   */
  async approveGuideApplication(applicationId: number): Promise<ApplicationApproveResponse> {
    return this.makeRequest<ApplicationApproveResponse>(
      `/api/guideApplication/${applicationId}/approve`,
      {
        method: 'PUT',
      }
    );
  }

  /**
   * Reject a guide application
   * Updates application status to 'rejected', user role unchanged
   */
  async rejectGuideApplication(
    applicationId: number,
    reason?: string
  ): Promise<ApplicationRejectResponse> {
    return this.makeRequest<ApplicationRejectResponse>(
      `/api/guideApplication/${applicationId}/reject`,
      {
        method: 'PUT',
        body: reason ? JSON.stringify({ reason }) : undefined,
      }
    );
  }

  /**
   * Approve an influencer application
   * Updates application status to 'accepted' and upgrades user role to 'influencer'
   */
  async approveInfluencerApplication(
    applicationId: number
  ): Promise<ApplicationApproveResponse> {
    return this.makeRequest<ApplicationApproveResponse>(
      `/api/influencerApplication/${applicationId}/approve`,
      {
        method: 'PUT',
      }
    );
  }

  /**
   * Reject an influencer application
   * Updates application status to 'rejected', user role unchanged
   */
  async rejectInfluencerApplication(
    applicationId: number,
    reason?: string
  ): Promise<ApplicationRejectResponse> {
    return this.makeRequest<ApplicationRejectResponse>(
      `/api/influencerApplication/${applicationId}/reject`,
      {
        method: 'PUT',
        body: reason ? JSON.stringify({ reason }) : undefined,
      }
    );
  }

  /**
   * Get a specific application by ID and type
   * This is a helper method to fetch full details of a single application
   */
  async getApplicationById(
    applicationId: number,
    type: 'guide' | 'influencer'
  ): Promise<UnifiedApplication> {
    const applications = await this.getModerationApplications({
      type: type,
      status: 'all',
    });
    
    const application = applications.data.applications.find(
      app => app.application_id === applicationId
    );
    
    if (!application) {
      throw new Error(`Application not found: ${applicationId}`);
    }
    
    return application;
  }
}

export const applicationModerationService = new ApplicationModerationService();
export default applicationModerationService;
