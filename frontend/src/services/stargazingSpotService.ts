// services/stargazingSpotService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface StargazingSpot {
    id: number;
    name: string;
    location: string;
    image_url?: string;
    rating: number;
    best_time?: string;
    description: string;
    facilities: string[];
    created_by: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        display_name?: string;
        first_name?: string;
        last_name?: string;
    };
    reviews?: StargazingSpotReview[];
    review_count?: number;
    average_rating?: number;
}

export interface StargazingSpotReview {
    id: number;
    stargazing_spot_id: number;
    user_id: number;
    rating: number;
    review_text: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        display_name?: string;
        first_name?: string;
        last_name?: string;
    };
}

export interface CreateStargazingSpotRequest {
    name: string;
    location: string;
    image_url?: string;
    best_time?: string;
    description: string;
    facilities?: string[];
    rating?: number;
}

export interface UpdateStargazingSpotRequest {
    name?: string;
    location?: string;
    image_url?: string;
    best_time?: string;
    description?: string;
    facilities?: string[];
}

export interface CreateReviewRequest {
    rating: number;
    review_text: string;
}

export interface StargazingSpotFilters {
    location?: string;
    rating_min?: number;
    rating_max?: number;
    search?: string;
    sort_by?: 'name' | 'location' | 'rating' | 'created_at';
    sort_order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

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

// Helper function for making API requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Stargazing Spot API Error:', error);
    throw error;
  }
};

// StargazingSpot API Service
export const stargazingSpotService = {
  // Get all stargazing spots with optional filters
  getAllStargazingSpots: async (filters?: StargazingSpotFilters): Promise<ApiResponse<StargazingSpot[]>> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/stargazing-spots?${queryParams.toString()}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Get single stargazing spot by ID
  getStargazingSpotById: async (id: number): Promise<ApiResponse<StargazingSpot>> => {
    const endpoint = `/stargazing-spots/${id}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Create new stargazing spot (authenticated)
  createStargazingSpot: async (spotData: CreateStargazingSpotRequest): Promise<ApiResponse<StargazingSpot>> => {
    const headers = await getAuthHeaders();
    const endpoint = '/stargazing-spots';
    
    const response = await makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(spotData),
    });
    
    return response;
  },

  // Update stargazing spot (authenticated)
  updateStargazingSpot: async (id: number, spotData: UpdateStargazingSpotRequest): Promise<ApiResponse<StargazingSpot>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${id}`;
    
    const response = await makeRequest(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(spotData),
    });
    
    return response;
  },

  // Delete stargazing spot (authenticated)
  deleteStargazingSpot: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${id}`;
    
    await makeRequest(endpoint, {
      method: 'DELETE',
      headers,
    });
  },

  // Add review to stargazing spot (authenticated)
  addReview: async (spotId: number, reviewData: CreateReviewRequest): Promise<ApiResponse<StargazingSpotReview>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/reviews`;
    
    const response = await makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData),
    });
    
    return response;
  },

  // Get reviews for stargazing spot
  getSpotReviews: async (spotId: number, page = 1, limit = 10): Promise<ApiResponse<StargazingSpotReview[]>> => {
    const endpoint = `/stargazing-spots/${spotId}/reviews?page=${page}&limit=${limit}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Update review (authenticated)
  updateReview: async (spotId: number, reviewId: number, reviewData: CreateReviewRequest): Promise<ApiResponse<StargazingSpotReview>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/reviews/${reviewId}`;
    
    const response = await makeRequest(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(reviewData),
    });
    
    return response;
  },

  // Delete review (authenticated)
  deleteReview: async (spotId: number, reviewId: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/reviews/${reviewId}`;
    
    await makeRequest(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
};

export default stargazingSpotService;