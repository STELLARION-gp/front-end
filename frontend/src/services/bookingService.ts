// services/bookingService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Booking {
  id: number;
  service_id: number;
  user_id: number;
  booking_date: string | Date;
  booking_time?: string;
  participants_count: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method?: string;
  transaction_id?: string;
  booking_status: BookingStatus;
  special_requests?: string;
  cancellation_reason?: string;
  cancelled_at?: string | Date;
  confirmed_at?: string | Date;
  completed_at?: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
  // Relations
  service?: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    duration: string;
    location: string;
    image_url: string;
    creator?: {
      id: number;
      first_name?: string;
      last_name?: string;
      email: string;
      display_name?: string;
    };
  };
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    display_name?: string;
  };
}

export interface Review {
  id: number;
  service_id: number;
  user_id: number;
  rating: number;
  review: string;
  images?: string[];
  is_verified: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    display_name?: string;
  };
}

export interface CreateBookingRequest {
  service_id: number;
  availability_id: number;
  participants: number;
  total_price: number;
  special_requests?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
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
// BOOKING OPERATIONS
// ============================================================================

/**
 * Create a new booking
 */
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  return apiCall<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get user's bookings
 */
export const getMyBookings = async (params?: {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}): Promise<{
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/bookings/my-bookings${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get bookings for guide's services
 */
export const getGuideBookings = async (params?: {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}): Promise<{
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/bookings/guide-bookings${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get a single booking by ID
 */
export const getBookingById = async (bookingId: number): Promise<Booking> => {
  return apiCall<Booking>(`/bookings/${bookingId}`);
};

/**
 * Cancel a booking
 */
export const cancelBooking = async (bookingId: number, reason?: string): Promise<Booking> => {
  return apiCall<Booking>(`/bookings/${bookingId}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
};

/**
 * Confirm a booking (guide accepts)
 */
export const confirmBooking = async (bookingId: number): Promise<Booking> => {
  return apiCall<Booking>(`/bookings/${bookingId}/confirm`, {
    method: 'PATCH',
  });
};

/**
 * Reject a booking (guide rejects)
 */
export const rejectBooking = async (bookingId: number, reason?: string): Promise<Booking> => {
  return apiCall<Booking>(`/bookings/${bookingId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
};

// ============================================================================
// REVIEW OPERATIONS
// ============================================================================

/**
 * Create a review for a booking
 */
export const createReview = async (
  bookingId: number,
  data: CreateReviewRequest
): Promise<Review> => {
  return apiCall<Review>(`/bookings/${bookingId}/review`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get reviews for a service
 */
export const getServiceReviews = async (
  serviceId: number,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<{
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  return apiCall(`/bookings/services/${serviceId}/reviews${queryString ? `?${queryString}` : ''}`);
};

export default {
  createBooking,
  getMyBookings,
  getGuideBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  rejectBooking,
  createReview,
  getServiceReviews,
};
