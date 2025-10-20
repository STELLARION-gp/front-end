import { auth } from '../firebase';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.API_BASE_URL;

const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export interface MentorMenteeMessage {
  message_id: number;
  connection_id: number;
  sender_id: number;
  message_text: string;
  message_type: string;
  is_read: boolean;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  read_at: string | null;
  sender: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
  is_own_message: boolean;
}

export interface SendMessagePayload {
  content: string;
  type?: 'text' | 'image' | 'file';
}

class MentorMenteeChatService {
  private async getAuthHeaders() {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('User not authenticated');
      }

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
      throw new Error(
        errorData.message || errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  // Get messages for a connection
  async getMessages(
    connectionId: number,
    params?: {
      page?: number;
      limit?: number;
      before_id?: number;
    }
  ): Promise<{
    messages: MentorMenteeMessage[];
    pagination: {
      total_messages: number;
      has_more: boolean;
      next_cursor: number | null;
      current_page: number;
    };
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.before_id) queryParams.append('before_id', params.before_id.toString());

      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/${connectionId}/messages?${queryParams.toString()}`,
        {
          method: 'GET',
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    connectionId: number,
    payload: SendMessagePayload
  ): Promise<{
    message: MentorMenteeMessage;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/${connectionId}/messages`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markAsRead(connectionId: number): Promise<{
    marked_count: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/${connectionId}/mark-read`,
        {
          method: 'PUT',
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount(connectionId: number): Promise<{
    unread_count: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/${connectionId}/unread-count`,
        {
          method: 'GET',
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Edit a message
  async editMessage(
    messageId: number,
    content: string
  ): Promise<{
    message: MentorMenteeMessage;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/messages/${messageId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ content }),
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Delete a message
  async deleteMessage(messageId: number): Promise<{
    message_id: number;
  }> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${API_BASE_URL}/mentor-mentee-chat/messages/${messageId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      const result = await this.handleResponse(response);
      return result.data || result;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
}

export const mentorMenteeChatService = new MentorMenteeChatService();
export default mentorMenteeChatService;

// Legacy exports for backwards compatibility
export const getMessages = (connectionId: number, page?: number, limit?: number, beforeId?: number) =>
  mentorMenteeChatService.getMessages(connectionId, { page, limit, before_id: beforeId });

export const sendMessage = (connectionId: number, payload: SendMessagePayload) =>
  mentorMenteeChatService.sendMessage(connectionId, payload);

export const markAsRead = (connectionId: number) =>
  mentorMenteeChatService.markAsRead(connectionId);

export const getUnreadCount = (connectionId: number) =>
  mentorMenteeChatService.getUnreadCount(connectionId);

export const editMessage = (messageId: number, content: string) =>
  mentorMenteeChatService.editMessage(messageId, content);

export const deleteMessage = (messageId: number) =>
  mentorMenteeChatService.deleteMessage(messageId);
