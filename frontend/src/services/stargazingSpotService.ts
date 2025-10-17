// services/stargazingSpotService.ts
import { auth } from "../firebase";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export interface StargazingSpot {
  id: number;
  name: string;
  location: string;
  image_url?: string;
  image_urls: string[];    // NEW: Array of Cloudinary URLs
  rating: number;
  best_time?: string;
  description: string;
  facilities: string[];
  created_by: number;
  is_active: boolean;
  status: 'pending' | 'approved' | 'rejected'; // NEW
  moderated_by?: number;   // NEW
  moderated_at?: string;   // NEW
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
  moderator?: {            // NEW
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
  image_urls?: string[];   // Pre-uploaded URLs
  best_time?: string;
  description: string;
  facilities?: string[];
  rating?: number;
  images?: File[];         // NEW: Array of image files
}

export interface UpdateStargazingSpotRequest {
  name?: string;
  location?: string;
  image_url?: string;
  image_urls?: string[];   // Existing URLs to keep
  best_time?: string;
  description?: string;
  facilities?: string[];
  images?: File[];         // NEW: New images to add
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
  sort_by?: "name" | "location" | "rating" | "created_at";
  sort_order?: "asc" | "desc";
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
    throw new Error("Authentication required");
  }

  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// Helper function to get auth headers without Content-Type (for FormData)
const getAuthHeadersWithoutContentType = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Authentication required");
  }

  const token = await user.getIdToken();
  return {
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
    console.error("Stargazing Spot API Error:", error);
    throw error;
  }
};

// StargazingSpot API Service
export const stargazingSpotService = {
  // Get all stargazing spots with optional filters
  getAllStargazingSpots: async (
    filters?: StargazingSpotFilters
  ): Promise<ApiResponse<StargazingSpot[]>> => {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/stargazing-spots?${queryParams.toString()}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Get single stargazing spot by ID
  getStargazingSpotById: async (
    id: number
  ): Promise<ApiResponse<StargazingSpot>> => {
    const endpoint = `/stargazing-spots/${id}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Create new stargazing spot (authenticated) with optional images
  createStargazingSpot: async (
    spotData: CreateStargazingSpotRequest
  ): Promise<ApiResponse<StargazingSpot>> => {
    const endpoint = "/stargazing-spots";

    // Check if we have image files to upload
    if (spotData.images && spotData.images.length > 0) {
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', spotData.name);
      formData.append('location', spotData.location);
      formData.append('description', spotData.description);
      
      if (spotData.best_time) formData.append('best_time', spotData.best_time);
      if (spotData.rating !== undefined) formData.append('rating', spotData.rating.toString());
      if (spotData.image_url) formData.append('image_url', spotData.image_url);
      
      // Add facilities as JSON
      if (spotData.facilities && spotData.facilities.length > 0) {
        formData.append('facilities', JSON.stringify(spotData.facilities));
      }
      
      // Add image files (up to 10)
      spotData.images.forEach(image => {
        formData.append('images', image);
      });
      
      // Add pre-uploaded image URLs
      if (spotData.image_urls && spotData.image_urls.length > 0) {
        spotData.image_urls.forEach(url => {
          formData.append('image_urls', url);
        });
      }

      const headers = await getAuthHeadersWithoutContentType();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } else {
      // No images, use JSON
      const headers = await getAuthHeaders();

      const response = await makeRequest(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(spotData),
      });

      return response;
    }
  },

  // Update stargazing spot (authenticated) with optional new images
  updateStargazingSpot: async (
    id: number,
    spotData: UpdateStargazingSpotRequest
  ): Promise<ApiResponse<StargazingSpot>> => {
    const endpoint = `/stargazing-spots/${id}`;

    // Check if we have image files to upload
    if (spotData.images && spotData.images.length > 0) {
      const formData = new FormData();
      
      // Add only the fields that are being updated
      if (spotData.name !== undefined) formData.append('name', spotData.name);
      if (spotData.location !== undefined) formData.append('location', spotData.location);
      if (spotData.description !== undefined) formData.append('description', spotData.description);
      if (spotData.best_time !== undefined) formData.append('best_time', spotData.best_time);
      
      // Add facilities as JSON
      if (spotData.facilities !== undefined) {
        formData.append('facilities', JSON.stringify(spotData.facilities));
      }
      
      // Add existing image URLs to keep
      if (spotData.image_urls && spotData.image_urls.length > 0) {
        spotData.image_urls.forEach(url => {
          formData.append('image_urls', url);
        });
      }
      
      // Add new image files
      spotData.images.forEach(image => {
        formData.append('images', image);
      });

      const headers = await getAuthHeadersWithoutContentType();
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } else {
      // No images, use JSON
      const headers = await getAuthHeaders();

      const response = await makeRequest(endpoint, {
        method: "PUT",
        headers,
        body: JSON.stringify(spotData),
      });

      return response;
    }
  },

  // Delete stargazing spot (authenticated)
  deleteStargazingSpot: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${id}`;

    await makeRequest(endpoint, {
      method: "DELETE",
      headers,
    });
  },

  // Moderate a stargazing spot (approve or reject) - Requires moderator or admin role
  moderateStargazingSpot: async (
    spotId: number,
    action: 'approve' | 'reject'
  ): Promise<ApiResponse<StargazingSpot>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/moderate`;

    const response = await makeRequest(endpoint, {
      method: "PUT",
      headers,
      body: JSON.stringify({ action }),
    });

    return response;
  },

  // Get stargazing spots by moderation status - Requires moderator or admin role
  getSpotsByStatus: async (
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<ApiResponse<StargazingSpot[]>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/status/${status}`;

    const response = await makeRequest(endpoint, {
      method: "GET",
      headers,
    });

    return response;
  },

  // Add review to stargazing spot (authenticated)
  addReview: async (
    spotId: number,
    reviewData: CreateReviewRequest
  ): Promise<ApiResponse<StargazingSpotReview>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/reviews`;

    const response = await makeRequest(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(reviewData),
    });

    return response;
  },

  // Get reviews for stargazing spot
  getSpotReviews: async (
    spotId: number,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<StargazingSpotReview[]>> => {
    const endpoint = `/stargazing-spots/${spotId}/reviews?page=${page}&limit=${limit}`;
    const response = await makeRequest(endpoint);
    return response;
  },

  // Update review (authenticated)
  updateReview: async (
    spotId: number,
    reviewId: number,
    reviewData: CreateReviewRequest
  ): Promise<ApiResponse<StargazingSpotReview>> => {
    const headers = await getAuthHeaders();
    const endpoint = `/stargazing-spots/${spotId}/reviews/${reviewId}`;

    const response = await makeRequest(endpoint, {
      method: "PUT",
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
      method: "DELETE",
      headers,
    });
  },
};

export default stargazingSpotService;
