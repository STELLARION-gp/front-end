/**
 * Utility functions for handling and formatting error messages
 */

/**
 * Extract user-friendly error message from error object
 * Removes technical details like localhost URLs and backend stack traces
 */
export const getErrorMessage = (error: any, fallbackMessage: string = 'An unexpected error occurred'): string => {
  let message = fallbackMessage;

  // Try to extract message from axios error response
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.response?.data?.error) {
    message = error.response.data.error;
  } else if (error?.message) {
    message = error.message;
  }

  // Clean up localhost references and URLs
  message = message.replace(/http:\/\/localhost:\d+(\/[^\s]*)?/gi, 'the server');
  message = message.replace(/https:\/\/localhost:\d+(\/[^\s]*)?/gi, 'the server');
  message = message.replace(/localhost:\d+(\/[^\s]*)?/gi, 'the server');
  message = message.replace(/127\.0\.0\.1:\d+(\/[^\s]*)?/gi, 'the server');
  message = message.replace(/\[::1\]:\d+(\/[^\s]*)?/gi, 'the server');
  
  // Clean up any remaining localhost mentions
  message = message.replace(/\blocalhost\b/gi, 'the server');
  
  // Clean up technical API paths
  message = message.replace(/\/api\/[^\s]*/gi, '');
  message = message.replace(/\bAPI\b/g, 'service');
  
  // Clean up redundant phrases
  message = message.replace(/failed to fetch from the server/gi, 'Unable to connect to the server');
  message = message.replace(/error connecting to the server/gi, 'Unable to connect to the server');
  message = message.replace(/the server\s+/g, 'the server ');

  // Handle common technical error messages
  if (message.includes('Network Error') || message.includes('ERR_CONNECTION_REFUSED')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (message.includes('ECONNREFUSED')) {
    return 'The server is currently unavailable. Please try again later.';
  }

  if (message.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }

  if (message.includes('CORS')) {
    return 'A security error occurred. Please contact support if this persists.';
  }

  // Handle HTTP status codes
  const status = error?.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return message || 'This action conflicts with existing data.';
      case 422:
        return message || 'The data provided is invalid. Please check your inputs.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'A server error occurred. Our team has been notified.';
      case 502:
      case 503:
        return 'The server is temporarily unavailable. Please try again in a few moments.';
      case 504:
        return 'The server took too long to respond. Please try again.';
    }
  }

  return message;
};

/**
 * Get user-friendly success message
 */
export const getSuccessMessage = (action: string, resource?: string): string => {
  const resourceStr = resource ? ` ${resource}` : '';
  
  switch (action) {
    case 'create':
    case 'created':
      return `${resourceStr || 'Item'} created successfully!`;
    case 'update':
    case 'updated':
      return `${resourceStr || 'Item'} updated successfully!`;
    case 'delete':
    case 'deleted':
      return `${resourceStr || 'Item'} deleted successfully!`;
    case 'submit':
    case 'submitted':
      return `${resourceStr || 'Form'} submitted successfully!`;
    case 'save':
    case 'saved':
      return `${resourceStr || 'Changes'} saved successfully!`;
    case 'send':
    case 'sent':
      return `${resourceStr || 'Message'} sent successfully!`;
    default:
      return `${action} completed successfully!`;
  }
};

/**
 * Validation error messages
 */
export const ValidationMessages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, length: number) => `${field} must be at least ${length} characters`,
  maxLength: (field: string, length: number) => `${field} must not exceed ${length} characters`,
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  positive: (field: string) => `${field} must be a positive number`,
  min: (field: string, value: number) => `${field} must be at least ${value}`,
  max: (field: string, value: number) => `${field} must not exceed ${value}`,
  match: (field1: string, field2: string) => `${field1} and ${field2} must match`,
  unique: (field: string) => `This ${field} is already in use`,
  format: (field: string) => `${field} format is invalid`,
};
