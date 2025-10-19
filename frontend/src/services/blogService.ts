// services/blogService.ts
import { auth } from "../firebase";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export interface Blog {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string; // Legacy field for compatibility
  featured_image?: string; // Backend field
  author_id: number;
  status:
    | "draft"
    | "published"
    | "archived"
    | "pending"
    | "approved"
    | "rejected";
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
  featured_image?: string; // For backward compatibility (URL)
  image?: File; // For multipart upload
  status?: "draft" | "published" | "pending";
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string; // For backward compatibility (URL)
  image?: File; // For multipart upload
  status?: "draft" | "published" | "pending" | "approved" | "rejected";
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface BlogFilters {
  status?:
    | "draft"
    | "published"
    | "archived"
    | "pending"
    | "approved"
    | "rejected";
  author_id?: number;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort_by?:
    | "created_at"
    | "published_at"
    | "view_count"
    | "like_count"
    | "title";
  sort_order?: "asc" | "desc";
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
      console.log("No authenticated user found");
      return null;
    }
    const token = await user.getIdToken();
    console.log("Got auth token:", token ? "Token exists" : "No token");
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("Added Authorization header");
  } else {
    console.log("No token available for request");
  }

  console.log(
    `Making ${options.method || "GET"} request to: ${API_BASE_URL}${url}`
  );

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
};

export const blogService = {
  // Get blogs liked by the current user
  async getLikedBlogs() {
    return makeRequest("/blogs/liked/me");
  },
  // Get all blogs with filtering
  async getBlogs(filters: BlogFilters = {}) {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(","));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const url = `/blogs${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return makeRequest(url);
  },

  // Get single blog by ID
  async getBlogById(id: number) {
    return makeRequest(`/blogs/${id}`);
  },

  // Create new blog with multipart/form-data support
  async createBlog(blogData: CreateBlogRequest) {
    const token = await getAuthToken();

    // If there's an image file, use FormData
    if (blogData.image) {
      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("content", blogData.content);
      if (blogData.excerpt) formData.append("excerpt", blogData.excerpt);
      if (blogData.status) formData.append("status", blogData.status);
      if (blogData.tags && blogData.tags.length > 0) {
        formData.append("tags", JSON.stringify(blogData.tags));
      }
      if (blogData.metadata) {
        formData.append("metadata", JSON.stringify(blogData.metadata));
      }
      formData.append("image", blogData.image);

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("Creating blog with FormData (multipart/form-data)");
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return response.json();
    } else {
      // No image, use regular JSON request
      return makeRequest("/blogs", {
        method: "POST",
        body: JSON.stringify(blogData),
      });
    }
  },

  // Update blog with multipart/form-data support
  async updateBlog(id: number, blogData: UpdateBlogRequest) {
    const token = await getAuthToken();

    // If there's an image file, use FormData
    if (blogData.image) {
      const formData = new FormData();
      if (blogData.title) formData.append("title", blogData.title);
      if (blogData.content) formData.append("content", blogData.content);
      if (blogData.excerpt) formData.append("excerpt", blogData.excerpt);
      if (blogData.status) formData.append("status", blogData.status);
      if (blogData.tags && blogData.tags.length > 0) {
        formData.append("tags", JSON.stringify(blogData.tags));
      }
      if (blogData.metadata) {
        formData.append("metadata", JSON.stringify(blogData.metadata));
      }
      formData.append("image", blogData.image);

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      console.log("Updating blog with FormData (multipart/form-data)");
      const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
        method: "PUT",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return response.json();
    } else {
      // No image, use regular JSON request
      return makeRequest(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(blogData),
      });
    }
  },

  // Delete blog
  async deleteBlog(id: number) {
    return makeRequest(`/blogs/${id}`, {
      method: "DELETE",
    });
  },

  // Toggle like on blog
  async toggleBlogLike(id: number) {
    return makeRequest(`/blogs/${id}/like`, {
      method: "POST",
    });
  },

  // Submit a rating for a blog (1-5)
  async rateBlog(id: number, rating: number) {
    return makeRequest(`/blogs/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating }),
    });
  },

  // Get blog comments
  async getBlogComments(id: number, page = 1, limit = 20) {
    return makeRequest(`/blogs/${id}/comments?page=${page}&limit=${limit}`);
  },

  // Add comment to blog
  async addBlogComment(id: number, commentData: CreateCommentRequest) {
    return makeRequest(`/blogs/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  // Update comment
  async updateBlogComment(
    blogId: number,
    commentId: number,
    commentData: UpdateCommentRequest
  ) {
    return makeRequest(`/blogs/${blogId}/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify(commentData),
    });
  },

  // Delete comment
  async deleteBlogComment(blogId: number, commentId: number) {
    return makeRequest(`/blogs/${blogId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  // Get user's blogs
  async getUserBlogs(
    userId: number,
    filters: Omit<BlogFilters, "author_id"> = {}
  ) {
    return this.getBlogs({ ...filters, author_id: userId });
  },
};
