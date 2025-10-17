import { auth } from "../firebase";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export interface Discussion {
  id: number;
  title: string;
  content: string;
  author_id: number;
  category: string;
  is_sticky: boolean;
  is_closed: boolean;
  views_count: number;
  replies_count: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  _count?: {
    comments: number;
    likes: number;
  };
  isLiked?: boolean;
  comments?: DiscussionComment[];
  likedCommentIds?: number[];
}

export interface DiscussionComment {
  id: number;
  discussion_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  replies?: DiscussionComment[];
  _count?: {
    likes: number;
    replies: number;
  };
}

export interface CreateDiscussionRequest {
  title: string;
  content: string;
  category: string;
}

export interface UpdateDiscussionRequest {
  title?: string;
  content?: string;
  category?: string;
}

export interface AddCommentRequest {
  content: string;
  parentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface GetDiscussionsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: "created_at" | "last_activity" | "replies_count" | "views_count";
  order?: "asc" | "desc";
}

export interface DiscussionResponse {
  discussions: Discussion[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalDiscussions: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}

class SpaceDiscussionService {
  private baseUrl = "/space-discussions";

  private async getAuthHeaders() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const token = await user.getIdToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      throw new Error("Authentication failed");
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  // Get all discussions with filtering and pagination
  async getDiscussions(
    params: GetDiscussionsParams = {}
  ): Promise<DiscussionResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.category && params.category !== "all")
        searchParams.append("category", params.category);
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.order) searchParams.append("order", params.order);

      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}?${searchParams.toString()}`,
        {
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error("Failed to get discussions:", error);
      throw error;
    }
  }

  // Get current user's discussions
  async getMyDiscussions(
    params: { page?: number; limit?: number; search?: string } = {}
  ): Promise<DiscussionResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);

      const response = await fetch(
        `${API_BASE_URL}${
          this.baseUrl
        }/my-discussions?${searchParams.toString()}`,
        {
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error("Failed to get my discussions:", error);
      throw error;
    }
  }

  // Get a specific discussion with comments
  async getDiscussionById(discussionId: number): Promise<Discussion> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}`,
        {
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Failed to get discussion ${discussionId}:`, error);
      throw error;
    }
  }

  // Create a new discussion
  async createDiscussion(data: CreateDiscussionRequest): Promise<Discussion> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}${this.baseUrl}`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error("Failed to create discussion:", error);
      throw error;
    }
  }

  // Update a discussion
  async updateDiscussion(
    discussionId: number,
    data: UpdateDiscussionRequest
  ): Promise<Discussion> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Failed to update discussion ${discussionId}:`, error);
      throw error;
    }
  }

  // Delete a discussion
  async deleteDiscussion(discussionId: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      await this.handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete discussion ${discussionId}:`, error);
      throw error;
    }
  }

  // Toggle like on a discussion
  async toggleDiscussionLike(discussionId: number): Promise<LikeResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}/like`,
        {
          method: "POST",
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(
        `Failed to toggle like on discussion ${discussionId}:`,
        error
      );
      throw error;
    }
  }

  // Add a comment to a discussion
  async addComment(
    discussionId: number,
    data: AddCommentRequest
  ): Promise<DiscussionComment> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}/comments`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(
        `Failed to add comment to discussion ${discussionId}:`,
        error
      );
      throw error;
    }
  }

  // Update a comment
  async updateComment(
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<DiscussionComment> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/comments/${commentId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Failed to update comment ${commentId}:`, error);
      throw error;
    }
  }

  // Delete a comment
  async deleteComment(commentId: number): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/comments/${commentId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      await this.handleResponse(response);
    } catch (error) {
      console.error(`Failed to delete comment ${commentId}:`, error);
      throw error;
    }
  }

  // Toggle like on a comment
  async toggleCommentLike(commentId: number): Promise<LikeResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/comments/${commentId}/like`,
        {
          method: "POST",
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(`Failed to toggle like on comment ${commentId}:`, error);
      throw error;
    }
  }

  // Moderator function: Pin/unpin discussion
  async toggleDiscussionPin(discussionId: number): Promise<Discussion> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}/pin`,
        {
          method: "POST",
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(
        `Failed to toggle pin on discussion ${discussionId}:`,
        error
      );
      throw error;
    }
  }

  // Moderator function: Close/open discussion
  async toggleDiscussionClose(discussionId: number): Promise<Discussion> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}${this.baseUrl}/${discussionId}/close`,
        {
          method: "POST",
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data;
    } catch (error) {
      console.error(
        `Failed to toggle close on discussion ${discussionId}:`,
        error
      );
      throw error;
    }
  }

  // Get discussion categories
  async getDiscussionCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${this.baseUrl}/categories`);
      const result = await this.handleResponse(response);
      return result.data.categories;
    } catch (error) {
      console.error("Failed to get discussion categories:", error);
      throw error;
    }
  }
}

export const spaceDiscussionService = new SpaceDiscussionService();
export default spaceDiscussionService;
