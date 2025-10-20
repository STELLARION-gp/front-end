// services/guideApplicationService.ts
import { auth } from '../firebase';
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export interface GuideApplication {
  application_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  current_occupation: string | null;
  education_level: string | null;
  astronomy_education: string | null;
  guide_experience: string | null;
  total_experience: number;
  certifications: string[];
  astronomy_skills: string[];
  languages: string[];
  first_aid: boolean | null;
  driving_license: boolean | null;
  camp_types: string[];
  group_sizes: string[];
  equipment_familiarity: string[];
  outdoor_experience: string | null;
  available_dates: string[];
  preferred_locations: string[];
  accommodation_needs: string | null;
  transportation_needs: string | null;
  motivation: string | null;
  special_skills: string | null;
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  documents: {
    resume?: string;
    certifications?: string;
    portfolio?: string;
    idCard?: string;
  };
  selected_camps: string[];
  application_status: 'pending' | 'approved' | 'rejected';
  approve_application_status: 'pending' | 'accepted' | 'rejected';
  terms_accepted: boolean | null;
  background_check_consent: boolean | null;
  deletion_status: boolean | null;
  submitted_at: string | null;
  updated_at: string | null;
}

export interface GuideApplicationResponse {
  success: boolean;
  data: GuideApplication;
  message?: string;
}

export interface GuideApplicationsListResponse {
  success: boolean;
  data: GuideApplication[];
  message?: string;
}

/**
 * Get guide application by user ID
 */
export const getGuideApplicationByUserId = async (userId: number): Promise<GuideApplication | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE_URL}/guide-applications?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guide application');
    }

    const result: GuideApplicationsListResponse = await response.json();
    
    if (result.success && result.data && result.data.length > 0) {
      return result.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching guide application:', error);
    throw error;
  }
};

/**
 * Get guide application by application ID
 */
export const getGuideApplicationById = async (applicationId: number): Promise<GuideApplication | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE_URL}/guide-applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guide application');
    }

    const result: GuideApplicationResponse = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching guide application:', error);
    throw error;
  }
};

/**
 * Get all guide applications (admin only)
 */
export const getAllGuideApplications = async (): Promise<GuideApplication[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE_URL}/guide-applications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch guide applications');
    }

    const result: GuideApplicationsListResponse = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching guide applications:', error);
    throw error;
  }
};

/**
 * Update guide application
 */
export const updateGuideApplication = async (
  applicationId: number,
  applicationData: Partial<GuideApplication>
): Promise<GuideApplication> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
    const response = await fetch(`${API_BASE_URL}/guide-applications/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error('Failed to update guide application');
    }

    const result: GuideApplicationResponse = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Error updating guide application:', error);
    throw error;
  }
};
