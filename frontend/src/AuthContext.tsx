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

// Define user roles
export type UserRole = 'admin' | 'moderator' | 'mentor' | 'learner' | 'guide' | 'influencer' | 'enthusiast';

// Extended user interface with role and profile data
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  profileData?: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
  };
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string, role: UserRole) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile['profileData']>) => Promise<void>;
}

// Export AuthContextType for use in other files
export type { AuthContextType };

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For UI testing purposes - set this to true to use mock data
    const USE_MOCK_PROFILE = true;

    if (USE_MOCK_PROFILE) {
      // Mock user profile for UI testing
      const mockProfile: UserProfile = {
        uid: 'mock-user-123',
        email: 'john.doe@stellarion.com',
        displayName: 'John Doe',
        role: 'guide', // 🎯 Change this to test different roles:
        // 'admin' - Full access to everything including admin panel
        // 'moderator' - Access to moderation tools
        // 'mentor' - Access to mentoring features
        // 'guide' - Access to events and guiding features  
        // 'influencer' - Access to blogging features
        // 'enthusiast' - Basic enthusiast features
        // 'learner' - Basic learner features
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date(),
        isActive: true,
        profileData: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          bio: 'Passionate astronomy enthusiast and educator with over 10 years of stargazing experience.',
          skills: ['Astrophotography', 'Telescope Setup', 'Star Navigation', 'Teaching'],
          interests: ['Deep Space Objects', 'Planetary Observation', 'Meteor Showers', 'Solar Eclipses']
        }
      };

      setUser({
        uid: 'mock-user-123',
        email: 'john.doe@stellarion.com',
        displayName: 'John Doe'
      } as User); // Mock user for authentication
      setUserProfile(mockProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // In a real app, you would fetch user profile from your backend
        // For now, we'll create a mock profile based on localStorage or default
        const storedProfile = localStorage.getItem(`userProfile_${user.uid}`);
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          // Default profile for new users
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            role: 'learner', // default role
            createdAt: new Date(),
            lastLogin: new Date(),
            isActive: true,
          };
          setUserProfile(defaultProfile);
          localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(defaultProfile));
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string, role: UserRole): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    // Create user profile
    const newUserProfile: UserProfile = {
      uid: userCredential.user.uid,
      email,
      displayName,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
    };

    setUserProfile(newUserProfile);
    localStorage.setItem(`userProfile_${userCredential.user.uid}`, JSON.stringify(newUserProfile));

    // Here you would typically send this data to your backend
    await sendUserDataToBackend(newUserProfile);

    return userCredential;
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Update last login
    if (userProfile) {
      const updatedProfile = { ...userProfile, lastLogin: new Date() };
      setUserProfile(updatedProfile);
      localStorage.setItem(`userProfile_${userCredential.user.uid}`, JSON.stringify(updatedProfile));
      await sendUserDataToBackend(updatedProfile);
    }

    return userCredential;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile['profileData']>): Promise<void> => {
    if (!userProfile) return;

    const updatedProfile: UserProfile = {
      ...userProfile,
      profileData: { ...userProfile.profileData, ...data }
    };

    setUserProfile(updatedProfile);
    localStorage.setItem(`userProfile_${userProfile.uid}`, JSON.stringify(updatedProfile));
    await sendUserDataToBackend(updatedProfile);
  };

  // Function to send user data to backend
  const sendUserDataToBackend = async (profile: UserProfile): Promise<void> => {
    try {
      // Replace with your actual backend endpoint
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        console.error('Failed to sync user data with backend');
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signup,
      login,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
