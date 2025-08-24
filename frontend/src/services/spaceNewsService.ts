import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Space News interfaces
export interface SpaceNews {
  id: number;
  title: string;
  content: string;
  category: string;
  image_urls: string[];
  publish_date: string;
  created_at: string;
  last_read_time: string | null;
  number_of_likes: number;
  number_of_comments: number;
  publisher: {
    id: number;
    name: string;
  };
  comments?: SpaceNewsComment[];
}

export interface SpaceNewsComment {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user: {
    id: number;
    name: string;
  };
  replies: SpaceNewsReply[];
}

export interface SpaceNewsReply {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  user: {
    id: number;
    name: string;
  };
}

export interface CreateSpaceNewsRequest {
  title: string;
  content: string;
  category: string;
  image_urls?: string[];
  publish_date?: string;
}

export interface SpaceNewsResponse {
  spaceNews: SpaceNews[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
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
    console.error('Space News API Error:', error);
    throw error;
  }
};

// Space News API Service
export const spaceNewsService = {
  // Get all space news with pagination and filters
  getSpaceNews: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}): Promise<SpaceNewsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params.search) searchParams.append('search', params.search);

    const endpoint = `/space-news?${searchParams.toString()}`;
    const response = await makeRequest(endpoint);
    return response.data;
  },

  // Get single space news by ID
  getSpaceNewsById: async (id: number): Promise<SpaceNews> => {
    const endpoint = `/space-news/${id}`;
    const response = await makeRequest(endpoint);
    return response.data;
  },

  // Create new space news (moderator only)
  createSpaceNews: async (newsData: CreateSpaceNewsRequest): Promise<SpaceNews> => {
    const headers = await getAuthHeaders();
    const endpoint = '/space-news';
    
    const response = await makeRequest(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(newsData),
    });
    
    return response.data;
  },

  // Update space news (moderator only)
  updateSpaceNews: async (id: number, newsData: Partial<CreateSpaceNewsRequest>): Promise<SpaceNews> => {
    const headers = await getAuthHeaders();
    const endpoint = `/space-news/${id}`;
    
    const response = await makeRequest(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(newsData),
    });
    
    return response.data;
  },

  // Delete space news (moderator only)
  deleteSpaceNews: async (id: number): Promise<void> => {
    const headers = await getAuthHeaders();
    const endpoint = `/space-news/${id}`;
    
    await makeRequest(endpoint, {
      method: 'DELETE',
      headers,
    });
  },

  // Get available categories
  getCategories: async (): Promise<string[]> => {
    const endpoint = '/space-news/categories';
    const response = await makeRequest(endpoint);
    return response.data.categories;
  },
};
