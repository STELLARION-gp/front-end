// services/menteeApplicationApi.ts
import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get Firebase auth token
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ No authenticated user found");
      return null;
    }
    const token = await user.getIdToken(true);
    console.log("✅ Got auth token for mentee application");
    return token;
  } catch (error) {
    console.error("❌ Error getting auth token:", error);
    return null;
  }
};

export interface MenteeApplication {
  application_id: number;
  learner_id: number;
  mentor_id: number;
  interest_statement: string;
  documents: Array<{
    fileId: string;
    fileName: string;
    webViewLink: string;
    webContentLink: string;
  }> | null;
  application_status: 'pending' | 'accepted' | 'rejected';
  submitted_at: string;
  updated_at: string;
  reviewed_at?: string;
  review_notes?: string;
  learner?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
  };
  mentor?: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
  };
}

/**
 * Submit a mentee application to a mentor
 */
export const submitMenteeApplication = async (
  mentorId: number,
  interest: string,
  documents?: File[]
): Promise<MenteeApplication> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const formData = new FormData();
  formData.append('mentorId', mentorId.toString());
  formData.append('interest', interest);
  
  if (documents && documents.length > 0) {
    documents.forEach(file => {
      formData.append('documents', file);
    });
  }

  console.log("📤 Submitting mentee application with token");
  
  const response = await axios.post(
    `${API_BASE_URL}/api/mentee-applications`,
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

/**
 * Get all applications submitted by the current learner
 */
export const getMyApplications = async (): Promise<MenteeApplication[]> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentee-applications/learner/submitted`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

/**
 * Get all applications received by the current mentor
 */
export const getReceivedApplications = async (): Promise<MenteeApplication[]> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentee-applications/mentor/received`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

/**
 * Get a specific application by ID
 */
export const getApplicationById = async (applicationId: number): Promise<MenteeApplication> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentee-applications/${applicationId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

/**
 * Update application status (mentor accepts/rejects)
 */
export const updateApplicationStatus = async (
  applicationId: number,
  status: 'accepted' | 'rejected' | 'pending',
  reviewNotes?: string
): Promise<MenteeApplication> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.patch(
    `${API_BASE_URL}/api/mentee-applications/${applicationId}/status`,
    { status, reviewNotes },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Delete/withdraw an application
 */
export const deleteApplication = async (applicationId: number): Promise<void> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  await axios.delete(
    `${API_BASE_URL}/api/mentee-applications/${applicationId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
};
