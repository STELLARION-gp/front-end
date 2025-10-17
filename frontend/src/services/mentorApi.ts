// services/mentorApi.ts
import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.FULL_API_URL;

export interface MentorProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  maxMentees?: number;
  isAvailable?: boolean;
  specialties?: string[];
  qualifications?: string[];
  menteeCount?: number;
  services?: string[];
}

export interface UpdateMentorProfileData {
  name?: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  maxMentees?: number;
  isAvailable?: boolean;
  specialties?: string[];
  qualifications?: string[];
}

// Get current mentor profile
export const getMentorProfile = async (token: string): Promise<MentorProfile> => {
  try {
    const response = await axios.get(`${API_URL}/mentor/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('📡 Raw API Response:', response.data);
    console.log('📦 Extracted data:', response.data.data);
    console.log('📋 Specialties from API:', response.data.data?.specialties);
    console.log('📋 Qualifications from API:', response.data.data?.qualifications);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    throw error;
  }
};

// Update mentor profile
export const updateMentorProfile = async (
  token: string,
  data: UpdateMentorProfileData
): Promise<MentorProfile> => {
  try {
    const response = await axios.put(`${API_URL}/mentor/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating mentor profile:', error);
    throw error;
  }
};

// Get all mentors (public)
export const getAllMentors = async (filters?: {
  available?: boolean;
  specialty?: string;
}): Promise<MentorProfile[]> => {
  try {
    const params = new URLSearchParams();
    if (filters?.available !== undefined) {
      params.append('available', filters.available.toString());
    }
    if (filters?.specialty) {
      params.append('specialty', filters.specialty);
    }

    const response = await axios.get(`${API_URL}/mentor/mentors?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};

// Get specific mentor profile by ID (public)
export const getMentorProfileById = async (id: number): Promise<MentorProfile> => {
  try {
    const response = await axios.get(`${API_URL}/mentor/mentors/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching mentor profile by ID:', error);
    throw error;
  }
};
