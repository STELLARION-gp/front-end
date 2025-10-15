// services/sessionsService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Session {
    id: number;
    mentor_id: number;
    title: string;
    description: string;
    session_type: 'one-on-one' | 'group' | 'workshop' | 'webinar';
    topic: string;
    duration_minutes: number;
    max_participants: number;
    current_participants: number;
    price: number;
    currency: string;
    scheduled_at: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'disabled';
    meeting_link?: string;
    meeting_platform?: string;
    prerequisites?: string;
    materials?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    // Virtual fields from joins
    mentor_name?: string;
    mentor_email?: string;
    mentor_display_name?: string;
    is_enrolled?: boolean;
}

export interface CreateSessionRequest {
    title: string;
    description: string;
    session_type: 'one-on-one' | 'group' | 'workshop' | 'webinar';
    topic: string;
    duration_minutes: number;
    max_participants: number;
    price: number;
    currency?: string;
    scheduled_at: string;
    meeting_link?: string;
    meeting_platform?: string;
    prerequisites?: string;
    materials?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface UpdateSessionRequest {
    title?: string;
    description?: string;
    session_type?: 'one-on-one' | 'group' | 'workshop' | 'webinar';
    topic?: string;
    duration_minutes?: number;
    max_participants?: number;
    price?: number;
    currency?: string;
    scheduled_at?: string;
    status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'disabled';
    meeting_link?: string;
    meeting_platform?: string;
    prerequisites?: string;
    materials?: string[];
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface SessionFilters {
    status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'disabled';
    mentor_id?: number;
    session_type?: 'one-on-one' | 'group' | 'workshop' | 'webinar';
    topic?: string;
    search?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
    sort_by?: 'scheduled_at' | 'created_at' | 'price' | 'title' | 'current_participants';
    sort_order?: 'asc' | 'desc';
}

export interface SessionEnrollment {
    id: number;
    session_id: number;
    user_id: number;
    enrollment_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    payment_status: 'pending' | 'paid' | 'refunded';
    enrolled_at: string;
    cancelled_at?: string;
    session?: Session;
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

export const sessionsService = {
    /**
     * Get all sessions with filtering
     */
    async getSessions(filters: SessionFilters = {}) {
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
        
        const url = `/sessions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return makeRequest(url);
    },

    /**
     * Get single session by ID
     */
    async getSessionById(id: number) {
        return makeRequest(`/sessions/${id}`);
    },

    /**
     * Create a new session (mentor only)
     */
    async createSession(sessionData: CreateSessionRequest): Promise<{ session: Session }> {
        console.log('Creating new session:', sessionData);
        return makeRequest('/sessions', {
            method: 'POST',
            body: JSON.stringify({
                ...sessionData,
                currency: sessionData.currency || 'USD'
            })
        });
    },

    /**
     * Get all sessions created by the current mentor
     */
    async getMySessions(filters: Omit<SessionFilters, 'mentor_id'> = {}): Promise<{ sessions: Session[]; total: number; page: number; limit: number }> {
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
        
        const url = `/sessions/my-sessions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('Fetching my sessions from:', url);
        return makeRequest(url);
    },

    /**
     * Update an existing session (mentor only)
     */
    async updateSession(id: number, sessionData: UpdateSessionRequest): Promise<{ session: Session }> {
        console.log(`Updating session ${id}:`, sessionData);
        return makeRequest(`/sessions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(sessionData)
        });
    },

    /**
     * Edit session (alias for updateSession)
     */
    async editSession(id: number, sessionData: UpdateSessionRequest): Promise<{ session: Session }> {
        return this.updateSession(id, sessionData);
    },

    /**
     * Disable a session
     * Sets the session status to 'disabled'
     */
    async disableSession(id: number): Promise<{ session: Session }> {
        console.log(`Disabling session ${id}`);
        return makeRequest(`/sessions/${id}/disable`, {
            method: 'PUT'
        });
    },

    /**
     * Enable a disabled session
     * Sets the session status back to 'scheduled'
     */
    async enableSession(id: number): Promise<{ session: Session }> {
        console.log(`Enabling session ${id}`);
        return makeRequest(`/sessions/${id}/enable`, {
            method: 'PUT'
        });
    },

    /**
     * Cancel a session
     * Sets the session status to 'cancelled'
     */
    async cancelSession(id: number): Promise<{ session: Session }> {
        console.log(`Cancelling session ${id}`);
        return makeRequest(`/sessions/${id}/cancel`, {
            method: 'PUT'
        });
    },

    /**
     * Delete a session permanently
     */
    async deleteSession(id: number): Promise<{ message: string }> {
        console.log(`Deleting session ${id}`);
        return makeRequest(`/sessions/${id}`, {
            method: 'DELETE'
        });
    },

    /**
     * Enroll in a session (learner)
     */
    async enrollInSession(sessionId: number): Promise<{ enrollment: SessionEnrollment }> {
        console.log(`Enrolling in session ${sessionId}`);
        return makeRequest(`/sessions/${sessionId}/enroll`, {
            method: 'POST'
        });
    },

    /**
     * Cancel enrollment in a session (learner)
     */
    async cancelEnrollment(sessionId: number): Promise<{ message: string }> {
        console.log(`Cancelling enrollment in session ${sessionId}`);
        return makeRequest(`/sessions/${sessionId}/enroll`, {
            method: 'DELETE'
        });
    },

    /**
     * Get all enrollments for the current user
     */
    async getMyEnrollments(filters?: { 
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
        page?: number;
        limit?: number;
    }): Promise<{ enrollments: SessionEnrollment[]; total: number }> {
        const queryParams = new URLSearchParams();
        
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }
        
        const url = `/sessions/my-enrollments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return makeRequest(url);
    },

    /**
     * Get all enrollments for a specific session (mentor only)
     */
    async getSessionEnrollments(sessionId: number): Promise<{ enrollments: SessionEnrollment[] }> {
        return makeRequest(`/sessions/${sessionId}/enrollments`);
    },

    /**
     * Get upcoming sessions
     */
    async getUpcomingSessions(filters?: Omit<SessionFilters, 'status' | 'date_from'>): Promise<{ sessions: Session[]; total: number }> {
        const now = new Date().toISOString();
        return this.getSessions({
            ...filters,
            status: 'scheduled',
            date_from: now,
            sort_by: 'scheduled_at',
            sort_order: 'asc'
        });
    },

    /**
     * Search sessions by keyword
     */
    async searchSessions(keyword: string, filters?: Omit<SessionFilters, 'search'>): Promise<{ sessions: Session[]; total: number }> {
        return this.getSessions({
            ...filters,
            search: keyword
        });
    }
};
