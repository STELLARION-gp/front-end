import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface CreateQuizData {
  title: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Hard';
  time_limit: number; // in minutes
  questions: {
    question: string;
    answers: string[];
    correct_answer: string;
    question_explanation?: string;
  }[];
}

export interface UpdateQuizData {
  title?: string;
  category?: string;
  description?: string;
  level?: 'Beginner' | 'Intermediate' | 'Hard';
  time_limit?: number;
  questions?: {
    question: string;
    answers: string[];
    correct_answer: string;
    question_explanation?: string;
  }[];
}

export interface Quiz {
  id: number;
  name: string;
  category: string;
  description: string;
  time: string | null;
  question_count: number;
  participants_count: number;
  time_limit: number;
  user_id: number;
  created_at: string;
  modified_at: string;
  level: 'Beginner' | 'Intermediate' | 'Hard';
  creator: {
    id: number;
    display_name?: string;
    first_name?: string;
    last_name?: string;
  };
  questions: QuizQuestion[];
  participants?: any[];
  hasParticipated?: boolean;
  userScore?: number | null;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  question: string;
  answers: string[];
  correct_answer?: string; // Only included for quiz creator
  question_explanation?: string;
}

export interface SubmitAnswersData {
  answers: {
    question_id: number;
    selected_answer: string;
  }[];
}

export interface QuizResult {
  quiz_id: number;
  score: number;
  correct_answers: number;
  total_questions: number;
  percentage: number;
  answers: {
    question_id: number;
    question: string;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
    explanation?: string;
  }[];
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  total_score: number;
  quizzes_completed: number;
  average_score: number;
  rank: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  stats: {
    totalParticipants: number;
    totalQuizAttempts: number;
    averageScore: number;
    highestScore: number;
  };
  userRank?: {
    rank: number;
    entry: LeaderboardEntry;
  };
}

const getAuthHeaders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }
    const token = await user.getIdToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error getting auth token:', error);
    throw error;
  }
};

// Get all available quizzes (not created by user)
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes`, headers);
    return response.data.data.quizzes;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

// Get quizzes created by the user
export const getMyQuizzes = async (): Promise<Quiz[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes/my`, headers);
    return response.data.data.quizzes;
  } catch (error) {
    console.error('Error fetching my quizzes:', error);
    throw error;
  }
};

// Get quiz by ID
export const getQuizById = async (quizId: number): Promise<Quiz> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes/${quizId}`, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

// Create a new quiz
export const createQuiz = async (quizData: CreateQuizData): Promise<Quiz> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/api/quizzes`, quizData, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

// Update a quiz
export const updateQuiz = async (quizId: number, quizData: UpdateQuizData): Promise<Quiz> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(`${API_URL}/api/quizzes/${quizId}`, quizData, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

// Delete a quiz
export const deleteQuiz = async (quizId: number): Promise<void> => {
  try {
    const headers = await getAuthHeaders();
    await axios.delete(`${API_URL}/api/quizzes/${quizId}`, headers);
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

// Start a quiz
export const startQuiz = async (quizId: number): Promise<Quiz> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/api/quizzes/${quizId}/start`, {}, headers);
    return response.data.data.quiz;
  } catch (error) {
    console.error('Error starting quiz:', error);
    throw error;
  }
};

// Submit quiz answers
export const submitQuizAnswers = async (quizId: number, answers: SubmitAnswersData): Promise<QuizResult> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_URL}/api/quizzes/${quizId}/submit`, answers, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

// Get quiz leaderboard
export const getQuizLeaderboard = async (): Promise<LeaderboardData> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes/leaderboard`, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

// Get results for a quiz (for quiz creator)
export const getQuizResults = async (quizId: number): Promise<any[]> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/results`, headers);
    return response.data.data.results;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    throw error;
  }
};

// Get user's result for a specific quiz
export const getMyQuizResult = async (quizId: number): Promise<QuizResult> => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_URL}/api/quizzes/${quizId}/my-result`, headers);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    throw error;
  }
};

