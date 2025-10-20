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
  participants_count?: number; // number of confirmed/registered participants
  difficulty_level: DifficultyLevel;
  session_link?: string | null;
  description: string;
  materials?: string[];
  session_notes?: string | null;
  created_by: number;
  is_enabled: boolean;
  status?: SessionStatus; // Session approval status
  moderated_by?: number | null;
  moderated_at?: Date | string | null;
  approved_at?: Date | string | null;
  rejected_at?: Date | string | null;
  rejection_reason?: string | null;
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
  // Moderator info when included
  moderator?: {
    id: number;
    first_name?: string;
    last_name?: string;
    email: string;
    display_name?: string;
  } | null;
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
      return null;
    }
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
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
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));

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
  return result;
};

export const sessionsService = {
  /**
   * Create a new session (mentor only)
   */
  async createSession(
    sessionData: CreateSessionRequest
  ): Promise<SessionResponse> {
    return makeRequest(
      "/sessions",
      {
        method: "POST",
        body: JSON.stringify(sessionData),
      },
      true
    );
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
    return makeRequest(url, {}, true);
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
    return makeRequest(url, {}, true);
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
    return makeRequest(`/sessions/enrolled/${enrollmentId}`, {}, true);
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
    return makeRequest(`/sessions/${sessionId}/my-enrollment`, {}, true);
  },

  /**
   * Update an existing session (mentor only)
   */
  async updateSession(
    id: number,
    sessionData: UpdateSessionRequest
  ): Promise<SessionResponse> {
    return makeRequest(
      `/sessions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(sessionData),
      },
      true
    );
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
    return makeRequest(
      `/sessions/${id}/toggle`,
      {
        method: "PATCH",
        body: JSON.stringify({ is_enabled }),
      },
      true
    );
  },

  /**
   * Disable a session
   */
  async disableSession(id: number): Promise<SessionResponse> {
    return this.toggleSessionStatus(id, false);
  },

  /**
   * Enable a disabled session
   */
  async enableSession(id: number): Promise<SessionResponse> {
    return this.toggleSessionStatus(id, true);
  },

  /**
   * Delete a session permanently
   */
  async deleteSession(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    return makeRequest(
      `/sessions/${id}`,
      {
        method: "DELETE",
      },
      true
    );
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
    return makeRequest("/sessions/user/analytics", {}, true);
  },

  /**
   * Get all pending sessions (moderator only)
   */
  async getPendingSessions(
    filters: {
      page?: number;
      limit?: number;
      sort_by?: "created_at" | "session_date" | "title";
      sort_order?: "asc" | "desc";
    } = {}
  ): Promise<SessionsListResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return makeRequest(
      `/sessions/admin/pending${queryString ? `?${queryString}` : ""}`,
      {},
      true
    );
  },

  /**
   * Get sessions for moderation with optional status filter (moderator only)
   */
  async getModerationSessions(
    filters: {
      page?: number;
      limit?: number;
      status?: SessionStatus | "all";
      sort_by?: "created_at" | "session_date" | "title";
      sort_order?: "asc" | "desc";
    } = {}
  ): Promise<SessionsListResponse> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "all") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return makeRequest(
      `/sessions/admin/moderation${queryString ? `?${queryString}` : ""}`,
      {},
      true
    );
  },

  /**
   * Approve a session (moderator only)
   */
  async approveSession(id: number): Promise<SessionResponse> {
    return makeRequest(
      `/sessions/${id}/approve`,
      {
        method: "PATCH",
      },
      true
    );
  },

  /**
   * Reject a session with reason (moderator only)
   */
  async rejectSession(
    id: number,
    rejectionReason: string
  ): Promise<SessionResponse> {
    return makeRequest(
      `/sessions/${id}/reject`,
      {
        method: "PATCH",
        body: JSON.stringify({ rejection_reason: rejectionReason }),
      },
      true
    );
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

  /**
   * Enroll in a paid session with payment details
   */
  async enrollInPaidSession(
    sessionId: number,
    paymentDetails: {
      cardNumber: string;
      cardHolderName: string;
      expiryDate: string;
      cvv: string;
    }
  ): Promise<{
    success: boolean;
    data: {
      enrollment_id: number;
      session_id: number;
      payment_status: string;
      enrollment_date: string;
    };
    message: string;
  }> {
    return makeRequest(
      `/sessions/${sessionId}/enroll/paid`,
      {
        method: "POST",
        body: JSON.stringify({
          payment_details: {
            card_number: paymentDetails.cardNumber.replace(/\s/g, ''),
            card_holder: paymentDetails.cardHolderName,
            expiry_date: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv,
          },
        }),
      },
      true
    );
  },

  /**
   * Enroll in a free session
   */
  async enrollInFreeSession(
    sessionId: number
  ): Promise<{
    success: boolean;
    data: {
      enrollment_id: number;
      session_id: number;
      payment_status: string;
      enrollment_date: string;
    };
    message: string;
  }> {
    return makeRequest(
      `/sessions/${sessionId}/enroll/free`,
      {
        method: "POST",
      },
      true
    );
  },

  /**
   * Get enrollments for a specific session (creator only)
   */
  async getSessionEnrollments(sessionId: number): Promise<{
    success: boolean;
    data: {
      session_id: number;
      session_title: string;
      total_enrollments: number;
      enrollments: Array<{
        id: number;
        session_id: number;
        user_id: number;
        enrolled_at: string;
        payment_status: string;
        amount_paid: number;
        user_name?: string;
        user_email?: string;
      }>;
    };
    message: string;
  }> {
    return makeRequest(`/sessions/${sessionId}/enrollments`, {}, true);
  },
};
