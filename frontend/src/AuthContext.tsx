import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type UserCredential,
} from "firebase/auth";

import type { User } from "firebase/auth";
import type { UserProfile, BackendUser, UserRole } from "./types/auth";
import { apiService } from "./services/api";

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Convert backend user to frontend user profile
  const convertBackendUser = (backendUser: BackendUser): UserProfile => {
    return {
      uid: backendUser.firebase_uid,
      email: backendUser.email,
      displayName: backendUser.display_name || '',
      firstName: backendUser.first_name || undefined,
      lastName: backendUser.last_name || undefined,
      role: backendUser.role,
      isActive: backendUser.is_active,
      createdAt: new Date(backendUser.created_at),
      lastLogin: backendUser.last_login ? new Date(backendUser.last_login) : null,
    };
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await apiService.getUserProfile() as { data: BackendUser };
      if (response.data) {
        return convertBackendUser(response.data);
      }
    } catch (error: any) {
      if (error.message && error.message.includes('401')) {
        // Token rejected by backend, force logout
        setAuthError('Session expired. Please log in again.');
        await logout();
      } else {
        setAuthError('Failed to fetch user profile from backend.');
      }
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  useEffect(() => {
    // Set to false for production, true for testing
    const USE_MOCK_PROFILE = false; // 🔧 REAL AUTH ENABLED - Firebase users now exist!
    // TEMPORARY: Set to true to bypass backend during Firebase testing
    const BYPASS_BACKEND = false;

    // Fetch user profile from backend
    const fetchUserProfileInEffect = async (): Promise<UserProfile | null> => {
      try {
        const response = await apiService.getUserProfile() as { data: BackendUser };
        if (response.data) {
          return convertBackendUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
      return null;
    };

    if (USE_MOCK_PROFILE || BYPASS_BACKEND) {
      // Mock user profile for UI testing
      const mockProfile: UserProfile = {
        uid: 'mock-user-123',
        email: 'admin@gmail.com',
        displayName: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin', // 🎯 Change this to test different roles
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date(),
        isActive: true,
        profileData: {
          bio: 'System Administrator with full access to manage users and system settings.',
          skills: ['User Management', 'System Administration', 'Security'],
          interests: ['Astronomy', 'Education', 'Technology']
        }
      };

      setUser({
        uid: 'mock-user-123',
        email: 'admin@gmail.com',
        displayName: 'Admin User'
      } as User);
      setUserProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 Auth state changed:', { user: !!firebaseUser, email: firebaseUser?.email });

      // Check for redirect result first
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult) {
          console.log('✅ Google redirect sign-in successful:', redirectResult.user.email);
          // Handle the redirect result like a normal Google sign-in
          firebaseUser = redirectResult.user;
        }
      } catch (redirectError) {
        console.error('❌ Error handling redirect result:', redirectError);
      }

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Fetch user profile from backend
          const profile = await fetchUserProfileInEffect();
          if (profile) {
            console.log('✅ User profile loaded:', { role: profile.role, email: profile.email });
            setUserProfile(profile);
          } else {
            // Create a fallback profile if backend fails
            console.log('⚠️ Backend profile failed, creating fallback profile');
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'User',
              role: getDefaultRoleFromEmail(firebaseUser.email || ''),
              isActive: true,
              createdAt: new Date(),
              lastLogin: new Date()
            };
            setUserProfile(fallbackProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          // Create a fallback profile on error
          const fallbackProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: getDefaultRoleFromEmail(firebaseUser.email || ''),
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          setUserProfile(fallbackProfile);
        }
      } else {
        console.log('❌ No user, clearing profile');
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    firstName?: string,
    lastName?: string
  ): Promise<void> => {
    setAuthError(null);
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      throw new Error('Invalid email format');
    }
    let userCredential: UserCredential | null = null;
    try {
      // Step 1: Create Firebase user first
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      // Step 2: Try to register with backend
      try {
        await apiService.registerUser({
          email,
          displayName,
          firstName,
          lastName,
          role: 'learner'
        });
        // Step 3: Fetch the complete user profile from backend
        const profile = await fetchUserProfile();
        setUserProfile(profile);
      } catch (backendError: any) {
        setAuthError('Failed to register user with backend. Please try again.');
        // Create a fallback profile so user can still use the app
        const fallbackProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || email,
          displayName: displayName,
          firstName,
          lastName,
          role: 'learner',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        setUserProfile(fallbackProfile);
      }
    } catch (firebaseError) {
      setAuthError('Failed to create user. Please check your credentials and try again.');
      throw firebaseError;
    }
  };

  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    setAuthError(null);
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address.');
      throw new Error('Invalid email format');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserProfile();
      if (!profile) {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          const basicProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || email,
            displayName: firebaseUser.displayName || 'User',
            role: getDefaultRoleFromEmail(email),
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          setUserProfile(basicProfile);
          setAuthError('Failed to fetch user profile from backend.');
          return basicProfile;
        }
      }
      setUserProfile(profile);
      return profile;
    } catch (firebaseError: any) {
      setAuthError('Login failed. Please check your credentials and try again.');
      // ...existing code for test accounts and fallback...
      const error = firebaseError as { code?: string; message?: string };
      const testAccounts = [
        { email: 'admin@gmail.com', password: 'admin123', displayName: 'Admin User' },
        { email: 'moderator@gmail.com', password: 'moderator', displayName: 'Moderator User' },
        { email: 'mentor@gmail.com', password: 'mentor', displayName: 'Mentor User' },
        { email: 'influencer@gmail.com', password: 'influencer', displayName: 'Influencer User' },
        { email: 'guide@gmail.com', password: 'guide123', displayName: 'Guide User' },
        { email: 'enthusiast@gmail.com', password: 'enthusiast', displayName: 'Enthusiast User' },
        { email: 'learner@gmail.com', password: 'learner', displayName: 'Learner User' }
      ];
      const testAccount = testAccounts.find(account =>
        account.email === email && account.password === password
      );
      if (testAccount && error.code === 'auth/user-not-found') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: testAccount.displayName });
          await apiService.registerUser({
            email: testAccount.email,
            displayName: testAccount.displayName,
            role: 'learner'
          });
          const profile = await fetchUserProfile();
          if (!profile) {
            const basicProfile: UserProfile = {
              uid: userCredential.user.uid,
              email: testAccount.email,
              displayName: testAccount.displayName,
              role: getDefaultRoleFromEmail(testAccount.email),
              isActive: true,
              createdAt: new Date(),
              lastLogin: new Date()
            };
            setUserProfile(basicProfile);
            setAuthError('Failed to fetch user profile from backend.');
            return basicProfile;
          }
          setUserProfile(profile);
          return profile;
        } catch (createError) {
          setAuthError('Failed to create test user.');
          throw new Error(`Failed to create test user: ${email}. Error: ${createError}`);
        }
      } else if (testAccount && error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password for test account');
        throw new Error('Incorrect password for test account');
      } else {
        throw new Error(error.message || 'Authentication failed');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setAuthError(null);
    } catch (error) {
      setAuthError('Logout failed. Please try again.');
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    setAuthError(null);
    try {
      let result;
      try {
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: any) {
        const popupAuthError = popupError as { code?: string; message?: string };
        if (popupAuthError.code === 'auth/popup-blocked' ||
          popupAuthError.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, googleProvider);
          return null;
        } else {
          setAuthError('Google sign-in failed.');
          throw popupError;
        }
      }
      const user = result.user;
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      if (isNewUser) {
        try {
          const nameParts = user.displayName?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          await apiService.registerUser({
            email: user.email || '',
            displayName: user.displayName || '',
            firstName,
            lastName,
            role: 'learner'
          });
        } catch (registrationError) {
          setAuthError('Failed to register Google user with backend.');
        }
      }
      let profile;
      try {
        profile = await fetchUserProfile();
      } catch (profileError) {
        setAuthError('Failed to fetch user profile from backend.');
        profile = null;
      }
      if (!profile) {
        const basicProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Google User',
          firstName: user.displayName?.split(' ')[0],
          lastName: user.displayName?.split(' ').slice(1).join(' ') || undefined,
          role: 'learner',
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };
        setUserProfile(basicProfile);
        return basicProfile;
      }
      setUserProfile(profile);
      return profile;
    } catch (error: any) {
      setAuthError('Google sign-in failed.');
      const authError = error as { code?: string; message?: string };
      if (authError.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled');
      } else if (authError.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in popup was blocked. Please allow popups and try again.');
      } else if (authError.code === 'auth/account-exists-with-different-credential') {
        throw new Error('An account already exists with the same email address but different sign-in credentials.');
      } else {
        throw new Error(authError.message || 'Google sign-in failed');
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile['profileData']>): Promise<void> => {
    if (!userProfile) return;

    // Update local profile data (for UI responsiveness)
    const updatedProfile: UserProfile = {
      ...userProfile,
      profileData: { ...userProfile.profileData, ...data }
    };
    setUserProfile(updatedProfile);

    // In a real implementation, you'd send this to your backend
    // For now, we'll just update local state
    try {
      // TODO: Implement backend API call for profile updates
      console.log('Profile data updated locally:', data);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert local changes if backend update fails
      setUserProfile(userProfile);
      throw error;
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Helper function to determine default role from email for test accounts
  const getDefaultRoleFromEmail = (email: string): UserRole => {
    if (email.includes('admin@')) return 'admin';
    if (email.includes('moderator@')) return 'moderator';
    if (email.includes('mentor@')) return 'mentor';
    if (email.includes('influencer@')) return 'influencer';
    if (email.includes('guide@')) return 'guide';
    if (email.includes('enthusiast@')) return 'enthusiast';
    return 'learner'; // Default role
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signup,
      login,
      logout,
      signInWithGoogle,
      updateUserProfile,
      refreshUserProfile,
      authError,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the UserRole type for use in other components
export type { UserRole } from './types/auth';
