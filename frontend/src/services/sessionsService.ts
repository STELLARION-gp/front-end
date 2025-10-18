// services/sessionsService.ts
import { auth } from "../firebase";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

// Backend types - matching the actual API
export type SessionType = "live" | "recorded";
export type PaymentType = "paid" | "free";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";
export type SessionStatus = "pending" | "approved" | "rejected";

export interface Session {
  id: number;
  title: string;
  session_type: SessionType;
  payment_type: PaymentType;
  price?: number | null;
  duration: number; // Duration in minutes
  session_date: Date | string;
  session_time: Date | string;
  max_participants?: number | null;
  difficulty_level: DifficultyLevel;
  session_link?: string | null;
  description: string;
  materials?: string[];
  session_notes?: string | null;
  created_by: number;
  is_enabled: boolean;
  status: SessionStatus; // Session approval status
  created_at: Date | string;
  updated_at: Date | string;
  // Creator info when included
  creator?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    display_name?: string;
  };
}

export interface CreateSessionRequest {
  title: string;
  session_type: SessionType;
  payment_type: PaymentType;
  price?: number;
  duration: number;
  session_date: string; // ISO format: YYYY-MM-DD
  session_time: string; // Format: HH:MM:SS or HH:MM
  max_participants?: number;
  difficulty_level: DifficultyLevel;
  session_link?: string;
  description: string;
  materials?: string[];
  session_notes?: string;
}

export interface UpdateSessionRequest {
  title?: string;
  session_type?: SessionType;
  payment_type?: PaymentType;
  price?: number;
  duration?: number;
  session_date?: string;
  session_time?: string;
  max_participants?: number;
  difficulty_level?: DifficultyLevel;
  session_link?: string;
  description?: string;
  materials?: string[];
  session_notes?: string;
}

export interface SessionFilters {
  page?: number;
  limit?: number;
  session_type?: SessionType;
  payment_type?: PaymentType;
  difficulty_level?: DifficultyLevel;
  is_enabled?: boolean;
  search?: string;
  sort_by?: "session_date" | "created_at" | "title" | "duration" | "price";
  sort_order?: "asc" | "desc";
}

export interface SessionEnrollment {
  id: number;
  session_id: number;
  user_id: number;
  enrollment_status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "refunded";
  enrolled_at: string;
  cancelled_at?: string;
  session?: Session;
}

// API Response interfaces
export interface SessionResponse {
  success: boolean;
  data: Session;
  message: string;
}

export interface SessionsListResponse {
  success: boolean;
  data: Session[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

const getAuthToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("⚠️ No authenticated user found - User needs to log in");
      return null;
    }
    const token = await user.getIdToken(true); // Force refresh the token
    console.log("✅ Got auth token for user:", user.email);
    console.log("📋 User UID:", user.uid);
    console.log("🔑 Token (first 50 chars):", token.substring(0, 50) + "...");
    return token;
  } catch (error) {
    console.error("❌ Error getting auth token:", error);
    return null;
  }
};

