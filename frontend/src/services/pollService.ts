// services/pollService.ts
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

// Poll types
export type PollChoiceType = 'yes' | 'maybe' | 'no';

export interface PollChoice {
    choice: PollChoiceType;
    vote_count: number;
    percentage: number;
}

export interface PollCreator {
    id: number;
    first_name?: string;
    last_name?: string;
    display_name?: string;
}

export interface Poll {
    id: number;
    title: string;
    description?: string | null;
    is_active: boolean;
    created_at: Date | string;
    updated_at: Date | string;
    creator: PollCreator;
    choices: PollChoice[];
    total_votes: number;
    comment_count: number;
    user_vote?: PollChoiceType | null;
}

export interface PollComment {
    id: number;
    poll_id: number;
    user_id: number;
    comment: string;
    created_at: Date | string;
    updated_at: Date | string;
    commenter: {
        id: number;
        first_name?: string;
        last_name?: string;
        display_name?: string;
    };
}

export interface CreatePollRequest {
    title: string;
    description?: string;
}

export interface UpdatePollRequest {
    title?: string;
    description?: string;
    is_active?: boolean;
}

export interface VoteRequest {
    choice: PollChoiceType;
}

export interface AddCommentRequest {
    comment: string;
}

export interface PollFilters {
    page?: number;
    limit?: number;
    is_active?: boolean;
    sort_by?: 'created_at' | 'updated_at';
    sort_order?: 'asc' | 'desc';
}

export interface CommentFilters {
    page?: number;
    limit?: number;
    sort_order?: 'asc' | 'desc';
}

// API Response interfaces
export interface PollResponse {
    success: boolean;
    data: Poll;
    message: string;
}

export interface PollsListResponse {
    success: boolean;
    data: Poll[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message: string;
}

export interface PollResultsResponse {
    success: boolean;
    data: {
        poll: {
            id: number;
            title: string;
            description?: string | null;
            is_active: boolean;
            created_at: Date | string;
            updated_at: Date | string;
            creator: PollCreator;
            comment_count: number;
        };
        results: PollChoice[];
        total_votes: number;
        user_vote?: PollChoiceType | null;
    };
    message: string;
}

export interface VoteResponse {
    success: boolean;
    data: {
        id: number;
        poll_id: number;
        choice_id: number;
        user_id: number;
        voted_at: Date | string;
        choice: {
            choice: PollChoiceType;
            vote_count: number;
        };
        voter: {
            id: number;
            display_name?: string;
            first_name?: string;
            last_name?: string;
        };
    };
    message: string;
}

export interface CommentResponse {
    success: boolean;
    data: PollComment;
    message: string;
}

export interface CommentsListResponse {
    success: boolean;
    data: PollComment[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message: string;
}

export interface DeleteResponse {
    success: boolean;
    message: string;
}

const getAuthToken = async (): Promise<string | null> => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn('⚠️ No authenticated user found - User needs to log in');
            return null;
        }
        const token = await user.getIdToken(true); // Force refresh the token
        console.log('✅ Got auth token for user:', user.email);
        return token;
    } catch (error) {
        console.error('❌ Error getting auth token:', error);
        return null;
    }
};

const makeRequest = async (url: string, options: RequestInit = {}, requireAuth: boolean = true) => {
    const token = await getAuthToken();
    
    // Check if authentication is required but not available
    if (requireAuth && !token) {
        throw new Error('Authentication required. Please log in to continue.');
    }
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };
    
    if (token) {
        headers.Authorization = `Bearer ${token}`;
        console.log('✅ Added Authorization header with Bearer token');
    } else {
        console.warn('⚠️ No token available - making unauthenticated request');
    }
    
    console.log(`🌐 Making ${options.method || 'GET'} request to: ${API_BASE_URL}${url}`);
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers
    });
    
    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('❌ Request failed:', errorData);
        
        // Provide better error messages
        if (response.status === 401) {
            throw new Error(`Authentication failed: ${errorData.message || 'Please log in again.'}`);
        }
        if (response.status === 403) {
            throw new Error('You do not have permission to perform this action.');
        }
        
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Request successful:', data.message || 'OK');
    return data;
};

