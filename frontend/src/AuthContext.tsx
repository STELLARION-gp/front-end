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
    } catch (error) {
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
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
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

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    firstName?: string,
    lastName?: string
  ): Promise<void> => {
    let userCredential: UserCredential | null = null;

    try {
      // Step 1: Create Firebase user first
      console.log('🔥 Creating Firebase user...');
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      console.log('✅ Firebase user created successfully');

      // Step 2: Try to register with backend
      try {
        console.log('📡 Registering user with backend...');
        await apiService.registerUser({
          email,
          displayName,
          firstName,
          lastName,
          role: 'learner' // Default role
        });
        console.log('✅ Backend registration successful');

        // Step 3: Fetch the complete user profile from backend
        console.log('📡 Fetching user profile from backend...');
        const profile = await fetchUserProfile();
        setUserProfile(profile);
        console.log('✅ User profile loaded from backend');

      } catch (backendError) {
        console.warn('⚠️ Backend registration failed, creating fallback profile:', backendError);

        // Create a fallback profile so user can still use the app
        const fallbackProfile: UserProfile = {
          uid: userCredential.user.uid,
          email: userCredential.user.email || email,
          displayName: displayName,
          firstName,
          lastName,
          role: 'learner', // Default role
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        setUserProfile(fallbackProfile);
        console.log('✅ Fallback profile created, user can proceed');

        // Note: The user is successfully registered in Firebase
        // Backend sync can happen later when backend is available
      }

    } catch (firebaseError) {
      console.error('❌ Firebase user creation failed:', firebaseError);
      throw firebaseError; // Only throw if Firebase creation fails
    }
  };

  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    console.log('🔐 Starting login process for:', email);

    try {
      // Try to sign in with Firebase first
      console.log('🔥 Attempting Firebase sign in...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase sign in successful');

      // If successful, fetch profile from backend
      console.log('📡 Fetching user profile from backend...');
      const profile = await fetchUserProfile();
      console.log('✅ Profile fetched:', profile);

      // If backend profile fetch fails, create a basic profile from Firebase user
      if (!profile) {
        console.log('⚠️ Backend profile fetch failed, creating basic profile');
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          const basicProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || email,
            displayName: firebaseUser.displayName || 'User',
            role: getDefaultRoleFromEmail(email), // Determine role from email
            isActive: true,
            createdAt: new Date(),
            lastLogin: new Date()
          };
          setUserProfile(basicProfile);
          return basicProfile;
        }
      }

      setUserProfile(profile);
      return profile; // Return the profile for immediate use
    } catch (firebaseError: unknown) {
      const error = firebaseError as { code?: string; message?: string };
      console.error('❌ Firebase login error:', error);

      // If Firebase login fails, check if this is a test account
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
          // Create the Firebase user automatically
          console.log('🔧 Creating Firebase user for test account:', email);
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(userCredential.user, { displayName: testAccount.displayName });
          console.log('✅ Firebase user created successfully');

          // Register with backend
          console.log('📡 Registering user with backend...');
          await apiService.registerUser({
            email: testAccount.email,
            displayName: testAccount.displayName,
            role: 'learner' // Default role, backend will update based on email
          });
          console.log('✅ Backend registration successful');

          // Fetch the profile from backend
          console.log('📡 Fetching updated profile from backend...');
          const profile = await fetchUserProfile();
          console.log('✅ Final profile:', profile);

          // If backend profile fetch fails, create a basic profile
          if (!profile) {
            console.log('⚠️ Backend profile fetch failed, creating basic profile for test user');
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
            return basicProfile;
          }

          setUserProfile(profile);

          console.log('🎉 Successfully created and logged in test user:', email);
          return profile; // Return the profile for immediate use
        } catch (createError) {
          console.error('❌ Error creating test user:', createError);
          throw new Error(`Failed to create test user: ${email}. Error: ${createError}`);
        }
      } else if (testAccount && error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password for test account');
      } else {
        // Re-throw the original Firebase error for non-test accounts
        throw new Error(error.message || 'Authentication failed');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    try {
      console.log('🔐 Starting Google sign-in process...');

      // Try popup first, fall back to redirect if it fails
      let result;
      try {
        console.log('🪟 Attempting popup sign-in...');
        result = await signInWithPopup(auth, googleProvider);
      } catch (popupError: unknown) {
        const popupAuthError = popupError as { code?: string; message?: string };
        console.warn('⚠️ Popup failed, attempting redirect:', popupAuthError.code);
        
        if (popupAuthError.code === 'auth/popup-blocked' || 
            popupAuthError.code === 'auth/popup-closed-by-user') {
          console.log('🔄 Using redirect method as fallback...');
          await signInWithRedirect(auth, googleProvider);
          return null; // Redirect will reload the page
        } else {
          throw popupError; // Re-throw if it's a different error
        }
      }

      const user = result.user;

      console.log('✅ Google sign-in successful:', user.email);
      console.log('🔍 User details:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      });

      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      if (isNewUser) {
        console.log('👤 New user detected, registering with backend...');

        // Extract names from displayName
        const nameParts = user.displayName?.split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Register new user with backend
        await apiService.registerUser({
          email: user.email || '',
          displayName: user.displayName || '',
          firstName,
          lastName,
          role: 'learner' // Default role
        });
      }

      // Fetch user profile from backend
      console.log('📡 Fetching user profile from backend...');
      const profile = await fetchUserProfile();

      if (!profile) {
        console.log('⚠️ Backend profile fetch failed, creating basic profile');
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
      console.log('🎉 Google authentication successful');
      return profile;

    } catch (error: unknown) {
      console.error('❌ Google sign-in error:', error);
      console.error('🔍 Full error object:', JSON.stringify(error, null, 2));

      const authError = error as { code?: string; message?: string };
      console.error('🔍 Error code:', authError.code);
      console.error('🔍 Error message:', authError.message);

      // Handle specific Google auth errors
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
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the UserRole type for use in other components
export type { UserRole } from './types/auth';