const makeRequest = async (
  url: string,
  options: RequestInit = {},
  requireAuth: boolean = true
) => {
  const token = await getAuthToken();

  // Check if authentication is required but not available
  if (requireAuth && !token) {
    throw new Error("Authentication required. Please log in to continue.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log("✅ Added Authorization header with Bearer token");
    console.log("📋 Full request headers:", JSON.stringify(headers, null, 2));
  } else {
    console.warn("⚠️ No token available - making unauthenticated request");
  }

  console.log(
    `🌐 Making ${options.method || "GET"} request to: ${API_BASE_URL}${url}`
  );

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  console.log(`📡 Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    console.error("❌ Request failed:", errorData);

    // Provide better error messages
    if (response.status === 401) {
      throw new Error(
        `Authentication failed: ${errorData.message || "Please log in again."}`
      );
    }
    if (response.status === 403) {
      throw new Error("You do not have permission to perform this action.");
    }

    throw new Error(
      errorData.message || `Request failed with status ${response.status}`
    );
  }

  const result = await response.json();
  console.log("✅ Request successful:", result.message || "OK");
  
  // Extract data from backend response wrapper { success, message, data }
  return result.data || result;
};

export const sessionsService = {
  /**
   * Create a new session (mentor only)
   */
  async createSession(
    sessionData: CreateSessionRequest
  ): Promise<SessionResponse> {
    console.log("📝 Creating new session:", sessionData);
    return makeRequest(
      "/sessions",
      {
        method: "POST",
        body: JSON.stringify(sessionData),
      },
      true
    ); // Requires authentication
  },

  /**
   * Get all sessions created by the current mentor
   */
  async getMySessions(
    filters: Omit<SessionFilters, "mentor_id"> = {}
  ): Promise<SessionsListResponse> {
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

    const url = `/sessions/user/my-sessions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    console.log("📋 Fetching my sessions from:", url);
    return makeRequest(url, {}, true); // Requires authentication
  },

  /**
   * Get all enrolled sessions for the authenticated user
   */
  async getEnrolledSessions(
    filters: {
      page?: number;
      limit?: number;
      session_type?: SessionType;
      payment_status?:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "free_access";
      sort_by?: "enrollment_date" | "session_date";
      sort_order?: "asc" | "desc";
    } = {}
  ): Promise<SessionsListResponse> {
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

    const url = `/sessions/user/enrolled${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    console.log("📚 Fetching enrolled sessions from:", url);
    return makeRequest(url, {}, true); // Requires authentication
  },

  /**
   * Get detailed session information by enrollment ID
   */
  async getMySessionDetailsByEnrollment(enrollmentId: number): Promise<{
    success: boolean;
    data: {
      session: Session;
      instructor: {
        id: number;
        name: string;
        email: string;
        profile: any;
      };
      enrollment: {
        id: number;
        enrollment_date: string;
        payment_status: string;
        payment_amount: number | null;
        payment_method: string | null;
        transaction_id: string | null;
        access_granted: boolean;
        completed: boolean;
        progress: number;
        last_accessed_at: string | null;
        notes: string | null;
      };
      student: {
        id: number;
        name: string;
        email: string;
      };
    };
    message: string;
  }> {
    console.log(`📖 Fetching session details for enrollment ${enrollmentId}`);
    return makeRequest(`/sessions/enrolled/${enrollmentId}`, {}, true); // Requires authentication
  },

  /**
   * Check enrollment status for a specific session
   */
  async getMyEnrollmentForSession(sessionId: number): Promise<{
    success: boolean;
    data: {
      session: Session;
      is_enrolled: boolean;
      enrollment: {
        id: number;
        enrollment_date: string;
        payment_status: string;
        payment_amount: number | null;
        access_granted: boolean;
        completed: boolean;
        progress: number;
        last_accessed_at: string | null;
      } | null;
    };
    message: string;
  }> {
    console.log(`🔍 Checking enrollment status for session ${sessionId}`);
    return makeRequest(`/sessions/${sessionId}/my-enrollment`, {}, true); // Requires authentication
  },

  /**
   * Update an existing session (mentor only)
   */
  async updateSession(
    id: number,
    sessionData: UpdateSessionRequest
  ): Promise<SessionResponse> {
    console.log(`📝 Updating session ${id}:`, sessionData);
    return makeRequest(
      `/sessions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(sessionData),
      },
      true
    ); // Requires authentication
  },

  /**
   * Edit session (alias for updateSession)
   */
  async editSession(
    id: number,
    sessionData: UpdateSessionRequest
  ): Promise<SessionResponse> {
    return this.updateSession(id, sessionData);
  },

  /**
   * Toggle session status (enable/disable)
   */
  async toggleSessionStatus(
    id: number,
    is_enabled: boolean
  ): Promise<SessionResponse> {
    console.log(`🔄 Toggling session ${id} status to: ${is_enabled}`);
    return makeRequest(
      `/sessions/${id}/toggle`,
      {
        method: "PATCH",
        body: JSON.stringify({ is_enabled }),
      },
      true
    ); // Requires authentication
  },

  /**
   * Disable a session
   */
  async disableSession(id: number): Promise<SessionResponse> {
    console.log(`❌ Disabling session ${id}`);
    return this.toggleSessionStatus(id, false);
  },

  /**
   * Enable a disabled session
   */
  async enableSession(id: number): Promise<SessionResponse> {
    console.log(`✅ Enabling session ${id}`);
    return this.toggleSessionStatus(id, true);
  },

  /**
   * Delete a session permanently
   */
  async deleteSession(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    console.log(`🗑️ Deleting session ${id}`);
    return makeRequest(
      `/sessions/${id}`,
      {
        method: "DELETE",
      },
      true
    ); // Requires authentication
  },

  /**
   * Get all sessions with filtering (public endpoint)
   */
  async getSessions(
    filters: SessionFilters = {}
  ): Promise<SessionsListResponse> {
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

    const url = `/sessions${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return makeRequest(url, {}, false); // Public endpoint, no auth required
  },

  /**
   * Get single session by ID
   */
  async getSessionById(id: number): Promise<SessionResponse> {
    return makeRequest(`/sessions/${id}`, {}, false); // Public endpoint, no auth required
  },

  /**
   * Get upcoming sessions
   */
  async getUpcomingSessions(
    filters?: Omit<SessionFilters, "is_enabled" | "sort_by" | "sort_order">
  ): Promise<SessionsListResponse> {
    return this.getSessions({
      ...filters,
      is_enabled: true,
      sort_by: "session_date",
      sort_order: "asc",
    });
  },

  /**
   * Get analytics for user's sessions
   */
  async getMySessionsAnalytics(): Promise<any> {
    console.log("📊 Fetching sessions analytics");
    return makeRequest("/sessions/user/analytics", {}, true); // Requires authentication
  },

  /**
   * Search sessions by keyword
   */
  async searchSessions(
    keyword: string,
    filters?: Omit<SessionFilters, "search">
  ): Promise<SessionsListResponse> {
    return this.getSessions({
      ...filters,
      search: keyword,
    });
  },
};
