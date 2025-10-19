// Event Service for Featured Events API
import { auth } from '../firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required');
  }
  
  const token = await user.getIdToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export interface Event {
  id: number;
  event_name: string;
  society_name: string;
  description: string;
  visibility: string;
  date: string;
  time: string;
  location: string;
  event_category: string;
  needed_volunteers_count?: number;
  organized_by: string;
  image_urls: string[];
  max_participants?: number;
  event_status: string;
  created_at?: string;
  status?: string;
  created_by?: number;
  moderated_by?: number;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  registered_at: string;
  event?: Event;
}

export interface EventRegistrationStatus {
  success: boolean;
  isRegistered: boolean;
  registration: EventRegistration | null;
}

export interface EventRegistrationsResponse {
  success: boolean;
  count: number;
  maxParticipants: number | null;
  spotsAvailable: number | null;
  registrations: Array<{
    id: number;
    registeredAt: string;
    user: {
      id: number;
      email: string;
      first_name: string | null;
      last_name: string | null;
      display_name: string | null;
    };
  }>;
}

class EventService {
  /**
   * Get all approved events (Featured Events)
   * Public access - no authentication required
   */
  async getApprovedEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/approved/list`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch approved events');
      }
      
      return data.events || [];
    } catch (error: any) {
      console.error('Error fetching approved events:', error);
      throw error;
    }
  }

  /**
   * Register user for an event
   * Requires authentication
   */
  async registerForEvent(eventId: number): Promise<any> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
        method: 'POST',
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  /**
   * Unregister from an event
   * Requires authentication
   */
  async unregisterFromEvent(eventId: number): Promise<any> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/register`, {
        method: 'DELETE',
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unregister from event');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  }

  /**
   * Check if user is registered for an event
   * Requires authentication
   */
  async checkRegistrationStatus(eventId: number): Promise<EventRegistrationStatus> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/registration-status`, {
        method: 'GET',
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check registration status');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error checking registration status:', error);
      throw error;
    }
  }

  /**
   * Get all user's event registrations
   * Requires authentication
   */
  async getUserRegistrations(): Promise<EventRegistration[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/events/user/registrations`, {
        method: 'GET',
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user registrations');
      }
      
      return data.registrations || [];
    } catch (error: any) {
      console.error('Error fetching user registrations:', error);
      throw error;
    }
  }

  /**
   * Get event registrations (for organizers)
   * Requires authentication
   */
  async getEventRegistrations(eventId: number): Promise<EventRegistrationsResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/registrations`, {
        method: 'GET',
        headers,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event registrations');
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching event registrations:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
