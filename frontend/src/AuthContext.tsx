import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
    try {
      // Create Firebase user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      // Register user with backend
      await apiService.registerUser({
        email,
        displayName,
        firstName,
        lastName,
        role: 'learner' // Default role
      });

      // Fetch the complete user profile from backend
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
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
      updateUserProfile,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
