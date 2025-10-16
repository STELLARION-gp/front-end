/**
 * Centralized API Configuration
 *
 * This file provides a single source of truth for all API-related URLs.
 * All service files should import from here instead of hardcoding URLs.
 */

export const API_CONFIG = {
  /**
   * Base URL of the backend server (without /api)
   * Example: http://localhost:5000
   */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",

  /**
   * API endpoint prefix
   * Example: /api
   */
  API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "/api",

  /**
   * Full API URL (BASE_URL + API_ENDPOINT)
   * Example: http://localhost:5000/api
   */
  get FULL_API_URL(): string {
    return `${this.BASE_URL}${this.API_ENDPOINT}`;
  },

  /**
   * Alias for FULL_API_URL (for backward compatibility)
   */
  get API_BASE_URL(): string {
    return this.FULL_API_URL;
  },

  /**
   * Chatbot API URL
   */
  get CHATBOT_API_URL(): string {
    return import.meta.env.VITE_CHATBOT_API_URL || this.FULL_API_URL;
  },

  /**
   * Backend URL (for direct backend access)
   */
  get BACKEND_URL(): string {
    return import.meta.env.VITE_BACKEND_URL || this.BASE_URL;
  },
} as const;

/**
 * Helper function to build API endpoints
 * @param path - The endpoint path (e.g., '/users', '/subscriptions')
 * @returns Full URL for the endpoint
 */
export const buildApiUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_CONFIG.FULL_API_URL}${cleanPath}`;
};

/**
 * Export for direct use in service files
 */
export default API_CONFIG;