export const pollService = {
    /**
     * Create a new poll
     */
    async createPoll(pollData: CreatePollRequest): Promise<PollResponse> {
        console.log('📝 Creating new poll:', pollData);
        return makeRequest('/polls', {
            method: 'POST',
            body: JSON.stringify(pollData)
        }, true); // Requires authentication
    },

    /**
     * Get all polls with optional filters
     */
    async getPolls(filters: PollFilters = {}): Promise<PollsListResponse> {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });
        
        const url = `/polls${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('📋 Fetching polls from:', url);
        return makeRequest(url, {}, false); // Public endpoint
    },

    /**
     * Get active polls only
     */
    async getActivePolls(filters?: Omit<PollFilters, 'is_active'>): Promise<PollsListResponse> {
        return this.getPolls({
            ...filters,
            is_active: true
        });
    },

    /**
     * Get a single poll by ID
     */
    async getPollById(id: number): Promise<PollResponse> {
        console.log(`📋 Fetching poll ${id}`);
        return makeRequest(`/polls/${id}`, {}, false); // Public endpoint
    },

    /**
     * Get poll results with voting statistics
     */
    async getPollResults(id: number): Promise<PollResultsResponse> {
        console.log(`📊 Fetching results for poll ${id}`);
        return makeRequest(`/polls/${id}/results`, {}, false); // Public endpoint
    },

    /**
     * Vote on a poll
     */
    async voteOnPoll(pollId: number, choice: PollChoiceType): Promise<VoteResponse> {
        console.log(`🗳️ Voting ${choice} on poll ${pollId}`);
        return makeRequest(`/polls/${pollId}/vote`, {
            method: 'POST',
            body: JSON.stringify({ choice })
        }, true); // Requires authentication
    },

    /**
     * Update a poll (creator only)
     */
    async updatePoll(id: number, pollData: UpdatePollRequest): Promise<PollResponse> {
        console.log(`📝 Updating poll ${id}:`, pollData);
        return makeRequest(`/polls/${id}`, {
            method: 'PUT',
            body: JSON.stringify(pollData)
        }, true); // Requires authentication
    },

    /**
     * Close a poll (set is_active to false)
     */
    async closePoll(id: number): Promise<PollResponse> {
        console.log(`🔒 Closing poll ${id}`);
        return this.updatePoll(id, { is_active: false });
    },

    /**
     * Reopen a poll (set is_active to true)
     */
    async reopenPoll(id: number): Promise<PollResponse> {
        console.log(`🔓 Reopening poll ${id}`);
        return this.updatePoll(id, { is_active: true });
    },

    /**
     * Delete a poll (creator only)
     */
    async deletePoll(id: number): Promise<DeleteResponse> {
        console.log(`🗑️ Deleting poll ${id}`);
        return makeRequest(`/polls/${id}`, {
            method: 'DELETE'
        }, true); // Requires authentication
    },

    /**
     * Get all comments for a poll
     */
    async getPollComments(pollId: number, filters: CommentFilters = {}): Promise<CommentsListResponse> {
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value.toString());
            }
        });
        
        const url = `/polls/${pollId}/comments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        console.log('💬 Fetching comments from:', url);
        return makeRequest(url, {}, false); // Public endpoint
    },

    /**
     * Add a comment to a poll
     */
    async addComment(pollId: number, comment: string): Promise<CommentResponse> {
        console.log(`💬 Adding comment to poll ${pollId}`);
        return makeRequest(`/polls/${pollId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ comment })
        }, true); // Requires authentication
    },

    /**
     * Delete a comment (commenter only)
     */
    async deleteComment(pollId: number, commentId: number): Promise<DeleteResponse> {
        console.log(`🗑️ Deleting comment ${commentId} from poll ${pollId}`);
        return makeRequest(`/polls/${pollId}/comments/${commentId}`, {
            method: 'DELETE'
        }, true); // Requires authentication
    },

    /**
     * Check if current user has voted on a poll
     * Returns the user's choice if voted, null otherwise
     */
    async checkUserVote(pollId: number): Promise<PollChoiceType | null> {
        try {
            const response = await this.getPollResults(pollId);
            return response.data.user_vote || null;
        } catch (error) {
            console.error('Error checking user vote:', error);
            return null;
        }
    },

    /**
     * Get poll statistics
     */
    async getPollStats(pollId: number): Promise<{
        totalVotes: number;
        yesPercentage: number;
        maybePercentage: number;
        noPercentage: number;
        commentCount: number;
    }> {
        const response = await this.getPollResults(pollId);
        const { results, total_votes, poll } = response.data;
        
        const yesChoice = results.find(r => r.choice === 'yes');
        const maybeChoice = results.find(r => r.choice === 'maybe');
        const noChoice = results.find(r => r.choice === 'no');
        
        return {
            totalVotes: total_votes,
            yesPercentage: yesChoice?.percentage || 0,
            maybePercentage: maybeChoice?.percentage || 0,
            noPercentage: noChoice?.percentage || 0,
            commentCount: poll.comment_count
        };
    },

    /**
     * Get latest polls (sorted by creation date, descending)
     */
    async getLatestPolls(limit: number = 10): Promise<PollsListResponse> {
        return this.getPolls({
            page: 1,
            limit,
            sort_by: 'created_at',
            sort_order: 'desc'
        });
    },

    /**
     * Get most active polls (sorted by total votes, requires calculation)
     * Note: This gets all polls and sorts client-side. For better performance,
     * consider adding a server-side endpoint that sorts by vote count.
     */
    async getMostActivePolls(limit: number = 10): Promise<Poll[]> {
        const response = await this.getPolls({
            page: 1,
            limit: 50, // Get more to have options
            is_active: true
        });
        
        // Sort by total votes descending
        const sortedPolls = response.data.sort((a, b) => b.total_votes - a.total_votes);
        
        // Return only the requested limit
        return sortedPolls.slice(0, limit);
    }
};

export default pollService;
