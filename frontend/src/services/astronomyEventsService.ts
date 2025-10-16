import { getAuth } from "firebase/auth";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Helper function to get auth headers (similar to space news service)
const getAuthHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Authentication required");
  }

  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Helper function for making API requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Astronomy Events API Error:", error);
    throw error;
  }
};

export interface AstronomyEvent {
  id: number;
  name: string;
  description: string;
  visibility: string;
  best_time: string;
  image_url?: string;
  event_date: string;
  end_date?: string;
  duration: string;
  event_type: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  _count?: {
    reminders: number;
  };
}

export interface EventReminder {
  id: number;
  user_id: number;
  event_id: number;
  reminder_time: string;
  is_sent: boolean;
  notification_type: string;
  created_at: string;
  updated_at: string;
  event?: {
    id: number;
    name: string;
    event_date: string;
    event_type: string;
    image_url?: string;
  };
}

export interface CreateEventRequest {
  name: string;
  description: string;
  visibility: string;
  best_time: string;
  image_url?: string;
  event_date: string;
  end_date?: string;
  duration: string;
  event_type: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  visibility?: string;
  best_time?: string;
  image_url?: string;
  event_date?: string;
  end_date?: string;
  duration?: string;
  event_type?: string;
  is_active?: boolean;
}

export interface SetReminderRequest {
  reminder_time: string;
  notification_type?: "email" | "push" | "both";
}

class AstronomyEventsService {
  // Get all astronomy events
  async getEvents(params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const response = await makeRequest(`/astronomy-events?${searchParams}`);
    return response.data;
  }

  // Get single astronomy event
  async getEvent(eventId: number) {
    const response = await makeRequest(`/astronomy-events/${eventId}`);
    return response.data;
  }

  // Create new astronomy event (moderator/admin only)
  async createEvent(eventData: CreateEventRequest) {
    const headers = await getAuthHeaders();
    const response = await makeRequest("/astronomy-events", {
      method: "POST",
      headers,
      body: JSON.stringify(eventData),
    });
    return response.data;
  }

  // Update astronomy event (moderator/admin only)
  async updateEvent(eventId: number, eventData: UpdateEventRequest) {
    const headers = await getAuthHeaders();
    const response = await makeRequest(`/astronomy-events/${eventId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(eventData),
    });
    return response.data;
  }

  // Delete astronomy event (moderator/admin only)
  async deleteEvent(eventId: number) {
    const headers = await getAuthHeaders();
    await makeRequest(`/astronomy-events/${eventId}`, {
      method: "DELETE",
      headers,
    });
  }

  // Get user's reminders
  async getUserReminders() {
    const headers = await getAuthHeaders();
    const response = await makeRequest("/astronomy-events/user/reminders", {
      headers,
    });
    return response.data;
  }

  // Set reminder for astronomy event
  async setEventReminder(eventId: number, reminderData: SetReminderRequest) {
    const headers = await getAuthHeaders();
    const response = await makeRequest(
      `/astronomy-events/${eventId}/reminder`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(reminderData),
      }
    );
    return response.data;
  }

  // Remove reminder for astronomy event
  async removeEventReminder(eventId: number) {
    const headers = await getAuthHeaders();
    await makeRequest(`/astronomy-events/${eventId}/reminder`, {
      method: "DELETE",
      headers,
    });
  }

  // Get event types
  async getEventTypes() {
    const response = await makeRequest("/astronomy-events/types");
    return response.data;
  }
}

export const astronomyEventsService = new AstronomyEventsService();
