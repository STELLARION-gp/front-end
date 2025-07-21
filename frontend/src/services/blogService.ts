// services/blogService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Blog {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    author_id: number;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    tags: string[];
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
    // Virtual fields from joins
    author_name?: string;
    author_email?: string;
    author_display_name?: string;
    user_liked?: boolean;
}

export interface BlogComment {
    id: number;
    blog_id: number;
    user_id: number;
    parent_comment_id?: number;
    content: string;
    is_edited: boolean;
    created_at: string;
    updated_at: string;
    user_name?: string;
    user_email?: string;
    user_display_name?: string;
    replies?: BlogComment[];
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    status?: 'draft' | 'published';
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface UpdateBlogRequest {
    title?: string;
    content?: string;
    excerpt?: string;
    image_url?: string;
    status?: 'draft' | 'published';
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface BlogFilters {
    status?: 'draft' | 'published' | 'archived';
    author_id?: number;
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
    sort_by?: 'created_at' | 'published_at' | 'view_count' | 'like_count' | 'title';
    sort_order?: 'asc' | 'desc';
}

export interface CreateCommentRequest {
    content: string;
    parent_comment_id?: number;
}

export interface UpdateCommentRequest {
    content: string;
}

const getAuthToken = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('No authenticated user found');
            return null;
        }
        const token = await user.getIdToken();
        console.log('Got auth token:', token ? 'Token exists' : 'No token');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

const makeRequest = async (url: string, options: RequestInit = {}) => {
    const token = await getAuthToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header');
    } else {
        console.log('No token available for request');
    }
    
    console.log(`Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    return response.json();
};

export const blogService = {
    // Get all blogs with filtering
    async getBlogs(filters: BlogFilters = {}) {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    queryParams.append(key, value.join(','));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });
        
        const url = `/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return makeRequest(url);
    },

    // Get single blog by ID
    async getBlogById(id: number) {
        return makeRequest(`/blogs/${id}`);
    },

    // Create new blog
    async createBlog(blogData: CreateBlogRequest) {
        return makeRequest('/blogs', {
            method: 'POST',
            body: JSON.stringify(blogData)
        });
    },

    // Update blog
    async updateBlog(id: number, blogData: UpdateBlogRequest) {
        return makeRequest(`/blogs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(blogData)
        });
    },

    // Delete blog
    async deleteBlog(id: number) {
        return makeRequest(`/blogs/${id}`, {
            method: 'DELETE'
        });
    },

    // Toggle like on blog
    async toggleBlogLike(id: number) {
        return makeRequest(`/blogs/${id}/like`, {
            method: 'POST'
        });
    },

    // Get blog comments
    async getBlogComments(id: number, page = 1, limit = 20) {
        return makeRequest(`/blogs/${id}/comments?page=${page}&limit=${limit}`);
    },

    // Add comment to blog
    async addBlogComment(id: number, commentData: CreateCommentRequest) {
        return makeRequest(`/blogs/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    },

    // Update comment
    async updateBlogComment(blogId: number, commentId: number, commentData: UpdateCommentRequest) {
        return makeRequest(`/blogs/${blogId}/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify(commentData)
        });
    },

    // Delete comment
    async deleteBlogComment(blogId: number, commentId: number) {
        return makeRequest(`/blogs/${blogId}/comments/${commentId}`, {
            method: 'DELETE'
        });
    },

    // Get user's blogs
    async getUserBlogs(userId: number, filters: Omit<BlogFilters, 'author_id'> = {}) {
        return this.getBlogs({ ...filters, author_id: userId });
    }
};
