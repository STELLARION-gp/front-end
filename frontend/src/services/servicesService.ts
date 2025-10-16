// services/servicesService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Type definitions matching your CreateService component and database schema
export type ServiceCategory = 'stargazing' | 'astrophotography' | 'telescope' | 'planetarium' | 'workshop' | 'expedition';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ServiceStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface Service {
  id: number;
  guide_id: number;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: string;
  max_participants: number;
  location: string;
  difficulty: DifficultyLevel;
  equipment: string[];
  next_available: string | Date;
  image: string;
  featured: boolean;
  tags: string[];
  requirements?: string | null;
  cancellation_policy?: string | null;
  meeting_point?: string | null;
  what_to_expect?: string | null;
  weather_policy?: string | null;
  booking_deadline?: number | null;
  languages: string[];
  certification?: string | null;
  experience?: string | null;
  group_discount: boolean;
  private_booking: boolean;
  instant_booking: boolean;
  status: ServiceStatus;
  rating?: number | null;
  total_bookings: number;
  created_at: string | Date;
  updated_at: string | Date;
  // Related data
  guide?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    profile_image?: string;
  };
  media?: ServiceMedia[];
  availability?: ServiceAvailability[];
}

export interface ServiceMedia {
  id: number;
  service_id: number;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
  created_at: string | Date;
}

