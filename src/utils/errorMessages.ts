// Error message utility for authentication
export const getFirebaseErrorMessage = (error: unknown): string => {
    const authError = error as { code?: string; message?: string };
    const errorCode = authError?.code || '';
    const errorMessage = authError?.message || '';

    switch (errorCode) {
        // Authentication errors
        case 'auth/user-not-found':
            return 'No account found with this email address. Please check your email or create a new account.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again or reset your password.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please wait a few minutes before trying again.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection and try again.';

        // Account creation errors
        case 'auth/email-already-in-use':
            return 'An account with this email already exists. Please sign in instead.';
        case 'auth/weak-password':
            return 'Password is too weak. Please choose a stronger password with at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'Google sign-in is not enabled. Please contact support or try email/password sign-in.';
        case 'auth/admin-restricted-operation':
            return 'This operation is restricted by the administrator. Please contact support.';

        // Google Sign-in errors
        case 'auth/popup-closed-by-user':
            return 'Google sign-in was cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Google sign-in popup was blocked. Please allow popups for this site and try again.';
        case 'auth/cancelled-popup-request':
            return 'Google sign-in was cancelled. Please try again.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with this email using a different sign-in method. Please try signing in with your original method.';
        case 'auth/credential-already-in-use':
            return 'This Google account is already linked to another user.';
        case 'auth/unauthorized-domain':
            return 'This domain is not authorized for Google sign-in. Please contact support.';
        case 'auth/operation-not-supported-in-this-environment':
            return 'Google sign-in is not supported in this browser environment. Please try a different browser.';
        case 'auth/auth-domain-config-required':
            return 'Google sign-in configuration error. Please contact support.';
        case 'auth/invalid-api-key':
            return 'Invalid API configuration. Please contact support.';

        // Generic errors
        case 'auth/invalid-credential':
            return 'Invalid login credentials. Please check your email and password.';
        case 'auth/user-token-expired':
            return 'Your session has expired. Please sign in again.';
        case 'auth/requires-recent-login':
            return 'For security reasons, please sign in again to complete this action.';

        // Backend/API errors
        case 'backend/user-registration-failed':
            return 'Failed to create your account. Please try again.';
        case 'backend/profile-fetch-failed':
            return 'Account created successfully, but there was an issue loading your profile. Please sign in again.';
        case 'backend/server-error':
            return 'Server error. Please try again in a few minutes.';

        // Network/Connection errors
        default:
            if (errorMessage.toLowerCase().includes('network')) {
                return 'Network error. Please check your internet connection and try again.';
            }
            if (errorMessage.toLowerCase().includes('timeout')) {
                return 'Request timed out. Please try again.';
            }
            if (errorMessage.toLowerCase().includes('cors')) {
                return 'Connection error. Please refresh the page and try again.';
            }

            // Return the original message if it's user-friendly, otherwise provide a generic message
            if (errorMessage && errorMessage.length < 100 && !errorMessage.includes('Firebase')) {
                return errorMessage;
            }

            return 'An unexpected error occurred. Please try again.';
    }
};

// Validation error messages
export const getValidationErrorMessage = (field: string, value: string): string | null => {
    switch (field) {
        case 'email':
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
            return null;

        case 'password':
            if (!value) return 'Password is required';
            if (value.length < 6) return 'Password must be at least 6 characters long';
            if (value.length > 128) return 'Password must be less than 128 characters';
            return null;

        case 'confirmPassword':
            if (!value) return 'Please confirm your password';
            return null;

        case 'firstName':
            if (!value) return 'First name is required';
            if (value.length < 2) return 'First name must be at least 2 characters';
            if (value.length > 50) return 'First name must be less than 50 characters';
            return null;

        case 'lastName':
            if (!value) return 'Last name is required';
            if (value.length < 2) return 'Last name must be at least 2 characters';
            if (value.length > 50) return 'Last name must be less than 50 characters';
            return null;

        default:
            return null;
    }
};

// Success messages
export const getSuccessMessage = (action: string): string => {
    switch (action) {
        case 'signup':
            return 'Account created successfully! Welcome to STELLARION.';
        case 'login':
            return 'Welcome back! Redirecting to your dashboard...';
        case 'google-signin':
            return 'Successfully signed in with Google! Redirecting...';
        case 'logout':
            return 'You have been signed out successfully.';
        case 'password-reset':
            return 'Password reset email sent! Please check your inbox.';
        default:
            return 'Operation completed successfully!';
    }
};
