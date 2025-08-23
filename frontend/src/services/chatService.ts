import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api';

export interface GroupChat {
  id: number;
  name: string;
  description: string;
  type: 'public' | 'private';
  created_by: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  members?: GroupMember[];
  member_count?: number;
  last_message?: string;
  last_message_time?: string;
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  role: 'admin' | 'member';
  joined_at: string;
  user?: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
}

export interface ChatMessage {
  id: number;
  group_id: number;
  user_id: number;
  content: string;
  message_type: 'text' | 'image' | 'file';
  sent_at: string;
  is_deleted: boolean;
  user?: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  id: number;
  message_id: number;
  user_id: number;
  reaction_type: string;
  created_at: string;
  user?: {
    id: number;
    display_name: string;
    first_name: string;
    last_name: string;
  };
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  type: 'public' | 'private';
}

export interface SendMessageRequest {
  content: string;
  message_type?: 'text' | 'image' | 'file';
}

class ChatService {
  private async getAuthHeaders() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const token = await user.getIdToken();
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('Authentication failed');
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Get all public groups or user's groups
  async getGroups(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: 'all' | 'public' | 'joined';
  }): Promise<{
    groups: GroupChat[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.type) queryParams.append('type', params.type);

      const response = await fetch(
        `${API_BASE_URL}/chat/groups?${queryParams.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  }

  // Get user's joined groups
  async getUserGroups(): Promise<{
    groups: GroupChat[];
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/user/groups`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  }

  // Create a new group
  async createGroup(groupData: CreateGroupRequest): Promise<{
    group: GroupChat;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/groups`, {
        method: 'POST',
        headers,
        body: JSON.stringify(groupData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  // Join a group
  async joinGroup(groupId: number): Promise<{
    message: string;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/groups/${groupId}/join`, {
        method: 'POST',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  // Leave a group
  async leaveGroup(groupId: number): Promise<{
    message: string;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/groups/${groupId}/leave`, {
        method: 'DELETE',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  // Get group details
  async getGroupDetails(groupId: number): Promise<{
    group: GroupChat;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/groups/${groupId}`, {
        method: 'GET',
        headers,
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching group details:', error);
      throw error;
    }
  }

  // Get group messages
  async getGroupMessages(groupId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    messages: ChatMessage[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(
        `${API_BASE_URL}/chat/groups/${groupId}/messages?${queryParams.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching group messages:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(groupId: number, messageData: SendMessageRequest): Promise<{
    message: ChatMessage;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/groups/${groupId}/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify(messageData),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // React to a message
  async reactToMessage(messageId: number, reactionType: string): Promise<{
    reaction: MessageReaction;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reaction_type: reactionType }),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error reacting to message:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;