export interface ServiceAvailability {
  id: number;
  service_id: number;
  date: string | Date;
  start_time: string;
  end_time: string;
  slots_available: number;
  slots_booked: number;
  is_available: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CreateServiceRequest {
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  duration: string;
  max_participants: number;
  location: string;
  difficulty: DifficultyLevel;
  equipment: string[];
  next_available: string;
  image: string;
  featured?: boolean;
  tags?: string[];
  requirements?: string;
  cancellation_policy?: string;
  meeting_point?: string;
  what_to_expect?: string;
  weather_policy?: string;
  booking_deadline?: number;
  languages?: string[];
  certification?: string;
  experience?: string;
  group_discount?: boolean;
  private_booking?: boolean;
  instant_booking?: boolean;
  status?: ServiceStatus;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  id: number;
}

export interface CreateAvailabilityRequest {
  service_id: number;
  date: string; // ISO format: YYYY-MM-DD
  start_time: string; // Format: HH:MM
  end_time: string; // Format: HH:MM
  slots_available: number;
}

export interface UpdateAvailabilityRequest {
  id: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  slots_available?: number;
  is_available?: boolean;
}

export interface ServiceFilters {
  category?: ServiceCategory;
  difficulty?: DifficultyLevel;
  min_price?: number;
  max_price?: number;
  location?: string;
  featured?: boolean;
  status?: ServiceStatus;
  search?: string;
  page?: number;
  limit?: number;
}

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

// ============================================================================
// SERVICE CRUD OPERATIONS
// ============================================================================

/**
 * Create a new service
 */
export const createService = async (data: CreateServiceRequest): Promise<Service> => {
  return apiCall<Service>('/services', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get all services (with optional filters)
 */
export const getServices = async (filters?: ServiceFilters): Promise<{
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/services${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (serviceId: number): Promise<Service> => {
  return apiCall<Service>(`/services/${serviceId}`);
};

/**
 * Get services created by the current user (guide)
 */
export const getMyServices = async (filters?: {
  status?: ServiceStatus;
  page?: number;
  limit?: number;
}): Promise<{
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/services/my-services${queryString ? `?${queryString}` : ''}`);
};

/**
 * Update an existing service
 */
export const updateService = async (
  serviceId: number,
  updates: Partial<CreateServiceRequest>
): Promise<Service> => {
  return apiCall<Service>(`/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId: number): Promise<{ message: string }> => {
  return apiCall(`/services/${serviceId}`, {
    method: 'DELETE',
  });
};

/**
 * Change service status (draft, active, paused, archived)
 */
export const updateServiceStatus = async (
  serviceId: number,
  status: ServiceStatus
): Promise<Service> => {
  return apiCall<Service>(`/services/${serviceId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Toggle featured status
 */
export const toggleFeatured = async (serviceId: number): Promise<Service> => {
  return apiCall<Service>(`/services/${serviceId}/featured`, {
    method: 'PATCH',
  });
};

// ============================================================================
// SERVICE AVAILABILITY MANAGEMENT
// ============================================================================

/**
 * Get availability slots for a service
 */
export const getServiceAvailability = async (
  serviceId: number,
  params?: {
    start_date?: string;
    end_date?: string;
    available_only?: boolean;
  }
): Promise<ServiceAvailability[]> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/services/${serviceId}/availability${queryString ? `?${queryString}` : ''}`);
};

/**
 * Create new availability slot
 */
export const createAvailability = async (
  data: CreateAvailabilityRequest
): Promise<ServiceAvailability> => {
  return apiCall<ServiceAvailability>('/services/availability', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Create multiple availability slots at once
 */
export const createBulkAvailability = async (
  slots: CreateAvailabilityRequest[]
): Promise<ServiceAvailability[]> => {
  return apiCall<ServiceAvailability[]>('/services/availability/bulk', {
    method: 'POST',
    body: JSON.stringify({ slots }),
  });
};

/**
 * Update an availability slot
 */
export const updateAvailability = async (
  availabilityId: number,
  updates: Omit<UpdateAvailabilityRequest, 'id'>
): Promise<ServiceAvailability> => {
  return apiCall<ServiceAvailability>(`/services/availability/${availabilityId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

/**
 * Delete an availability slot
 */
export const deleteAvailability = async (
  availabilityId: number
): Promise<{ message: string }> => {
  return apiCall(`/services/availability/${availabilityId}`, {
    method: 'DELETE',
  });
};

/**
 * Toggle availability status (enable/disable)
 */
export const toggleAvailabilityStatus = async (
  availabilityId: number
): Promise<ServiceAvailability> => {
  return apiCall<ServiceAvailability>(`/services/availability/${availabilityId}/toggle`, {
    method: 'PATCH',
  });
};

/**
 * Delete multiple availability slots
 */
export const deleteBulkAvailability = async (
  availabilityIds: number[]
): Promise<{ message: string; deleted: number }> => {
  return apiCall('/services/availability/bulk-delete', {
    method: 'DELETE',
    body: JSON.stringify({ ids: availabilityIds }),
  });
};

// ============================================================================
// SERVICE MEDIA MANAGEMENT
// ============================================================================

/**
 * Upload media for a service
 */
export const uploadServiceMedia = async (
  serviceId: number,
  files: File[]
): Promise<ServiceMedia[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('service_id', serviceId.toString());

  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

/**
 * Get all media for a service
 */
export const getServiceMedia = async (serviceId: number): Promise<ServiceMedia[]> => {
  return apiCall(`/services/${serviceId}/media`);
};

/**
 * Delete a media item
 */
export const deleteServiceMedia = async (
  serviceId: number,
  mediaId: number
): Promise<{ message: string }> => {
  return apiCall(`/services/${serviceId}/media/${mediaId}`, {
    method: 'DELETE',
  });
};

/**
 * Update media display order
 */
export const updateMediaOrder = async (
  serviceId: number,
  mediaOrder: { id: number; display_order: number }[]
): Promise<{ message: string }> => {
  return apiCall(`/services/${serviceId}/media/reorder`, {
    method: 'PATCH',
    body: JSON.stringify({ media_order: mediaOrder }),
  });
};

// ============================================================================
// SEARCH & DISCOVERY
// ============================================================================

/**
 * Search services with full-text search
 */
export const searchServices = async (
  query: string,
  filters?: Omit<ServiceFilters, 'search'>
): Promise<{
  services: Service[];
  total: number;
}> => {
  const queryParams = new URLSearchParams({ search: query });
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  return apiCall(`/services/search?${queryParams.toString()}`);
};

/**
 * Get featured services
 */
export const getFeaturedServices = async (limit: number = 10): Promise<Service[]> => {
  return apiCall(`/services/featured?limit=${limit}`);
};

/**
 * Get services by category
 */
export const getServicesByCategory = async (
  category: ServiceCategory,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<{
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams({ category });
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  return apiCall(`/services/category/${category}?${queryParams.toString()}`);
};

/**
 * Get services by guide
 */
export const getServicesByGuide = async (
  guideId: number,
  filters?: {
    status?: ServiceStatus;
    page?: number;
    limit?: number;
  }
): Promise<{
  services: Service[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/services/guide/${guideId}${queryString ? `?${queryString}` : ''}`);
};

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get service statistics
 */
export const getServiceStats = async (serviceId: number): Promise<{
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  total_reviews: number;
  upcoming_bookings: number;
  completion_rate: number;
}> => {
  return apiCall(`/services/${serviceId}/stats`);
};

/**
 * Get guide's overall service statistics
 */
export const getGuideServiceStats = async (): Promise<{
  total_services: number;
  active_services: number;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  by_category: Record<ServiceCategory, number>;
  by_status: Record<ServiceStatus, number>;
}> => {
  return apiCall('/services/my-services/stats');
};

export default {
  // Service CRUD
  createService,
  getServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService,
  updateServiceStatus,
  toggleFeatured,
  
  // Availability Management
  getServiceAvailability,
  createAvailability,
  createBulkAvailability,
  updateAvailability,
  deleteAvailability,
  toggleAvailabilityStatus,
  deleteBulkAvailability,
  
  // Media Management
  uploadServiceMedia,
  getServiceMedia,
  deleteServiceMedia,
  updateMediaOrder,
  
  // Search & Discovery
  searchServices,
  getFeaturedServices,
  getServicesByCategory,
  getServicesByGuide,
  
  // Statistics
  getServiceStats,
  getGuideServiceStats,
};
