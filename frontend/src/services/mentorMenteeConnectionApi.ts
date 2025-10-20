// services/mentorMenteeConnectionApi.ts
import axios from 'axios';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000';

const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export interface ConnectionDetails {
  application: any;
  connection: {
    connection_id: number; // Primary key from database
    id: number; // Alias for connection_id
    mentor_id: number;
    mentee_id: number;
    status: string;
    created_at: string;
    ended_at: string | null;
    end_reason: string | null;
  } | null;
}

export interface Note {
  note_id: number;
  connection_id: number;
  created_by: number;
  title: string | null;
  content: string;
  tags: string[];
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
  };
}

export interface Goal {
  goal_id: number;
  connection_id: number;
  created_by: number;
  title: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get connection details
 */
export const getConnectionDetails = async (applicationId: number): Promise<ConnectionDetails> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Save a new note
 */
export const saveNote = async (
  applicationId: number,
  noteData: {
    title: string;
    content: string;
    tags?: string[];
    isPinned?: boolean;
  }
): Promise<Note> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/notes`,
    noteData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Get all notes for a connection
 */
export const getNotes = async (applicationId: number): Promise<Note[]> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/notes`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Update a note
 */
export const updateNote = async (
  noteId: number,
  noteData: {
    title?: string;
    content?: string;
    tags?: string[];
    isPinned?: boolean;
  }
): Promise<Note> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.put(
    `${API_BASE_URL}/api/mentor-mentee-connections/notes/${noteId}`,
    noteData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId: number): Promise<void> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  await axios.delete(
    `${API_BASE_URL}/api/mentor-mentee-connections/notes/${noteId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Create a new goal
 */
export const createGoal = async (
  applicationId: number,
  goalData: {
    title: string;
    description?: string;
    deadline?: string;
  }
): Promise<Goal> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.post(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/goals`,
    goalData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Get all goals for a connection
 */
export const getGoals = async (applicationId: number): Promise<Goal[]> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.get(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/goals`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Create a new session (mentor schedules a session)
 */
export const createSession = async (
  applicationId: number,
  sessionData: {
    title: string;
    description?: string;
    session_date: string; // ISO string
    duration?: number; // minutes
    meeting_link?: string;
    notes?: string;
  }
): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error('Authentication required. Please log in.');

  const response = await axios.post(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/sessions`,
    sessionData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Get all sessions for a connection
 */
export const getSessions = async (applicationId: number): Promise<any[]> => {
  const token = await getAuthToken();
  if (!token) throw new Error('Authentication required. Please log in.');

  const response = await axios.get(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/sessions`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Update a session
 */
export const updateSession = async (
  sessionId: number,
  sessionData: {
    title?: string;
    description?: string;
    session_date?: string;
    duration?: number;
    meeting_link?: string;
    notes?: string;
  }
): Promise<any> => {
  const token = await getAuthToken();
  if (!token) throw new Error('Authentication required. Please log in.');

  const response = await axios.put(
    `${API_BASE_URL}/api/mentor-mentee-connections/sessions/${sessionId}`,
    sessionData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * Delete a session
 */
export const deleteSession = async (sessionId: number): Promise<void> => {
  const token = await getAuthToken();
  if (!token) throw new Error('Authentication required. Please log in.');

  await axios.delete(
    `${API_BASE_URL}/api/mentor-mentee-connections/sessions/${sessionId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Update a goal
 */
export const updateGoal = async (
  goalId: number,
  goalData: {
    title?: string;
    description?: string;
    status?: 'not_started' | 'in_progress' | 'completed';
    progress?: number;
    deadline?: string;
  }
): Promise<Goal> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  const response = await axios.put(
    `${API_BASE_URL}/api/mentor-mentee-connections/goals/${goalId}`,
    goalData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.data;
};

/**
 * End mentorship connection
 */
export const endConnection = async (
  applicationId: number,
  reason?: string
): Promise<void> => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in.');
  }

  await axios.post(
    `${API_BASE_URL}/api/mentor-mentee-connections/${applicationId}/end`,
    { reason },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
