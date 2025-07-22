import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface NightCamp {
  id: number;
  name: string;
  organized_by?: string;
  sponsored_by?: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  number_of_participants: number;
  image_urls: string[];
  emergency_contact?: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface NightCampActivity {
  id: number;
  night_camp_id: number;
  activity: string;
  created_at: string;
}

export interface NightCampEquipment {
  id: number;
  night_camp_id: number;
  category: 'provided' | 'required' | 'optional';
  equipment_name: string;
  created_at: string;
}

export interface NightCampVolunteering {
  id: number;
  night_camp_id: number;
  volunteering_role: string;
  number_of_applicants: number;
  created_at: string;
}

export interface NightCampWithDetails extends NightCamp {
  activities: NightCampActivity[];
  equipment: NightCampEquipment[];
  volunteering: NightCampVolunteering[];
}

export interface VolunteeringApplication {
  id: number;
  night_camp_id: number;
  user_id: number;
  volunteering_role: string;
  motivation?: string;
  experience?: string;
  availability?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
  reviewed_by?: number;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  // Additional fields from JOIN query
  night_camp_name?: string;
  night_camp_date?: string;
  night_camp_location?: string;
  reviewed_by_name?: string;
}

export interface CreateVolunteeringApplicationRequest {
  night_camp_id: number;
  volunteering_role: string;
  motivation?: string;
  experience?: string;
  availability?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

export interface UpdateVolunteeringApplicationRequest {
  volunteering_role?: string;
  motivation?: string;
  experience?: string;
  availability?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
}

class NightCampService {
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
    console.log(`📡 Night Camp API Request: ${endpoint}`);

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
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data);
      return data;

    } catch (error) {
      console.error('❌ Network/Parse Error:', error);
      throw error;
    }
  }

  // Get all night camps
  async getAllNightCamps(): Promise<NightCampWithDetails[]> {
    try {
      const response = await this.makeRequest<{ data: NightCampWithDetails[] }>('/nightcamps');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching night camps:', error);
      throw error;
    }
  }

  // Get night camp by ID
  async getNightCampById(id: number): Promise<NightCampWithDetails | null> {
    try {
      const response = await this.makeRequest<{ data: NightCampWithDetails }>(`/nightcamps/${id}`);
      return response.data || null;
    } catch (error) {
      console.error('Error fetching night camp:', error);
      throw error;
    }
  }

  // Apply for volunteering role
  async applyForVolunteering(applicationData: CreateVolunteeringApplicationRequest): Promise<VolunteeringApplication> {
    try {
      const response = await this.makeRequest<{ data: VolunteeringApplication, message: string }>('/nightcamps/volunteering/apply', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting volunteering application:', error);
      throw error;
    }
  }

  // Get user's volunteering applications
  async getUserVolunteeringApplications(): Promise<VolunteeringApplication[]> {
    try {
      const response = await this.makeRequest<{ data: VolunteeringApplication[] }>('/nightcamps/volunteering/my-applications');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user volunteering applications:', error);
      throw error;
    }
  }

  // Update user's volunteering application
  async updateUserVolunteeringApplication(
    applicationId: number, 
    updateData: UpdateVolunteeringApplicationRequest
  ): Promise<VolunteeringApplication> {
    try {
      const response = await this.makeRequest<{ data: VolunteeringApplication }>(
        `/nightcamps/volunteering/my-applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating volunteering application:', error);
      throw error;
    }
  }

  // Get volunteering roles for a night camp
  async getVolunteeringRoles(nightCampId: number): Promise<NightCampVolunteering[]> {
    try {
      const response = await this.makeRequest<{ data: NightCampVolunteering[] }>(`/nightcamps/${nightCampId}/volunteering`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching volunteering roles:', error);
      throw error;
    }
  }
}

export const nightCampService = new NightCampService();
